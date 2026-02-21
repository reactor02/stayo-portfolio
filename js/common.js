//UI관련된 공통 함수관련
// mouserover click 등등

//topHeader 뽑기


// 축약형 
//$(document).ready(function(){});
//$(function(){});
$(() => {

});



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

//대메뉴 뽑기 (index 없이 전체 / index 넣으면 하나)
function getTopMenu(topIndex) {
    const data = loadMenuFromStorage();
    if (!data || !data.menus) return null;

    if (topIndex === undefined) return data.menus; // 전체
    return data.menus[topIndex] ?? null;           // 하나
}

//중메뉴 뽑기
function getLeftMenu(topIndex, leftIndex) {
    const top = getTopMenu(topIndex);
    if (!top || !top.children) return null;

    if (leftIndex === undefined) return top.children; // 전체
    return top.children[leftIndex] ?? null;           // 하나
}

//소메뉴 뽑기
function getSubMenu(topIndex, leftIndex, subIndex) {
    const mid = getLeftMenu(topIndex, leftIndex);
    if (!mid || !mid.children) return null;

    if (subIndex === undefined) return mid.children; // 전체
    return mid.children[subIndex] ?? null;           // 하나
}


//대메뉴 UI 만들기
// function renderTopMenuUI() {

//   const topMenus = getTopMenu(); // 전체 대메뉴 가져오기
//   if (!topMenus) return;

//   const headerDiv = document.querySelector("#header div");
//   headerDiv.innerHTML = ""; // 초기화

//   topMenus.forEach((menu, index) => {

//     const a = document.createElement("a");
//     a.textContent = menu.title;

//     // index만 넘기기
//     a.href = `/view/wo/wo_main.html?top=${index}`;

//     headerDiv.appendChild(a);
//   });
// }

//Jquery 
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
      .attr("href", "/view/wo/wo_main.html?top=" + index);
    $div.append($a);
    $headerDiv.append($div);
  });
}

//Jquery 
function renderLeftMenuUI(topIndex , leftIndex) {

  const leftMenus = getLeftMenu(topIndex , leftIndex); //대메뉴와 중메뉴
  console.log(!leftMenus);
  if (!leftMenus) return;

  const $leftMenuDiv = $("#menu");
  $leftMenuDiv.empty(); // 초기화

  $.each(leftMenus, (index, menu) => {
    const $div = $("<div>")
    const $a = $("<a>")
      .text(menu.title)
      .attr("href", "/view/wo/wo_main.html?top=" + topIndex + "&left="+ index);
    $div.append($a);
    $leftMenuDiv.append($div);
  });
}