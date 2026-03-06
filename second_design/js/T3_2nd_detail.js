// window.addEventListener('load', bind)
// async function bind() {

//     // const q = { city: '서울', page: 1, pageSize: 50 };
//     let listRes;

//     listRes = await API.V1.TB.Lodging.properties({ city: '서울', page: 1, pageSize: 50 });

//     items = listRes.items;

//     // console.log(items[0].name)

//     const property_title = document.querySelector('.property-title')
//     const muted = document.querySelector('.muted')
//     const star = document.querySelector('.meta-item b')
//     const meta_item = document.querySelector('.meta-item')

//     property_title.innerHTML = items[0].name
//     muted.innerHTML = items[0].reviewCount
//     star.innerHTML = items[0].rating
//     meta_item.innerHTML = items[0].city + ' , 대한민국 · ' + items[0].district


//     const modalBg = document.querySelector('#modalBg');
//     const modalClose = document.querySelector('#modalClose');
//     const modalTitle = document.querySelector('#modalTitle');
//     const modalBody = document.querySelector('#modalBody');

//     function openModal(htmlTitle, htmlBody) {
//         modalTitle.textContent = htmlTitle;
//         modalBody.innerHTML = htmlBody;     // 사진 넣으려면 innerHTML 필요
//         modalBg.classList.add('on');
//     }

//     function closeModal() {
//         modalBg.classList.remove('on');
//     }

//     // 닫기 버튼
//     modalClose.addEventListener('click', closeModal);

//     // 배경 클릭 시 닫기
//     modalBg.addEventListener('click', (e) => {
//         if (e.target === modalBg) closeModal();
//     });

//     // ESC로 닫기
//     window.addEventListener('keydown', (e) => {
//         if (e.key === 'Escape') closeModal();
//     });

//     // 갤러리 클릭 → 모달 열기 (이벤트 위임)
//     const galleryGrid = document.querySelector('.gallery-grid');
//     galleryGrid.addEventListener('click', (e) => {
//         const a = e.target.closest('[data-modal="photo"]');
//         if (!a) return;

//         e.preventDefault(); // href="#" 막기

//         const img = a.querySelector('img');
//         if (!img) return;

//         openModal(
//             '사진 상세보기',
//             `<img src="${img.src}" alt="${img.alt}" style="width:100%; height:auto; border-radius:12px;">`
//         );
//     });

//     // (선택) "사진 전체보기" 버튼도 같은 모달로
//     const allBtn = document.querySelector('.gallery-all');
//     if (allBtn) {
//         allBtn.addEventListener('click', () => {
//             // 갤러리 안 이미지들 다 가져와서 모달에 넣기
//             const imgs = [...document.querySelectorAll('.gallery-item img')];
//             const html = imgs.map(i =>
//                 `<img src="${i.src}" alt="${i.alt}" style="width:100%; height:auto; border-radius:12px; margin-bottom:10px;">`
//             ).join('');
//             openModal('사진 전체보기', html);
//         });
//     }

//     const propertyId = items[0].propertyId;

//     API.V1.TB.Lodging.rooms(propertyId)
//         .then((res) => {
//             render1(res.rooms);   
//         })
//         .catch((e) => logErr("TB-LOD-3 PROPERTIES_ROOMS", e));


//     const hotelImages = [
//         "https://images.unsplash.com/photo-1566073771259-6a8506099945",
//         "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
//         "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
//         "https://images.unsplash.com/photo-1590490360182-c33d57733427",
//         "https://images.unsplash.com/photo-1578683010236-d716f9a3f461"
//     ];

//     function getRandomImage() {
//         const index = Math.floor(Math.random() * hotelImages.length);
//         return hotelImages[index];
//     }




//     function render1(list = []) {
//         list.forEach((r) => {


//             room_list.innerHTML += `
//             <article class="room">
//                         <div class="room__media">
//                           <img src="${getRandomImage()}"
//                             />
//                         </div>
        
//                         <div class="room__body">
//                           <div class="room__title">${r.name}</div>
//                           <div class="room__meta muted">${r.capacity}인 · 더블베드 2 · 28m²</div>
        
//                           <div class="room__tags">
//                             <span class="tag">무료 취소</span>
//                             <span class="tag">조식 옵션</span>
//                             <span class="tag">시티뷰</span>
//                           </div>
//                         </div>
        
