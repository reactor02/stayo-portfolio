window.addEventListener('load', bind)
async function bind() {

    // 필터 영역
    const price_range = document.querySelector('.price-range')
    const side_range_value = document.querySelector('.side-range__value')

    let r;



    function render() {
        let num = price_range.value
        let money = "" + num;
        let result = "";

        while (money.length > 3) {
            result = "," + money.substring(money.length - 3) + result;
            money = money.substring(0, money.length - 3);
        }
        result = money + result;
        side_range_value.textContent = '₩ ' + result
    }

    price_range.addEventListener('input', () => {
        render();
    })

    const side_apply = document.querySelector('.side-apply')
    // const side_box = document.querySelector('.side_box')
    const result_grid = document.querySelector('.result-grid')
    const recomand = document.querySelector('.recomand')
    const low = document.querySelector('.low')
    const high = document.querySelector('.high')
    const summary__btn = document.querySelector('.summary__btn')

    summary__btn.addEventListener('click', () => {
        alert('기능이 준비중입니다')
    })


    side_apply.addEventListener('click', () => {

        alert('기능이 준비중입니다')

    })

    const select = document.querySelector('.select')

    select.addEventListener('change', () => {
        if (select.value == recomand.textContent) {

            render1(items);
        } else if (select.value == low.textContent) {
            const sorted = [...items].sort((a, b) => a.priceFrom - b.priceFrom)
            render1(sorted);
        } else if (select.value == high.textContent) {
            const sorted = [...items].sort((a, b) => b.rating - a.rating)
            render1(sorted);
        }
    })

    let items = [];


    const logCall = (label, method, url, body) => {
        console.log(`[CALL] ${label} :: ${method} ${url}`);
        if (body !== undefined) console.log(`[BODY] ${label}`, body);
    };

    const logRes = (label, res) => console.log(`[RES] ${label}`, res);
    const logErr = (label, xhr) => {
        const rj = xhr?.responseJSON;
        const status = xhr?.status;
        const msg = rj?.message || rj?.error || xhr?.statusText || "요청 실패";
        console.log(`[ERR] ${label} :: status=${status}`, rj || msg);
    };


    // DD.V1.TB.Lodging.list(q)
    const q = { city: '서울', page: 1, pageSize: 50 };
    let listRes;
    // try {
    //     listRes = await DD.V1.TB.Lodging.list(q);
    //     logRes("TB-LOD-1 PROPERTIES_LIST", listRes);
    // } catch (e) {
    //     logErr("TB-LOD-1 PROPERTIES_LIST", e);
    //     return;
    // }
    listRes = await DD.V1.TB.Lodging.list(q);
    items = listRes.items;
    // render1(items);

    r = listRes;
    console.log(items)

    // console.log(items[0], Object.keys(items[0]));
    // console.log('rating=', items[0]?.rating);

    // console.log(list)
    function render1(list) {
        result_grid.innerHTML = '';

        list.forEach((item) => {
            result_grid.innerHTML += `
                    <article class="card">
                            <div class="card__media">
                                <img src="${item.thumbnail}"/>

                                <!-- 왼쪽 상단 배지 -->
                                <span class="badge badge--dark">할인 중</span>

                                <!-- 오른쪽 상단 찜(하트) -->
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
                                        <span class="star">★</span> ${item.rating} <span class="count">${item.reviewCount}</span>
                                    </div>
                                    <div class="card__price">
                                        ₩${item.priceFrom} <span>/ 1박</span>
                                    </div>
                                </div>

                                <div class="card__tags">
                                    <span class="tag">기타 편의시설</span>
                                    
                                </div>

                                <a href="./T3_2nd_detail.html" class="card__btn">객실 보기</a>
                            </div>
                        </article>
            `
        })
    }



    render1(items);

    



}