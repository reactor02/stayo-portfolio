//UI관련된 공통 함수관련
// mouserover click 등등
$(() => {
  window.App = {
    state: {},
    initHeader: () => console.log("header init"),
    initLnb: () => console.log("lnb init")
  };

  $("#header").load("/partials/header.html", App.initHeader);
  $("#lnb").load("/partials/lnb.html", App.initLnb);
});


















const DBKEY = {
  properties: "jungseoks_childs.db.properties",
  rooms: "jungseoks_childs.db.rooms",
  members: "jungseoks_childs.db.members",
  reviews: "jungseoks_childs.db.reviews",
  reservations: "jungseoks_childs.db.reservations",
  searches: "jungseoks_childs.db.searches",
  tags: "jungseoks_childs.db.tags",
  wishlist: "jungseoks_childs.db.wishlist" // 찜은 이 키로 추가 권장
};

//1) 공통: 로드/세이브/페이지네이션
const loadTable = (key, fallback = []) =>
  JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));

const saveTable = (key, rows) =>
  localStorage.setItem(key, JSON.stringify(rows));

const paginate = (rows, page = 1, pageSize = 20) => {
  const total = rows.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const p = Math.min(Math.max(1, page), pages);
  const start = (p - 1) * pageSize;
  return {
    page: p,
    pageSize,
    total,
    pages,
    items: rows.slice(start, start + pageSize)
  };
};

// 2) 숙소 조회 (지역/별점/찜/태그/편의시설/키워드)
// 2-1. 인덱스 helpers (성능)

const reviewAggByProperty = () => {
  const reviews = loadTable(DBKEY.reviews, []);
  const map = {}; // propertyId -> {sum, cnt}
  reviews.forEach(r => {
    const pid = r.propertyId;
    if (!pid) return;
    map[pid] ??= { sum: 0, cnt: 0 };
    map[pid].sum += Number(r.rating || 0);
    map[pid].cnt += 1;
  });
  // 평균 계산은 조회 시
  return map;
};

const wishlistSet = (memberId) => {
  const wishlist = loadTable(DBKEY.wishlist, []); 
  // 권장 row: { memberId, propertyId, createdAt }
  return new Set(wishlist.filter(x => x.memberId === memberId).map(x => x.propertyId));
};

const tagsByProperty = () => {
  const rows = loadTable(DBKEY.tags, []);
  const map = {};
  rows.forEach(x => { if (x.propertyId) map[x.propertyId] = x.tags || []; });
  return map;
};


//2-2. 메인 검색 함수 (한 방에)

const queryProperties = ({
  city, district,               // 지역
  minRating, maxRating,         // 별점(리뷰 테이블 기반 집계)
  onlyWishlistedByMemberId,     // 찜 필터
  hasFacilities,               // ["wifi","parking",...]
  tagIncludes,                 // ["커플","바다뷰"]
  keyword,                     // 숙소명/주소 등
  sort = "reco",               // "reco"|"rating"|"price"|"reviewCount"|"distance"(추후)
  page = 1, pageSize = 20
} = {}) => {

  const props = loadTable(DBKEY.properties, []);
  const agg = reviewAggByProperty();
  const tagsMap = tagsByProperty();
  const wish = onlyWishlistedByMemberId ? wishlistSet(onlyWishlistedByMemberId) : null;

  let rows = props.map(p => {
    const a = agg[p.propertyId] || { sum: 0, cnt: 0 };
    const avg = a.cnt ? (a.sum / a.cnt) : 0;
    return {
      ...p,
      _reviewAvg: avg,
      _reviewCnt: a.cnt,
      _tags: tagsMap[p.propertyId] || [],
      _wish: wish ? wish.has(p.propertyId) : false
    };
  });

  // filters
  if (city) rows = rows.filter(p => p.city === city);
  if (district) rows = rows.filter(p => p.district === district);

  if (minRating != null) rows = rows.filter(p => p._reviewAvg >= minRating);
  if (maxRating != null) rows = rows.filter(p => p._reviewAvg <= maxRating);

  if (wish) rows = rows.filter(p => p._wish);

  if (Array.isArray(hasFacilities) && hasFacilities.length) {
    rows = rows.filter(p => {
      const f = p.facilities || {};
      return hasFacilities.every(k => !!f[k]);
    });
  }

  if (Array.isArray(tagIncludes) && tagIncludes.length) {
    rows = rows.filter(p => tagIncludes.every(t => (p._tags || []).includes(t)));
  }

  if (keyword && keyword.trim()) {
    const q = keyword.trim().toLowerCase();
    rows = rows.filter(p =>
      (p.name || "").toLowerCase().includes(q) ||
      (p.address || "").toLowerCase().includes(q) ||
      (p.city || "").toLowerCase().includes(q) ||
      (p.district || "").toLowerCase().includes(q)
    );
  }

  // sorting (예시)
  if (sort === "rating") rows.sort((a,b) => b._reviewAvg - a._reviewAvg);
  else if (sort === "reviewCount") rows.sort((a,b) => b._reviewCnt - a._reviewCnt);
  else if (sort === "reco") rows.sort((a,b) => (b._reviewCnt*0.7 + b._reviewAvg) - (a._reviewCnt*0.7 + a._reviewAvg));

  return paginate(rows, page, pageSize);
};

//3) “지역별” 관련 함수들
const listCities = () => {
  const props = loadTable(DBKEY.properties, []);
  return [...new Set(props.map(p => p.city).filter(Boolean))].sort();
};

const listDistricts = (city) => {
  const props = loadTable(DBKEY.properties, []);
  return [...new Set(props.filter(p => p.city === city).map(p => p.district).filter(Boolean))].sort();
};

