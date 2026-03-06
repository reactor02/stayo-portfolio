window.addEventListener('load', bind);

async function bind() {

    // ──────────────────────────────────────────────
    // 1. 카드 렌더링
    // ──────────────────────────────────────────────
    const resultGrid = document.querySelector('.result-grid');

    async function loadLodgings() {
        try {
            const res = await API.V1.TB.Lodging.properties({
                page: 1,
                pageSize: 12
            });

            resultGrid.innerHTML = '';

            if (!res.items || res.items.length === 0) {
                resultGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#999;">조회된 숙소가 없습니다.</p>';
                return;
            }

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
