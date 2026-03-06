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

// 페이지가 모두 로드되면 App 객체의 bind 함수 실행
window.addEventListener('load', () => App.bind());

const App = {
    // API에서 받아온 숙소 목록 저장
    items: [],

    // 숙소 목록 전체 응답 저장
    listRes: null,

    // 현재 선택된 숙소의 propertyId 저장
    propertyId: null,

    // 자주 사용할 DOM 요소 저장
    el: {},

    // 시작 함수
    // DOM 찾기, 이벤트 연결, 숙소 정보 불러오기, 쿠폰 만료 체크 실행
    async bind() {
        this.cacheDom();
        this.bindEvents();
        await this.loadProperty();
        this.checkExpiredCoupons();
    },

    // 필요한 DOM 요소를 한 번만 찾아서 저장
    cacheDom() {
        // 숙소 상단 정보 영역
        this.el.property_title = document.querySelector('.property-title');
        this.el.muted = document.querySelector('.muted');
        this.el.star = document.querySelector('.meta-item b');
        this.el.meta_item = document.querySelector('.meta-item');

        // 사진 모달 관련 요소
        this.el.modalBg = document.querySelector('#modalBg');
        this.el.modalClose = document.querySelector('#modalClose');
        this.el.modalTitle = document.querySelector('#modalTitle');
        this.el.modalBody = document.querySelector('#modalBody');

        // 갤러리 영역과 전체보기 버튼
        this.el.galleryGrid = document.querySelector('.gallery-grid');
        this.el.allBtn = document.querySelector('.gallery-all');

        // 객실 목록과 예약 요약 영역
        this.el.room_list = document.querySelector('.room-list');
        this.el.book_price = document.querySelector('.book-price');
        this.el.sum_row = document.querySelector('.sum-row b');
        this.el.sum_row1 = document.querySelector('.sum-row span');

        this.el.wishBtn = document.querySelector('.wish-btn');
        this.el.wishHeart = document.querySelector('.wish-btn .heart');
        this.el.cartBtn = document.querySelector('.cart-btn')
        this.el.shareBtn = document.querySelector('.share-btn') 
    },

    // 이벤트 등록
    bindEvents() {
        // 모달 닫기 버튼 클릭 시 모달 닫기
        this.el.modalClose.addEventListener('click', () => {
            this.closeModal();
        });

        // 모달 배경 클릭 시 바깥 영역이면 모달 닫기
        this.el.modalBg.addEventListener('click', (e) => {
            if (e.target === this.el.modalBg) {
                this.closeModal();
            }
        });

        // ESC 키를 누르면 모달 닫기
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // 갤러리 이미지 클릭 시 해당 이미지를 모달로 크게 보기
        this.el.galleryGrid.addEventListener('click', (e) => {
            const a = e.target.closest('[data-modal="photo"]');
            if (!a) return;

            // a 태그 기본 이동 막기
            e.preventDefault();

            const img = a.querySelector('img');
            if (!img) return;

            this.openModal(
                '사진 상세보기',
                `<img src="${img.src}" alt="${img.alt}" style="width:100%; height:auto; border-radius:12px;">`
            );
        });

        // 사진 전체보기 버튼이 있으면 갤러리 안 모든 이미지를 모달에 출력
        if (this.el.allBtn) {
            this.el.allBtn.addEventListener('click', () => {
                const imgs = [...document.querySelectorAll('.gallery-item img')];

                const html = imgs.map((i) => {
                    return `<img src="${i.src}" alt="${i.alt}" style="width:100%; height:auto; border-radius:12px; margin-bottom:10px;">`;
                }).join('');

                this.openModal('사진 전체보기', html);
            });
        }

        // 객실 목록에서 선택 버튼 클릭 시 예약 요약 가격 변경
        this.el.room_list.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-main');
            if (!btn) return;

            const room = btn.closest('.room');
            const priceText = room.querySelector('.room__price').textContent.trim();

            this.updateBooking(priceText);
        });

        if (this.el.wishBtn) {
            this.el.wishBtn.addEventListener('click', () => {
                this.el.wishBtn.classList.toggle('is-liked');

                const liked = this.el.wishBtn.classList.contains('is-liked');

                if (liked) {
                    this.el.wishHeart.style.fill = '#ff5a5f';
                    this.el.wishHeart.style.stroke = '#ff5a5f';
                } else {
                    this.el.wishHeart.style.fill = 'none';
                    this.el.wishHeart.style.stroke = 'currentColor';
                }
            });
        }
        if (this.el.cartBtn) {
            this.el.cartBtn.addEventListener('click',()=>{
                alert('장바구니에 추가되었습니다')
            })
        }
        if (this.el.shareBtn) {
            this.el.shareBtn.addEventListener('click',()=>{
                alert(`주소가 복사되었습니다 \n${window.document.location.href}`)
            })
        }
    },

    // 숙소 목록 API 호출
    async loadProperty() {
        try {
            this.listRes = await API.V1.TB.Lodging.properties({
                city: '서울',
                page: 1,
                pageSize: 50
            });

            // 숙소 목록 저장
            this.items = this.listRes.items;

            // 데이터가 없으면 종료
            if (!this.items.length) return;

            // 첫 번째 숙소 정보를 화면에 출력
            this.renderProperty(this.items[0]);

            // 첫 번째 숙소의 propertyId 저장 후 객실 목록 불러오기
            this.propertyId = this.items[0].propertyId;
            this.loadRooms(this.propertyId);

        } catch (error) {
            console.error('숙소 정보 불러오기 실패:', error);
        }
    },

    // 숙소 기본 정보 출력
    renderProperty(item) {
        this.el.property_title.innerHTML = item.name;
        this.el.muted.innerHTML = item.reviewCount;
        this.el.star.innerHTML = item.rating;
        this.el.meta_item.innerHTML = item.city + ' , 대한민국 · ' + item.district;
    },

    // 모달 열기
    // 제목과 본문 HTML을 넣고 on 클래스를 추가
    openModal(htmlTitle, htmlBody) {
        this.el.modalTitle.textContent = htmlTitle;
        this.el.modalBody.innerHTML = htmlBody;
        this.el.modalBg.classList.add('on');
    },

    // 모달 닫기
    closeModal() {
        this.el.modalBg.classList.remove('on');
    },

    // 객실 목록 API 호출
    async loadRooms(propertyId) {
        try {
            const res = await API.V1.TB.Lodging.rooms(propertyId);
            this.renderRooms(res.rooms);
        } catch (error) {
            console.error('객실 정보 불러오기 실패:', error);
        }
    },

    // 객실 카드에 사용할 랜덤 이미지 목록
    hotelImages: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461"
    ],

    // 객실 카드에 넣을 이미지를 랜덤으로 하나 반환
    getRandomImage() {
        const index = Math.floor(Math.random() * this.hotelImages.length);
        return this.hotelImages[index];
    },

    // 객실 목록 출력
    renderRooms(list = []) {
        // 기존 객실 목록 비우기
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

    // 객실 선택 시 예약 요약 정보 업데이트
    updateBooking(priceText) {
        // 선택한 객실 1박 가격 표시
        this.el.book_price.innerHTML = priceText;

        // "₩ 120000" 형태의 문자열에서 숫자만 꺼내기
        const numberPrice = Number(
            priceText.replace('₩', '').replaceAll(',', '').trim()
        );

        // 2박 기준 총 가격 계산
        const totalPrice = numberPrice * 2;

        // 총 합계 표시
        this.el.sum_row.innerHTML = '₩ ' + this.formatMoney(totalPrice);

        // 1박 가격과 숙박 수 표시
        this.el.sum_row1.innerHTML = priceText + ' / 2박';
    },

    // 숫자에 3자리마다 콤마 추가
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

    // 쿠폰 유효기간이 지났는지 확인하고 표시 문구 변경
    checkExpiredCoupons() {
        // 오늘 날짜를 yyyy-mm-dd 형식으로 구함
        const today = new Date().toISOString().split('T')[0];
        const items = document.querySelectorAll('#couponList .item');

        items.forEach((item) => {
            const metaArea = item.querySelector('.item__meta');
            if (!metaArea) return;

            // 유효기간 텍스트에서 시작일과 종료일 추출
            const metaText = metaArea.innerText;
            const dateMatch = metaText.match(/(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})/);
            if (!dateMatch) return;

            const expMin = dateMatch[1];
            const expMax = dateMatch[2];

            // 오늘 날짜가 종료일보다 크면 만료 처리
            if (today > expMax) {
                metaArea.className = 'item__meta muted line-through';
                metaArea.innerText = `유효기간만료: ${expMin} ~ ${expMax}`;
            } else {
                // 아직 유효한 쿠폰이면 원래 스타일 유지
                metaArea.className = 'item__meta muted';
                metaArea.innerText = `유효기간: ${expMin} ~ ${expMax}`;
            }
        });
    }
};