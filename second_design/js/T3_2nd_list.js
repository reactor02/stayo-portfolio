window.addEventListener('load', () => App.bind());

const App = {
    items: [],
    r: null,
    el: {},

    currentPage: 1,
    pageSize: 10,
    maxPage: 5,
    allItems: [],
    filteredItems: [],

    bind() {
        this.cacheDom();
        this.bindEvents();
        this.loadData();
    },

    cacheDom() {
        this.el.price_range = document.querySelector('.price-range');
        this.el.side_range_value = document.querySelector('.side-range__value');
        this.el.side_apply = document.querySelector('.side-apply');
        this.el.result_grid = document.querySelector('.result-grid');

        this.el.recomand = document.querySelector('.recomand');
        this.el.low = document.querySelector('.low');
        this.el.high = document.querySelector('.high');

        this.el.summary__btn = document.querySelector('.summary__btn');
        this.el.select = document.querySelector('.select');

        this.el.gradeChecks = document.querySelectorAll('.side-box:nth-of-type(2) .check input[type="checkbox"]');
        this.el.facilityChecks = document.querySelectorAll('.side-box:nth-of-type(3) .check input[type="checkbox"]');
        this.el.rateRadios = document.querySelectorAll('input[name="rate"]');

        this.el.resultsCount = document.querySelector('.results-head__meta b');
        this.el.summaryCount = document.querySelector('.summary__desc');
        this.el.citySelect = document.querySelector('.city-select');
        this.el.pagination = document.querySelector('.pagination');
    },

    bindEvents() {
        if (this.el.price_range) {
            this.el.price_range.addEventListener('input', () => {
                this.renderPrice();
            });
        }

        if (this.el.side_apply) {
            this.el.side_apply.addEventListener('click', () => {
                this.applyFilters();
            });
        }

        if (this.el.select) {
            this.el.select.addEventListener('change', () => {
                this.handleSort();
            });
        }

        // 하트 클릭 이벤트 위임
        if (this.el.result_grid) {
            this.el.result_grid.addEventListener('click', (e) => {
                const wishBtn = e.target.closest('.wish');
                if (!wishBtn) return;

                e.preventDefault();
                e.stopPropagation();

                const heart = wishBtn.querySelector('.heart');
                if (heart) {
                    heart.classList.toggle('active');
                }
            });
        }

        if (this.el.citySelect) {
            this.el.citySelect.addEventListener('change', () => {
                this.currentPage = 1;
                this.loadData(this.el.citySelect.value);
            });
        }

        if (this.el.pagination) {
            this.el.pagination.addEventListener('click', (e) => {

                const pageBtn = e.target.closest('[data-page]');
                const prevBtn = e.target.closest('.prev');
                const nextBtn = e.target.closest('.next');

                if (pageBtn) {
                    this.currentPage = Number(pageBtn.dataset.page);
                    this.renderCurrentPage();
                    this.renderPagination();
                    return;
                }

                if (prevBtn && this.currentPage > 1) {
                    this.currentPage--;
                    this.renderCurrentPage();
                    this.renderPagination();
                    return;
                }

                if (nextBtn && this.currentPage < this.totalPages) {
                    this.currentPage++;
                    this.renderCurrentPage();
                    this.renderPagination();
                }
            });
        }
    },

    async loadData(city = `서울`) {
        try {
            const res = await API.V1.TB.Lodging.properties({
                city: city,
                page: 1,
                pageSize: 50
            });

            // this.r = res;
            this.allItems = res.items || [];
            this.filteredItems = [...this.allItems];
            this.currentPage = 1;
            this.handleSort();
            console.log(this.filteredItems);

            if (this.allItems.length === 0) {
                this.el.result_grid.innerHTML = `
                    <p style="grid-column:1/-1;text-align:center;color:#999;">
                        조회된 숙소가 없습니다.
                    </p>
                `;
                this.updateResultCount();
                return;
            }

            this.renderPrice();


            const summaryTitle = document.querySelector('.summary__title');
            if (summaryTitle) {
                summaryTitle.textContent = `${city} · 3월 10일 - 3월 12일 · 성인 2명`;
            }


        } catch (error) {
            console.error('데이터 불러오기 실패:', error);
            this.el.result_grid.innerHTML = `
                <p style="grid-column:1/-1;text-align:center;color:#999;">
                    데이터 불러오는 중 오류가 발생했습니다.
                </p>
            `;
        }
    },

    renderPrice() {
        if (!this.el.price_range || !this.el.side_range_value) return;

        let num = this.el.price_range.value;
        let money = '' + num;
        let result = '';

        while (money.length > 3) {
            result = ',' + money.substring(money.length - 3) + result;
            money = money.substring(0, money.length - 3);
        }

        result = money + result;
        this.el.side_range_value.textContent = '₩ ' + result;
    },

    formatPrice(num) {
        return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    getLabelText(input) {
        return input.parentElement.textContent.trim();
    },

    applyFilters() {
        let list = [...this.allItems];

        // 1. 가격 필터
        if (this.el.price_range) {
            const maxPrice = Number(this.el.price_range.value);
            list = list.filter((item) => Number(item.priceFrom) <= maxPrice);
        }

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
                    item.stars ||
                    '';

                const gradeText = String(gradeValue);

                return selectedGrades.some((grade) => {
                    if (grade === '기타') {
                        return !['2성급', '3성급', '4성급', '5성급'].includes(gradeText);
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
            }
        }

        this.filteredItems = list;
        this.handleSort();
        this.updateResultCount();
    },

    handleSort() {
        const value = this.el.select ? this.el.select.value : '';
        let sorted = [...this.filteredItems];

        if (value === this.el.low.textContent) {
            sorted.sort((a, b) => a.priceFrom - b.priceFrom);
        } else if (value === this.el.high.textContent) {
            sorted.sort((a, b) => b.rating - a.rating);
        }

        this.filteredItems = sorted;
        this.totalPages = Math.min(Math.ceil(this.filteredItems.length / this.pageSize), this.maxPage)
        this.renderCurrentPage();
        this.renderPagination();
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

    renderCards(list) {
        this.el.result_grid.innerHTML = '';

        list.forEach((item) => {
            this.el.result_grid.innerHTML += `
                <a href="./T3_2nd_detail.html" style="text-decoration:none;color:inherit;">
                    <article class="card">
                        <div class="card__media">
                            <img src="${item.thumbnail}" alt="${item.name}">
                            <span class="badge badge--dark">${item.stars}성급</span>

                            <button class="wish" type="button" aria-label="찜하기">
                                <svg viewBox="0 0 24 24" class="heart" aria-hidden="true">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                                    2 6 4 4 6.5 4
                                    8.04 4 9.54 4.81 10.4 6.09
                                    11.26 4.81 12.76 4 14.3 4
                                    16.8 4 18.8 6 18.8 8.5
                                    c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
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
                                    ₩${this.formatPrice(item.priceFrom)} <span>/ 1박</span>
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
    },

    renderCurrentPage() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        const pageItems = this.filteredItems.slice(start, end);

        this.renderCards(pageItems);
    },

    renderPagination() {
        if (!this.el.pagination) return;

        let html = '';

        // 이전
        html += `
        <button class="page prev" type="button" ${this.currentPage === 1 ? 'disabled' : ''}>
            이전
        </button>
    `;

        // 페이지 번호
        for (let i = 1; i <= this.totalPages; i++) {
            html += `
            <button 
                class="page ${i === this.currentPage ? 'page--active' : ''}" 
                type="button" 
                data-page="${i}">
                ${i}
            </button>
        `;
        }

        // 다음
        html += `
        <button class="page next" type="button" ${this.currentPage === this.totalPages ? 'disabled' : ''}>
            다음
        </button>
    `;

        this.el.pagination.innerHTML = html;
    }

};