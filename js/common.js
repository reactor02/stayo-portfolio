//UI관련된 공통 함수관련
// mouserover click 등등
//****************** 여기서 부터는 안보셔도 됩니다. ****************/
// 1) 전역 상태
window.AppState = window.AppState || { top: null, left: null, sub: null };

const MENU_KEY = "jungseoks_kids.menu";

function initQueryParams() {
    const params = new URLSearchParams(location.search);

    AppState.top = parseInt(params.get("top"), 10);
    AppState.left = parseInt(params.get("left"), 10);
    AppState.sub = parseInt(params.get("sub"), 10);

    if (isNaN(AppState.top)) AppState.top = 0;
    if (isNaN(AppState.left)) AppState.left = null;
    if (isNaN(AppState.sub)) AppState.sub = null;
}

function initMenu() {
    const cached = loadMenuFromStorage();
    /*
    const d = $.Deferred(); // Promise 컨테이너 생성
    d.resolve(cached);      // 성공 상태로 만듦
    return d.promise();     // Promise 반환
    호출하는 쪽은 .done()을 기대 함으로 가짜.done 를 만들어주는 객체
    */
    if (cached) return $.Deferred().resolve(cached).promise();

    return $.getJSON("/storage/menu.json")
        .done((menuData) => saveMenuToStorage(menuData));
}

function bootstrapCommonUI() {
    // 헤더/메뉴 영역이 없는 페이지는 그냥 스킵
    const hasHeader = $("#header").length > 0;
    const hasMenu = $("#menu").length > 0;
    //optional chaining 방식 왼쪽값이 있으면 실행 ?.
    //if (hasHeader) renderTopMenuUI?.();              // 함수 있으면 호출
    //if (hasMenu) renderLeftMenuUI?.(AppState.top); // 함수 있으면 호출
}

// 초기 로드: menu.json 읽어서 storage에 저장
//웹스토리지에 JSON 등록 (로컬에 저장)
function saveMenuToStorage(menuData) {
    localStorage.setItem(MENU_KEY, JSON.stringify(menuData));
}

//웹스토리지에서 JSON 가져오기
function loadMenuFromStorage() {
    const raw = localStorage.getItem(MENU_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (e) {
        localStorage.removeItem(MENU_KEY);
        return null;
    }
}

// 축약형 
//$(document).ready(function(){});
//$(function(){});
$(() => {
    initQueryParams();

    initMenu()
        .done(() => bootstrapCommonUI())
        .fail((xhr) => console.error("menu.json load failed", xhr.status));
});
//전역 변수용 상태 객체
const AppState = {
    top: null,
    left: null,
    sub: null
};

//****************** 여기부터 보시면 됩니다. ****************/


//대메뉴 뽑기 (index 없이 전체 / index 넣으면 하나)
function getTopMenu(topIndex) {
    const data = loadMenuFromStorage();
    if (!data || !data.menus) return null;

    if (topIndex === undefined) return data.menus; // 전체
    return data.menus[topIndex] ?? null;           // 하나
}

//중메뉴 뽑기
function getLeftMenu(topIndex) {
    const top = getTopMenu(topIndex);
    if (!top || !top.children) return null;

    // if (leftIndex === undefined) return top.children; // 전체
    // return top.children[leftIndex] ?? null;           // 하나
    return top.children;
}

//소메뉴 뽑기
function getSubMenu(topIndex, leftIndex) {
    const mid = getLeftMenu(topIndex, leftIndex);
    if (!mid || !mid.children) return null;

    // if (subIndex === undefined) return mid.children; // 전체
    // return mid.children[subIndex] ?? null;           // 하나
    return mid.children; // 전체
}



//UI 함수들은 여기부터 입니다.

//대메뉴 UI
function renderTopMenuUI() {

    const topMenus = getTopMenu(); // 전체 대메뉴
    console.log(!topMenus);
    if (!topMenus) return;

    const $headerDiv = $("#header");
    $headerDiv.empty(); // 초기화

    $.each(topMenus, (index, menu) => {
        const $div = $("<div>")
        const $a = $("<a>")
            .text(menu.title)
            .attr("href", linkUrl(index));
        $div.append($a);
        $headerDiv.append($div);
    });
}

//중메뉴 UI
function renderLeftMenuUI(topIndex, leftIndex) {

    const leftMenus = getLeftMenu(topIndex, leftIndex); //대메뉴와 중메뉴
    console.log(!leftMenus);
    if (!leftMenus) return;

    const $leftMenuDiv = $("#menu");
    $leftMenuDiv.empty(); // 초기화

    $.each(leftMenus, (index, menu) => {
        const $div = $("<div>")
        const $a = $("<a>")
            .text(menu.title)
            .attr("href", linkUrl(topIndex,index));
        $div.append($a);
        $leftMenuDiv.append($div);
    });
}

//링크 url 
function linkUrl(topIndex, leftIndex, subIndex) {

  const topMenu = getTopMenu(topIndex);

  if (!topMenu) {
    alert("없는 경로입니다.");
    return "#";
  }

  const key = topMenu.key; // wo / lot / eqp / evt

  // 기본 경로 생성
  let url = `/view/${key}/${key}_main.html?top=${topIndex}`;

  if (leftIndex !== undefined && leftIndex !== null) {
    url += `&left=${leftIndex}`;
  }

  if (subIndex !== undefined && subIndex !== null) {
    url += `&sub=${subIndex}`;
  }

  return url;
}