const countByCity = () => {
  const props = loadTable(DBKEY.properties, []);
  return props.reduce((m,p)=>((m[p.city]??=0), m[p.city]++, m),{});
};


//4) 숙소 상세/객실 조회
const getProperty = (propertyId) =>
  loadTable(DBKEY.properties, []).find(p => p.propertyId === propertyId) || null;

const listRoomsByProperty = (propertyId) =>
  loadTable(DBKEY.rooms, []).filter(r => r.propertyId === propertyId);


//5) 리뷰/별점 조회 (숙소별)
const listReviews = ({ propertyId, page=1, pageSize=10, sort="latest" } = {}) => {
  let rows = loadTable(DBKEY.reviews, []).filter(r => r.propertyId === propertyId);
  if (sort === "latest") rows.sort((a,b) => (b.createdAt||"").localeCompare(a.createdAt||""));
  if (sort === "rating") rows.sort((a,b) => Number(b.rating||0) - Number(a.rating||0));
  return paginate(rows, page, pageSize);
};

const getRatingSummary = (propertyId) => {
  const agg = reviewAggByProperty()[propertyId] || {sum:0,cnt:0};
  return { avg: agg.cnt ? agg.sum/agg.cnt : 0, count: agg.cnt };
};


//6) 찜(위시리스트) 조회/토글
const toggleWish = (memberId, propertyId) => {
  const rows = loadTable(DBKEY.wishlist, []);
  const idx = rows.findIndex(x => x.memberId===memberId && x.propertyId===propertyId);
  if (idx >= 0) rows.splice(idx, 1);
  else rows.push({ memberId, propertyId, createdAt: new Date().toISOString() });
  saveTable(DBKEY.wishlist, rows);
  return idx < 0; // true면 찜됨
};

const listWishlist = ({ memberId, page=1, pageSize=20 }={}) => {
  const wish = wishlistSet(memberId);
  const props = loadTable(DBKEY.properties, []).filter(p => wish.has(p.propertyId));
  return paginate(props, page, pageSize);
};


//7) 예약 조회 (사용자 기준 / 숙소 기준 / 기간 필터)
const listReservations = ({ memberId, propertyId, from, to, page=1, pageSize=20 } = {}) => {
  let rows = loadTable(DBKEY.reservations, []);
  if (memberId) rows = rows.filter(r => r.memberId === memberId);
  if (propertyId) rows = rows.filter(r => r.propertyId === propertyId);

  if (from) rows = rows.filter(r => (r.checkOut || "") >= from);
  if (to) rows = rows.filter(r => (r.checkIn || "") <= to);

  rows.sort((a,b) => (b.createdAt||"").localeCompare(a.createdAt||""));
  return paginate(rows, page, pageSize);
};

//8) 검색어 로그 조회 (사용자 검색어)
const logSearch = ({ memberId=null, keyword, city=null, createdAt=new Date().toISOString() }) => {
  const rows = loadTable(DBKEY.searches, []);
  rows.push({ id: crypto?.randomUUID?.() || ("S_"+Date.now()), memberId, keyword, city, createdAt });
  saveTable(DBKEY.searches, rows);
};

const listSearches = ({ memberId, keyword, page=1, pageSize=50 } = {}) => {
  let rows = loadTable(DBKEY.searches, []);
  if (memberId) rows = rows.filter(x => x.memberId === memberId);
  if (keyword) {
    const q = keyword.toLowerCase();
    rows = rows.filter(x => (x.keyword||"").toLowerCase().includes(q));
  }
  rows.sort((a,b) => (b.createdAt||"").localeCompare(a.createdAt||""));
  return paginate(rows, page, pageSize);
};

//9) 네가 말한 “등등” 후보 (추가로 바로 쓸 만한 것)
// queryPropertiesByBounds({minLat,maxLat,minLng,maxLng}) : 지도 화면용

// queryPropertiesByPrice({min,max, checkIn, checkOut, guests}) : 객실 가격/재고 기반 필터

// listTopRatedByCity(city, n) : 도시별 인기숙소

// listRecentlyViewed(memberId) : 최근 본 숙소




















// 더 줄이기 가능
// $(() => {
//   window.App = {
//     init: (sel, url, cb) => $(sel).load(url, cb)
//   };

//   App.init("#header", "/partials/header.html", () => console.log("H"));
//   App.init("#lnb", "/partials/lnb.html", () => console.log("L"));
// });



// 파라미터 받아오기
const param = k => new URL(location).searchParams.get(k);

// const param = function(k) {

//     const urlObject = new URL(location);      // 현재 주소를 URL 객체로 변환
//     const params = urlObject.searchParams;    // ? 뒤의 쿼리 파싱 객체
//     const value = params.get(k);              // key 값 추출

//     return value;
// };






// # 해당 페이지에서 해당 부분 출력 가능
// $(() => {

//   const App = window.App = {
//     say: () => console.log("hello")
//   };

//   $("#header").load("/partials/header.html");

// });
// <button onclick="App.say()">click</button>







// # 실무 가능

// $(() => {

//   const param = k => new URL(location).searchParams.get(k);

//   window.App = {
//     state: { roomId: param("roomId") },
//     renderHeader: () =>
//       App.state.roomId && $("#header .room").text(App.state.roomId)
//   };

//   $("#header").load("/partials/header.html", App.renderHeader);

// });
























// $(document).on("loadLnbComplete", () => {

//     const MENU_KEY = "jungseoks_kids.menu";
//     const menuData = JSON.parse(localStorage.getItem(MENU_KEY));

//     if(!menuData || !menuData.menus) return;

//     const $menuList = $("#menuList");
//     $menuList.empty();

//     menuData.menus.forEach((menu) => {
//         $menuList.append(
//             `<li><a href="${menu.url}">${menu.name}</a></li>`
//         );
//     });

// });