//                         <div class="room__side">
//                           <div class="room__price">
//                             ₩ ${r.basePrice} 
//                           </div>
//                           <button class="btn-main" type="button">선택</button>
//                         </div>
//                       </article>
//             `
//         })
//     }

//     const room_list = document.querySelector('.room-list');
//     const book_price = document.querySelector('.book-price');

//     // 객실 선택 버튼 클릭
//     room_list.addEventListener('click', function (e) {

//         // btn-main 클릭했는지 확인
//         const btn = e.target.closest('.btn-main');
//         if (!btn) return;

//         // 현재 클릭된 room 찾기
//         const room = btn.closest('.room');

//         // 그 room 안의 가격 찾기
//         const price = room.querySelector('.room__price').innerHTML;

//         // 예약 카드 가격 변경
//         book_price.innerHTML = price;

//         const price2 = price.split('\n')
//         const price3 = price2[1].split('₩')
//         const priceResult = price3[1].trim() * 2
//         function render() {
//             let num = priceResult
//             let money = "" + num;
//             let result = "";

//             while (money.length > 3) {
//                 result = "," + money.substring(money.length - 3) + result;
//                 money = money.substring(0, money.length - 3);
//             }
//             result = money + result;
//             sum_row.innerHTML = '₩ ' + result;

//         }
//         render(priceResult);

//         // console.log(priceResult)
//         sum_row1.innerHTML = price + "/ 2박"
//     });

//     const sum_row = document.querySelector('.sum-row b')
//     const sum_row1 = document.querySelector('.sum-row span')


//     // const map__text = document.querySelector('.map__text')
//     function checkExpiredCoupons() {
//         const today = new Date().toISOString().split('T')[0];
//         const items = document.querySelectorAll('#couponList .item');

//         items.forEach(item => {
//             const metaArea = item.querySelector('.item__meta');
//             if (!metaArea) return;

//             // 유효기간 텍스트에서 날짜 추출
//             const metaText = metaArea.innerText;
//             const dateMatch = metaText.match(/(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})/);
//             if (!dateMatch) return;

//             const expMin = dateMatch[1];
//             const expMax = dateMatch[2];

//             if (today > expMax) {
//                 // 만료된 쿠폰 → line-through 스타일 + 텍스트 변경
//                 metaArea.className = 'item__meta muted line-through';
//                 metaArea.innerText = `유효기간만료: ${expMin} ~ ${expMax}`;
//             } else {
//                 // 유효한 쿠폰 → 정상 스타일 복원
//                 metaArea.className = 'item__meta muted';
//                 metaArea.innerText = `유효기간: ${expMin} ~ ${expMax}`;
//             }
//         });
//     }
//     checkExpiredCoupons();









// }

window.addEventListener('load', () => App.bind());

