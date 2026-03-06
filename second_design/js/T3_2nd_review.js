// window.addEventListener('load', bind)
// function bind() {

//     const whole = document.querySelector('.whole')
//     const clean = document.querySelector('.clean')
//     const loc = document.querySelector('.loc')
//     const cheap = document.querySelector('.cheap')
//     const kind = document.querySelector('.kind')
//     const acco = document.querySelector('.acco')


//     function setActive(target) {
//         whole.classList.remove('chip--active');
//         clean.classList.remove('chip--active');
//         loc.classList.remove('chip--active');
//         cheap.classList.remove('chip--active');
//         kind.classList.remove('chip--active')
//         acco.classList.remove('chip--active')

//         target.classList.add('chip--active');
//     }

//     whole.addEventListener('click', () => {
//         setActive(whole)
//     })

//     clean.addEventListener('click', () => {
//         setActive(clean)
//     })

//     loc.addEventListener('click', () => {
//         setActive(loc)
//     })

//     cheap.addEventListener('click', () => {
//         setActive(cheap)
//     })

//     kind.addEventListener('click', () => {
//         setActive(kind)
//     })

//     acco.addEventListener('click', () => {
//         setActive(acco)
//     })

//     const like1 = document.querySelector('.like1')
//     const PMH = document.querySelector('.PMH')
//     const LYS = document.querySelector('.LYS')
//     const KJS = document.querySelector('.KJS')
//     const like2 = document.querySelector('.like2')
//     const like3 = document.querySelector('.like3')

//     like1.addEventListener('click', function () {
//         PMH.textContent++
//     })

//     like2.addEventListener('click', () => {
//         LYS.textContent++
//     })

//     like3.addEventListener('click', () => {
//         KJS.textContent++
//     })

//     // a = {
//     //     dom: querySelector,
//     //     date: 
//     // }

//     document.addEventListener("DOMContentLoaded", () => {
//         const modal = document.querySelector("[data-modal]");
//         const openBtn = document.querySelector("[data-open-modal]");
//         const closeBtns = document.querySelectorAll("[data-close-modal]");

//         if (!modal || !openBtn) return;

//         const open = () => {
//             modal.hidden = false;
//             modal.setAttribute("aria-hidden", "false");
//             document.body.style.overflow = "hidden";
//         };

//         const close = () => {
//             modal.hidden = true;
//             modal.setAttribute("aria-hidden", "true");
//             document.body.style.overflow = "";
//         };

//         openBtn.addEventListener("click", open);
//         closeBtns.forEach(b => b.addEventListener("click", close));

//         // ESC로 닫기
//         document.addEventListener("keydown", (e) => {
//             if (e.key === "Escape" && !modal.hidden) close();
//         });
//     });
//     // ===== 리뷰 작성 모달 열기/닫기 =====
//     const modal = document.querySelector('[data-modal]');
//     const openBtn = document.querySelector('[data-open-modal]');
//     const closeBtns = document.querySelectorAll('[data-close-modal]');

//     if (modal && openBtn) {
//         const open = () => {
//             modal.hidden = false;
//             modal.setAttribute('aria-hidden', 'false');
//             document.body.style.overflow = 'hidden';
//         };

//         const close = () => {
//             modal.hidden = true;
//             modal.setAttribute('aria-hidden', 'true');
//             document.body.style.overflow = '';
//         };

//         openBtn.addEventListener('click', open);
//         closeBtns.forEach(btn => btn.addEventListener('click', close));

//         // ESC로 닫기
//         document.addEventListener('keydown', (e) => {
//             if (e.key === 'Escape' && !modal.hidden) close();
//         });
//     }

//     const btn_modal = document.querySelector('.btn-modal')

//     btn_modal.addEventListener('click',()=>{
//         alert('리뷰 저장기능은 준비중입니다')
//     })

//     const field__textarea_text = document.querySelector('.field__textarea_text')

//     document.addEventListener("input", (e) => {
//         const ta = e.target.closest(".field__textarea_text");
//         if (!ta) return;
//         const item = ta.closest(".field");
//         const limitEl = item.querySelector(".reply-limit");
//         const v = field__textarea_text.value.slice(0, 1000);
//         if (v !== field__textarea_text.value) field__textarea_text.value = v;
//         if (limitEl) limitEl.textContent = `${field__textarea_text.value.length} / 1000`;
//     });

// }
window.addEventListener('load', () => App.bind());

