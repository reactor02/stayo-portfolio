// window.addEventListener('load', bind)
// async function bind() {

//     // 필터 영역
//     const price_range = document.querySelector('.price-range')
//     const side_range_value = document.querySelector('.side-range__value')

//     let r;



//     function render() {
//         let num = price_range.value
//         let money = "" + num;
//         let result = "";

//         while (money.length > 3) {
//             result = "," + money.substring(money.length - 3) + result;
//             money = money.substring(0, money.length - 3);
//         }
//         result = money + result;
//         side_range_value.textContent = '₩ ' + result
//     }

//     price_range.addEventListener('input', () => {
//         render();
//     })

//     const side_apply = document.querySelector('.side-apply')
//     // const side_box = document.querySelector('.side_box')
//     const result_grid = document.querySelector('.result-grid')
//     const recomand = document.querySelector('.recomand')
//     const low = document.querySelector('.low')
//     const high = document.querySelector('.high')
//     const summary__btn = document.querySelector('.summary__btn')

//     summary__btn.addEventListener('click', () => {
//         alert('기능이 준비중입니다')
//     })


//     side_apply.addEventListener('click', () => {

//         alert('기능이 준비중입니다')

//     })

//     const select = document.querySelector('.select')

//     select.addEventListener('change', () => {
//         if (select.value == recomand.textContent) {

//             render1(items);
//         } else if (select.value == low.textContent) {
//             const sorted = [...items].sort((a, b) => a.priceFrom - b.priceFrom)
//             render1(sorted);
//         } else if (select.value == high.textContent) {
//             const sorted = [...items].sort((a, b) => b.rating - a.rating)
//             render1(sorted);
//         }
//     })

//     let items = [];


//     const logCall = (label, method, url, body) => {
//         console.log(`[CALL] ${label} :: ${method} ${url}`);
//         if (body !== undefined) console.log(`[BODY] ${label}`, body);
//     };

//     const logRes = (label, res) => console.log(`[RES] ${label}`, res);
//     const logErr = (label, xhr) => {
//         const rj = xhr?.responseJSON;
//         const status = xhr?.status;
//         const msg = rj?.message || rj?.error || xhr?.statusText || "요청 실패";
//         console.log(`[ERR] ${label} :: status=${status}`, rj || msg);
//     };


//     // DD.V1.TB.Lodging.list(q)
//     // const q = { city: '서울', page: 1, pageSize: 50 };
//     let listRes;
//     // try {
//     //     listRes = await DD.V1.TB.Lodging.list(q);
//     //     logRes("TB-LOD-1 PROPERTIES_LIST", listRes);
//     // } catch (e) {
//     //     logErr("TB-LOD-1 PROPERTIES_LIST", e);
//     //     return;
//     // }


//     listRes = await API.V1.TB.Lodging.properties({ city: '서울', page: 1, pageSize: 10 });

    
//     // console.log(q)
//     items = listRes.items;
//     console.log(listRes.items)
//     render1(items);
    
//     r = listRes;
    

//     // console.log(items[0], Object.keys(items[0]));
//     // console.log('rating=', items[0]?.rating);

//     // console.log(list)
//     function render1(list) {
//         result_grid.innerHTML = '';

//         list.forEach((item) => {
//             result_grid.innerHTML += `
//             <a href="./T3_2nd_detail.html" >
//                     <article class="card">
//                             <div class="card__media">
//                                 <img src="${item.thumbnail}"/>

//                                 <!-- 왼쪽 상단 배지 -->
//                                 <span class="badge badge--dark">할인 중</span>

//                                 <!-- 오른쪽 상단 찜(하트) -->
//                                 <button class="wish" type="button" aria-label="찜하기">
//                                     <svg viewBox="0 0 24 24" class="heart" aria-hidden="true">
//                                         <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
//                              2 6 4 4 6.5 4
//                              8.04 4 9.54 4.81 10.4 6.09
//                              11.26 4.81 12.76 4 14.3 4
//                              16.8 4 18.8 6 18.8 8.5
//                              c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
//                                     </svg>
//                                 </button>
//                             </div>

//                             <div class="card__body">
//                                 <div class="card__title">${item.name}</div>
//                                 <div class="card__meta">${item.city} · ${item.district}</div>

//                                 <div class="card__row">
//                                     <div class="card__rating">
//                                         <span class="star">★</span> ${item.rating} <span class="count">${item.reviewCount}</span>
//                                     </div>
//                                     <div class="card__price">
//                                         ₩${item.priceFrom} <span>/ 1박</span>
//                                     </div>
//                                 </div>

//                                 <div class="card__tags">
//                                     <span class="tag">기타 편의시설</span>
                                    
//                                 </div>
//                                     <button type="button" class="card__btn">객실 보기</button>
//                             </div>
//                         </article>
//                         </a>
//             `
//         })
//     }



//     render1(items);





// }

window.addEventListener('load', () => App.bind());