const App = {
    items: [],
    listRes: null,
    propertyId: null,

    el: {},

    async bind() {
        this.cacheDom();
        this.bindEvents();
        await this.loadProperty();
        this.checkExpiredCoupons();
    },

    cacheDom() {
        this.el.property_title = document.querySelector('.property-title');
        this.el.muted = document.querySelector('.muted');
        this.el.star = document.querySelector('.meta-item b');
        this.el.meta_item = document.querySelector('.meta-item');

        this.el.modalBg = document.querySelector('#modalBg');
        this.el.modalClose = document.querySelector('#modalClose');
        this.el.modalTitle = document.querySelector('#modalTitle');
        this.el.modalBody = document.querySelector('#modalBody');

        this.el.galleryGrid = document.querySelector('.gallery-grid');
        this.el.allBtn = document.querySelector('.gallery-all');

        this.el.room_list = document.querySelector('.room-list');
        this.el.book_price = document.querySelector('.book-price');
        this.el.sum_row = document.querySelector('.sum-row b');
        this.el.sum_row1 = document.querySelector('.sum-row span');
    },

    bindEvents() {
        this.el.modalClose.addEventListener('click', () => {
            this.closeModal();
        });

        this.el.modalBg.addEventListener('click', (e) => {
            if (e.target === this.el.modalBg) {
                this.closeModal();
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        this.el.galleryGrid.addEventListener('click', (e) => {
            const a = e.target.closest('[data-modal="photo"]');
            if (!a) return;

            e.preventDefault();

            const img = a.querySelector('img');
            if (!img) return;

            this.openModal(
                '사진 상세보기',
                `<img src="${img.src}" alt="${img.alt}" style="width:100%; height:auto; border-radius:12px;">`
            );
        });

        if (this.el.allBtn) {
            this.el.allBtn.addEventListener('click', () => {
                const imgs = [...document.querySelectorAll('.gallery-item img')];
                const html = imgs.map((i) => {
                    return `<img src="${i.src}" alt="${i.alt}" style="width:100%; height:auto; border-radius:12px; margin-bottom:10px;">`;
                }).join('');

                this.openModal('사진 전체보기', html);
            });
        }

        this.el.room_list.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-main');
            if (!btn) return;

            const room = btn.closest('.room');
            const priceText = room.querySelector('.room__price').textContent.trim();

            this.updateBooking(priceText);
        });
    },

    async loadProperty() {
        try {
            this.listRes = await API.V1.TB.Lodging.properties({
                city: '서울',
                page: 1,
                pageSize: 50
            });

            this.items = this.listRes.items;

            if (!this.items.length) return;

            this.renderProperty(this.items[0]);

            this.propertyId = this.items[0].propertyId;
            this.loadRooms(this.propertyId);

        } catch (error) {
            console.error('숙소 정보 불러오기 실패:', error);
        }
    },

    renderProperty(item) {
        this.el.property_title.innerHTML = item.name;
        this.el.muted.innerHTML = item.reviewCount;
        this.el.star.innerHTML = item.rating;
        this.el.meta_item.innerHTML = item.city + ' , 대한민국 · ' + item.district;
    },

    openModal(htmlTitle, htmlBody) {
        this.el.modalTitle.textContent = htmlTitle;
        this.el.modalBody.innerHTML = htmlBody;
        this.el.modalBg.classList.add('on');
    },

    closeModal() {
        this.el.modalBg.classList.remove('on');
    },

    async loadRooms(propertyId) {
        try {
            const res = await API.V1.TB.Lodging.rooms(propertyId);
            this.renderRooms(res.rooms);
        } catch (error) {
            console.error('객실 정보 불러오기 실패:', error);
        }
    },

    hotelImages: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461"
    ],

    getRandomImage() {
        const index = Math.floor(Math.random() * this.hotelImages.length);
        return this.hotelImages[index];
    },

    renderRooms(list = []) {
        this.el.room_list.innerHTML = '';

        list.forEach((r) => {
            this.el.room_list.innerHTML += `
                <article class="room">
                    <div class="room__media">
                        <img src="${this.getRandomImage()}" />
                    </div>

                    <div class="room__body">
                        <div class="room__title">${r.name}</div>
                        <div class="room__meta muted">${r.capacity}인 · 더블베드 2 · 28m²</div>

                        <div class="room__tags">
                            <span class="tag">무료 취소</span>
                            <span class="tag">조식 옵션</span>
                            <span class="tag">시티뷰</span>
                        </div>
                    </div>

                    <div class="room__side">
                        <div class="room__price">₩ ${r.basePrice}</div>
                        <button class="btn-main" type="button">선택</button>
                    </div>
                </article>
            `;
        });
    },

    updateBooking(priceText) {
        this.el.book_price.innerHTML = priceText;

        const numberPrice = Number(
            priceText.replace('₩', '').replaceAll(',', '').trim()
        );

        const totalPrice = numberPrice * 2;

        this.el.sum_row.innerHTML = '₩ ' + this.formatMoney(totalPrice);
        this.el.sum_row1.innerHTML = priceText + ' / 2박';
    },

    formatMoney(num) {
        let money = '' + num;
        let result = '';

        while (money.length > 3) {
            result = ',' + money.substring(money.length - 3) + result;
            money = money.substring(0, money.length - 3);
        }

        result = money + result;
        return result;
    },

    checkExpiredCoupons() {
        const today = new Date().toISOString().split('T')[0];
        const items = document.querySelectorAll('#couponList .item');

        items.forEach((item) => {
            const metaArea = item.querySelector('.item__meta');
            if (!metaArea) return;

            const metaText = metaArea.innerText;
            const dateMatch = metaText.match(/(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})/);
            if (!dateMatch) return;

            const expMin = dateMatch[1];
            const expMax = dateMatch[2];

            if (today > expMax) {
                metaArea.className = 'item__meta muted line-through';
                metaArea.innerText = `유효기간만료: ${expMin} ~ ${expMax}`;
            } else {
                metaArea.className = 'item__meta muted';
                metaArea.innerText = `유효기간: ${expMin} ~ ${expMax}`;
            }
        });
    }
};