const App = {
    // 사용할 DOM 요소들을 저장할 객체
    el: {},

    // 시작 함수
    bind() {
        this.cacheDom();    // 필요한 태그 찾기
        this.bindEvents();  // 이벤트 연결
    },

    // DOM 요소들을 한 번에 찾아서 저장
    cacheDom() {
        // 칩 버튼들
        this.el.whole = document.querySelector('.whole');
        this.el.clean = document.querySelector('.clean');
        this.el.loc = document.querySelector('.loc');
        this.el.cheap = document.querySelector('.cheap');
        this.el.kind = document.querySelector('.kind');
        this.el.acco = document.querySelector('.acco');

        // 칩들을 배열로 묶어서 관리
        this.el.chips = [
            this.el.whole,
            this.el.clean,
            this.el.loc,
            this.el.cheap,
            this.el.kind,
            this.el.acco
        ];

        // 좋아요 버튼들
        this.el.like1 = document.querySelector('.like1');
        this.el.like2 = document.querySelector('.like2');
        this.el.like3 = document.querySelector('.like3');

        // 좋아요 숫자가 들어있는 요소들
        this.el.PMH = document.querySelector('.PMH');
        this.el.LYS = document.querySelector('.LYS');
        this.el.KJS = document.querySelector('.KJS');

        // 모달 관련 요소들
        this.el.modal = document.querySelector('[data-modal]');
        this.el.openBtn = document.querySelector('[data-open-modal]');
        this.el.closeBtns = document.querySelectorAll('[data-close-modal]');
        this.el.btn_modal = document.querySelector('.btn-modal');

        // 리뷰 textarea
        this.el.field__textarea_text = document.querySelector('.field__textarea_text');
    },

    // 이벤트들을 종류별로 연결
    bindEvents() {
        this.bindChipEvents();      // 칩 클릭 이벤트
        this.bindLikeEvents();      // 좋아요 클릭 이벤트
        this.bindModalEvents();     // 모달 열기/닫기 이벤트
        this.bindTextCountEvents(); // 글자수 카운트 이벤트
    },

    // 칩 버튼 클릭 이벤트 등록
    bindChipEvents() {
        this.el.chips.forEach((chip) => {
            if (!chip) return;

            chip.addEventListener('click', () => {
                this.setActive(chip);
            });
        });
    },

    // 선택한 칩만 active 클래스를 주는 함수
    setActive(target) {
        // 모든 칩에서 active 제거
        this.el.chips.forEach((chip) => {
            if (!chip) return;
            chip.classList.remove('chip--active');
        });

        // 클릭한 칩만 active 추가
        target.classList.add('chip--active');
    },

    // 좋아요 버튼 이벤트 등록
    bindLikeEvents() {
        if (this.el.like1) {
            this.el.like1.addEventListener('click', () => {
                this.increaseLike(this.el.PMH);
            });
        }

        if (this.el.like2) {
            this.el.like2.addEventListener('click', () => {
                this.increaseLike(this.el.LYS);
            });
        }

        if (this.el.like3) {
            this.el.like3.addEventListener('click', () => {
                this.increaseLike(this.el.KJS);
            });
        }
    },

    // 좋아요 숫자 1 증가
    increaseLike(target) {
        if (!target) return;

        // textContent는 문자열이므로 숫자로 변환 후 1 더함
        target.textContent = Number(target.textContent) + 1;
    },

    // 모달 관련 이벤트 등록
    bindModalEvents() {
        // 모달과 열기 버튼이 있을 때만 동작
        if (this.el.modal && this.el.openBtn) {
            // 모달 열기
            this.el.openBtn.addEventListener('click', () => {
                this.openModal();
            });

            // 닫기 버튼들에 모달 닫기 연결
            this.el.closeBtns.forEach((btn) => {
                btn.addEventListener('click', () => {
                    this.closeModal();
                });
            });
        }

        // ESC 누르면 모달 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.el.modal && !this.el.modal.hidden) {
                this.closeModal();
            }
        });

        // 저장 버튼 클릭 시 알림
        if (this.el.btn_modal) {
            this.el.btn_modal.addEventListener('click', () => {
                alert('리뷰 저장기능은 준비중입니다');
            });
        }
    },

    // 모달 열기
    openModal() {
        this.el.modal.hidden = false;
        this.el.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // 배경 스크롤 막기
    },

    // 모달 닫기
    closeModal() {
        this.el.modal.hidden = true;
        this.el.modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // 배경 스크롤 다시 허용
    },

    // textarea 입력 이벤트 등록
    bindTextCountEvents() {
        document.addEventListener('input', (e) => {
            const ta = e.target.closest('.field__textarea_text');
            if (!ta) return;

            this.updateTextCount(ta);
        });
    },

    // textarea 글자수 제한 및 표시
    updateTextCount(ta) {
        const item = ta.closest('.field');
        if (!item) return;

        const limitEl = item.querySelector('.reply-limit');

        // 최대 1000자까지만 입력 가능
        const v = ta.value.slice(0, 1000);

        // 1000자 초과 시 잘라서 다시 넣기
        if (v !== ta.value) {
            ta.value = v;
        }

        // 현재 글자수 표시
        if (limitEl) {
            limitEl.textContent = `${ta.value.length} / 1000`;
        }
    }
};