const App = {
    // API에서 받아온 숙소 목록 저장
    items: [],

    // 숙소 목록 전체 응답 저장
    r: null,

    // 자주 사용할 DOM 요소 저장
    el: {},

    // 시작 함수
    // DOM 찾기, 이벤트 연결, 데이터 불러오기 실행
    bind() {
        this.cacheDom();
        this.bindEvents();
        this.loadData();
    },

    // 필요한 DOM 요소를 한 번만 찾아서 저장
    cacheDom() {
        // 가격 필터 range input
        this.el.price_range = document.querySelector('.price-range');

        // 가격 필터 선택값을 보여줄 영역
        this.el.side_range_value = document.querySelector('.side-range__value');

        // 필터 적용 버튼
        this.el.side_apply = document.querySelector('.side-apply');

        // 숙소 카드들이 들어갈 영역
        this.el.result_grid = document.querySelector('.result-grid');

        // 정렬 기준 텍스트 요소들
        this.el.recomand = document.querySelector('.recomand');
        this.el.low = document.querySelector('.low');
        this.el.high = document.querySelector('.high');

        // 요약 버튼
        this.el.summary__btn = document.querySelector('.summary__btn');

        // 정렬 select 박스
        this.el.select = document.querySelector('.select');
    },

    // 이벤트 등록
    bindEvents() {
        // 가격 range 값을 움직일 때마다 화면에 금액 표시
        this.el.price_range.addEventListener('input', () => {
            this.renderPrice();
        });

        // 요약 버튼 클릭 시 아직 준비중 알림 표시
        this.el.summary__btn.addEventListener('click', () => {
            alert('기능이 준비중입니다');
        });

        // 필터 적용 버튼 클릭 시 아직 준비중 알림 표시
        this.el.side_apply.addEventListener('click', () => {
            alert('기능이 준비중입니다');
        });

        // 정렬 select 값이 바뀌면 정렬 다시 실행
        this.el.select.addEventListener('change', () => {
            this.handleSort();
        });
    },

    // 숙소 목록 API 호출
    async loadData() {
        try {
            const listRes = await API.V1.TB.Lodging.properties({
                city: '서울',
                page: 1,
                pageSize: 10
            });

            // 응답에서 숙소 배열 저장
            this.items = listRes.items;

            // 전체 응답 저장
            this.r = listRes;

            console.log(this.items);

            // 처음 화면에 숙소 카드 출력
            this.renderCards(this.items);

            // 처음 가격 range 값도 같이 표시
            this.renderPrice();
        } catch (error) {
            console.error('데이터 불러오기 실패:', error);
        }
    },

    // range input 값을 금액 형식으로 바꿔서 출력
    renderPrice() {
        let num = this.el.price_range.value;
        let money = '' + num;
        let result = '';

        // 3자리마다 콤마 붙이기
        while (money.length > 3) {
            result = ',' + money.substring(money.length - 3) + result;
            money = money.substring(0, money.length - 3);
        }

        result = money + result;

        // 화면에 원화 형식으로 출력
        this.el.side_range_value.textContent = '₩ ' + result;
    },

    // select 값에 따라 숙소 목록 정렬
    handleSort() {
        const value = this.el.select.value;

        // 추천순 선택 시 원래 목록 그대로 출력
        if (value == this.el.recomand.textContent) {
            this.renderCards(this.items);

        // 낮은 가격순 선택 시 priceFrom 오름차순 정렬
        } else if (value == this.el.low.textContent) {
            const sorted = [...this.items].sort((a, b) => a.priceFrom - b.priceFrom);
            this.renderCards(sorted);

        // 평점 높은순 선택 시 rating 내림차순 정렬
        } else if (value == this.el.high.textContent) {
            const sorted = [...this.items].sort((a, b) => b.rating - a.rating);
            this.renderCards(sorted);
        }
    },

    // 숙소 카드 목록 출력
    renderCards(list) {
        // 기존 카드들 먼저 비우기
        this.el.result_grid.innerHTML = '';

        list.forEach((item) => {
            this.el.result_grid.innerHTML += `
                <a href="./T3_2nd_detail.html">
                    <article class="card">
                        <div class="card__media">
                            <img src="${item.thumbnail}" />

                            <span class="badge badge--dark">할인 중</span>

                            <button class="wish" type="button" aria-label="찜하기">
                                <svg viewBox="0 0 24 24" class="heart" aria-hidden="true">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                                    2 6 4 4 6.5 4
                                    8.04 4 9.54 4.81 10.4 6.09
                                    11.26 4.81 12.76 4 14.3 4
                                    16.8 4 18.8 6 18.8 8.5
                                    c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </button>
                        </div>

                        <div class="card__body">
                            <div class="card__title">${item.name}</div>
                            <div class="card__meta">${item.city} · ${item.district}</div>

                            <div class="card__row">
                                <div class="card__rating">
                                    <span class="star">★</span> ${item.rating}
                                    <span class="count">${item.reviewCount}</span>
                                </div>
                                <div class="card__price">
                                    ₩${item.priceFrom} <span>/ 1박</span>
                                </div>
                            </div>

                            <div class="card__tags">
                                <span class="tag">기타 편의시설</span>
                            </div>

                            <button type="button" class="card__btn">객실 보기</button>
                        </div>
                    </article>
                </a>
            `;
        });
    }
};