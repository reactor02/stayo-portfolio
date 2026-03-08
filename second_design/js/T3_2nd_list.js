window.addEventListener('load', bind);

async function bind() {

    // ──────────────────────────────────────────────
    // 1. 카드 렌더링
    // ──────────────────────────────────────────────
    const resultGrid = document.querySelector('.result-grid');

<<<<<<< Updated upstream
    async function loadLodgings() {
=======


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
    filteredItems: [],

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

        this.el.gradeChecks = document.querySelectorAll('.side-box:nth-of-type(2) .check input[type="checkbox"]');
        this.el.facilityChecks = document.querySelectorAll('.side-box:nth-of-type(3) .check input[type="checkbox"]');
        this.el.rateRadios = document.querySelectorAll('input[name="rate"]');
        this.el.resultsCount = document.querySelector('.results-head__meta b');
        this.el.summaryCount = document.querySelector('.summary__desc');
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


        this.el.side_apply.addEventListener('click', () => {
            this.applyFilters();
        });

        // 정렬 select 값이 바뀌면 정렬 다시 실행
        this.el.select.addEventListener('change', () => {
            this.handleSort();
        });
    },

    // 숙소 목록 API 호출
    async loadData() {
>>>>>>> Stashed changes
        try {
            const res = await API.V1.TB.Lodging.properties({
                page: 1,
                pageSize: 12
            });

            resultGrid.innerHTML = '';

<<<<<<< Updated upstream
            if (!res.items || res.items.length === 0) {
                resultGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#999;">조회된 숙소가 없습니다.</p>';
                return;
=======
            this.filteredItems = [...this.items];

            // 전체 응답 저장
            this.r = listRes;

            console.log(this.items);

            // 처음 화면에 숙소 카드 출력
            this.filteredItems = [...this.items];
            this.renderCards(this.filteredItems);
            this.renderPrice();
            this.updateResultCount();

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

    getLabelText(input) {
        return input.parentElement.textContent.trim();
    },

    applyFilters() {
        let list = [...this.items];

        // 1. 가격 필터
        const maxPrice = Number(this.el.price_range.value);
        list = list.filter((item) => Number(item.priceFrom) <= maxPrice);

        // 2. 숙소 등급 필터
        const selectedGrades = [...this.el.gradeChecks]
            .filter((input) => input.checked)
            .map((input) => this.getLabelText(input));

        if (selectedGrades.length > 0) {
            list = list.filter((item) => {
                const gradeValue =
                    item.starRating ||
                    item.grade ||
                    item.hotelGrade ||
                    item.ratingGrade ||
                    '';

                const gradeText = String(gradeValue);

                return selectedGrades.some((grade) => {
                    if (grade === '기타') {
                        return !['3성급', '4성급', '5성급'].includes(gradeText);
                    }
                    return gradeText === grade || gradeText.includes(grade.replace('성급', ''));
                });
            });
        }

        // 3. 편의시설 필터
        const selectedFacilities = [...this.el.facilityChecks]
            .filter((input) => input.checked)
            .map((input) => this.getLabelText(input));

        if (selectedFacilities.length > 0) {
            list = list.filter((item) => {
                const facilities = [
                    ...(Array.isArray(item.amenities) ? item.amenities : []),
                    ...(Array.isArray(item.facilities) ? item.facilities : []),
                    ...(Array.isArray(item.options) ? item.options : []),
                    ...(Array.isArray(item.tags) ? item.tags : [])
                ].join(' ');

                return selectedFacilities.every((facility) => {
                    return facilities.includes(facility);
                });
            });
        }

        // 4. 평점 필터
        const checkedRate = [...this.el.rateRadios].find((radio) => radio.checked);

        if (checkedRate) {
            const rateText = this.getLabelText(checkedRate);

            if (rateText !== '전체') {
                const minRating = Number(rateText.replace('+', ''));
                list = list.filter((item) => Number(item.rating) >= minRating);
>>>>>>> Stashed changes
            }

<<<<<<< Updated upstream
            res.items.forEach((item) => {
                resultGrid.innerHTML += `
                    <a href="./T3_2nd_detail.html" style="text-decoration:none;color:inherit;">
                        <article class="card">
                            <div class="card__media">
                                <img src="${item.thumbnail}" alt="${item.name}" />
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
=======
        this.filteredItems = list;
        this.handleSort();
        this.updateResultCount();
    },

    updateResultCount() {
        const count = this.filteredItems.length;

        if (this.el.resultsCount) {
            this.el.resultsCount.textContent = count;
        }

        if (this.el.summaryCount) {
            this.el.summaryCount.textContent = `검색 결과 ${count}개`;
        }
    },


    // select 값에 따라 숙소 목록 정렬
    handleSort() {
        const value = this.el.select.value;

        // 추천순 선택 시 원래 목록 그대로 출력
        if (value == this.el.recomand.textContent) {
            this.renderCards(this.filteredItems);

            // 낮은 가격순 선택 시 priceFrom 오름차순 정렬
        } else if (value == this.el.low.textContent) {
            const sorted = [...this.filteredItems].sort((a, b) => a.priceFrom - b.priceFrom);
            this.renderCards(sorted);

            // 평점 높은순 선택 시 rating 내림차순 정렬
        } else if (value == this.el.high.textContent) {
            const sorted = [...this.filteredItems].sort((a, b) => b.rating - a.rating);
            this.renderCards(sorted);
        }
    },
    formatPrice(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
                                    ₩${this.formatPrice(item.priceFrom)} <span>/ 1박</span>
                                </div>
>>>>>>> Stashed changes
                            </div>
                            <div class="card__body">
                                <div class="card__title">${item.name}</div>
                                <div class="card__meta">${item.city} · ${item.district}</div>
                                <div class="card__row">
                                    <div class="card__rating">
                                        <span class="star">★</span> ${item.rating}
                                        <span class="count">(${item.reviewCount})</span>
                                    </div>
                                    <div class="card__price">
                                        ₩${item.priceFrom.toLocaleString()} <span>/ 1박</span>
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

        } catch (err) {
            console.error('숙소 로딩 실패:', err);
            resultGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#999;">데이터를 불러오는 중 오류가 발생했습니다.</p>';
        }
    }
<<<<<<< Updated upstream

    await loadLodgings();

    // ──────────────────────────────────────────────
    // 2. 하트 이벤트 위임
    //    - innerHTML로 카드를 동적 생성하면 기존 querySelectorAll로 잡은
    //      요소들이 DOM에서 사라지므로, 부모(resultGrid)에 이벤트를 위임합니다.
    // ──────────────────────────────────────────────
    resultGrid.addEventListener('click', function (e) {
        // .wish 버튼 또는 그 안 요소를 클릭했을 때만 처리
        const wishBtn = e.target.closest('.wish');
        if (!wishBtn) return;

        // 링크(<a>)로 이동되지 않도록 버블 차단
        e.preventDefault();
        e.stopPropagation();

        const heart = wishBtn.querySelector('.heart');
        if (!heart) return;

        heart.classList.toggle('active');
    });

}
=======
    
};
>>>>>>> Stashed changes
