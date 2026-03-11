document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // 마이페이지 메뉴
    // =========================
    const tabMenus = document.querySelectorAll(".tab-menu__item");

    const reservation = document.querySelector('a[href="#sec-reservation"]');
    const wish = document.querySelector('a[href="#sec-wish"]');
    const coupon = document.querySelector('a[href="#sec-coupon"]');
    const profile = document.querySelector('a[href="#sec-profile"]');
    const support = document.querySelector('a[href="#sec-support"]');

    const sections = document.querySelectorAll(".mysec");

    const summaryCards = document.querySelector(".summary-cards");
    const profileCard = document.querySelector(".profile-card");

    const logoutBtn = document.querySelector(".logout");

    // 고객센터 블록
    const inquiryBlocks = document.querySelectorAll(".support__block");



    // =========================
    // 로그인 상태 확인
    // =========================
    function checkLogin() {

        const isLogin = localStorage.getItem("loginUser");

        if (!isLogin) {

            if (reservation) reservation.style.display = "none";
            if (wish) wish.style.display = "none";
            if (coupon) coupon.style.display = "none";
            if (profile) profile.style.display = "none";

            if (summaryCards) summaryCards.style.display = "none";
            if (profileCard) profileCard.style.display = "none";

            inquiryBlocks.forEach(block => {

                const title = block.querySelector(".support__title");

                if (title && title.innerText.includes("나의 문의")) {
                    block.style.display = "none";
                }

            });

            sections.forEach(sec => {
                sec.style.display = "none";
            });

            const supportSection = document.querySelector("#sec-support");

            if (supportSection) {
                supportSection.style.display = "block";
            }

            tabMenus.forEach(menu => {
                menu.classList.remove("tab-menu__item--active");
            });

            if (support) {
                support.classList.add("tab-menu__item--active");
            }

        }

        else {

            if (reservation) reservation.style.display = "flex";
            if (wish) wish.style.display = "flex";
            if (coupon) coupon.style.display = "flex";
            if (profile) profile.style.display = "flex";

            if (summaryCards) summaryCards.style.display = "grid";
            if (profileCard) profileCard.style.display = "flex";

            inquiryBlocks.forEach(block => {
                block.style.display = "block";
            });

        }

    }

    checkLogin();



    // =========================
    // 메뉴 클릭 시 색상 변경
    // =========================
    tabMenus.forEach(menu => {

        menu.addEventListener("click", function () {

            tabMenus.forEach(m => {
                m.classList.remove("tab-menu__item--active");
            });

            this.classList.add("tab-menu__item--active");

        });

    });



    // =========================
    // 로그아웃 기능
    // =========================
    if (logoutBtn) {

        logoutBtn.addEventListener("click", function () {

            localStorage.removeItem("loginUser");

            alert("로그아웃 되었습니다.");

            checkLogin();

            window.location.href = "./T3_2nd_index.html";

        });

    }



    // =========================
    // 리뷰 작성 버튼 기능
    // =========================
    const reviewBtns = document.querySelectorAll("button");

    reviewBtns.forEach(btn => {

        if (btn.innerText.includes("리뷰작성")) {

            btn.addEventListener("click", function () {

                alert("리뷰 작성 페이지로 이동합니다.");

            });

        }

    });



    // =========================
    // 찜목록 전체보기 기능
    // =========================
    const wishMoreBtn = document.querySelector(".link-mini");

    if (wishMoreBtn) {

        wishMoreBtn.addEventListener("click", function (e) {

            e.preventDefault();

            const wishSection = document.querySelector("#sec-wish");

            if (wishSection) {

                sections.forEach(sec => {
                    sec.style.display = "none";
                });

                wishSection.style.display = "block";

                tabMenus.forEach(m => {
                    m.classList.remove("tab-menu__item--active");
                });

                if (wish) {
                    wish.classList.add("tab-menu__item--active");
                }

            }

        });

    }



    // =========================
    // 문의 접수 알림
    // =========================
    const inquiryForm = document.querySelector(".inquiry");

    if (inquiryForm) {

        inquiryForm.addEventListener("submit", function (e) {

            e.preventDefault();

            alert("문의가 접수되었습니다. 빠르게 답변드리겠습니다.");

            inquiryForm.reset();

        });

    }



    // =========================
    // FAQ 토글 기능
    // =========================
    const faqQuestions = document.querySelectorAll(".faq__q");

    faqQuestions.forEach(question => {

        question.addEventListener("click", function () {

            const answer = this.nextElementSibling;

            const expanded = this.getAttribute("aria-expanded") === "true";

            this.setAttribute("aria-expanded", !expanded);

            if (answer) {

                if (answer.hidden) {

                    answer.hidden = false;

                } else {

                    answer.hidden = true;

                }

            }

        });

    });

});

  /* ================================
     5. FAQ 설명 자동 추가 (3개)
  ================================= */

  const faqAnswers = document.querySelectorAll(".faq__a");

  const faqDescriptions = [
    "예약 상세 페이지에서 취소 가능 여부를 확인 후 취소할 수 있습니다. 환불 규정은 숙소 정책에 따라 다르게 적용됩니다.",
    "체크인 및 체크아웃 시간은 숙소 상세 페이지와 예약 확인서에서 확인할 수 있습니다.",
    "쿠폰은 결제 단계에서 적용 가능하며 일부 상품에서는 제한될 수 있습니다."
  ];

  faqAnswers.forEach((faq, index) => {

    if (faq.textContent.trim() === "") {
      faq.textContent = faqDescriptions[index] || "자세한 내용은 고객센터로 문의해주세요.";
    }

  });

  // =========================
// 프로필 수정 기능
// =========================

// 프로필 입력 필드
const profileInputs = document.querySelectorAll(".profile-card input");

// 버튼
const editProfileBtn = document.querySelector(".profile-edit");
const saveProfileBtn = document.querySelector(".profile-save");

// 로그인된 사용자
const loginUser = localStorage.getItem("loginUser");


// 처음에는 입력창 비활성화
profileInputs.forEach(input => {
    input.disabled = true;
});


// 프로필 수정 버튼 클릭
if (editProfileBtn) {

    editProfileBtn.addEventListener("click", function () {

        profileInputs.forEach(input => {
            input.disabled = false;
        });

        alert("프로필을 수정할 수 있습니다.");

    });

}

document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // 나의 문의 내역 자세히 보기 기능
    // =========================

    const detailButtons = document.querySelectorAll("button");

    const inquiryDetails = [
        {
            keyword: "예약 취소 시 수수료가 발생하는지 문의드립니다",
            detail: "예약 취소 시 수수료는 숙소 정책에 따라 다르게 적용됩니다. 일반적으로 체크인 24시간 이전 취소는 무료이며, 이후 취소 시 일부 수수료가 발생할 수 있습니다. 정확한 환불 규정은 예약 상세 페이지의 취소 정책을 확인해 주세요."
        },
        {
            keyword: "결제 단계에서 쿠폰이 보이지 않습니다",
            detail: "쿠폰이 보이지 않는 경우는 다음과 같은 이유가 있을 수 있습니다. 사용 가능한 기간이 만료되었거나, 최소 결제 금액 조건을 충족하지 못했을 수 있습니다. 또한 특정 숙소나 상품에는 쿠폰 사용이 제한될 수 있으니 쿠폰 사용 조건을 확인해 주세요."
        }
    ];


    // 모든 버튼 검사
    detailButtons.forEach(btn => {

        if (btn.innerText.includes("답변 보기")) {

            btn.addEventListener("click", function () {

                const inquiryItem = this.closest("li") || this.parentElement;

                if (!inquiryItem) return;

                let detailBox = inquiryItem.querySelector(".inquiry-detail-text");

                // 이미 열려있으면 닫기
                if (detailBox) {

                    detailBox.remove();
                    this.innerText = "답변 보기";
                    return;

                }

                const textContent = inquiryItem.innerText;

                let detailText = "";

                inquiryDetails.forEach(item => {

                    if (textContent.includes(item.keyword)) {
                        detailText = item.detail;
                    }

                });

                if (detailText === "") {
                    detailText = "문의 내용에 대한 자세한 답변은 고객센터를 통해 확인하실 수 있습니다.";
                }

                // 상세 텍스트 생성
                detailBox = document.createElement("div");
                detailBox.className = "inquiry-detail-text";

                detailBox.style.marginTop = "10px";
                detailBox.style.padding = "12px";
                detailBox.style.background = "#f5f5f5";
                detailBox.style.borderRadius = "6px";
                detailBox.style.fontSize = "14px";
                detailBox.style.lineHeight = "1.6";

                detailBox.textContent = detailText;

                inquiryItem.appendChild(detailBox);

                this.innerText = "닫기";

            });

        }

    });

});

// =========================
// 상세보기 버튼 → 호텔 센트럴 페이지 이동
// =========================

document.addEventListener("DOMContentLoaded", function () {

    const detailMoveBtns = document.querySelectorAll("button");

    detailMoveBtns.forEach(btn => {

        if (btn.innerText.includes("상세보기")) {

            btn.addEventListener("click", function () {

                // 기존 기능 실행 후 페이지 이동
                setTimeout(function(){

                    window.location.href = "./seoul_junggu_hotel_central.html";

                }, 300);

            });

        }

    });

});

// =========================
// 로그인 상태에 따른 화면 제어 (강화)
// =========================

document.addEventListener("DOMContentLoaded", function () {

    function updatePageByLogin() {

        const isLogin = localStorage.getItem("loginUser");

        const sections = document.querySelectorAll(".mysec");
        const supportSection = document.querySelector("#sec-support");

        const menus = document.querySelectorAll(".tab-menu__item");

        const reservation = document.querySelector('a[href="#sec-reservation"]');
        const wish = document.querySelector('a[href="#sec-wish"]');
        const coupon = document.querySelector('a[href="#sec-coupon"]');
        const profile = document.querySelector('a[href="#sec-profile"]');

        const summaryCards = document.querySelector(".summary-cards");
        const profileCard = document.querySelector(".profile-card");


        // =========================
        // 로그아웃 상태
        // =========================
        if (!isLogin) {

            sections.forEach(sec => {
                sec.style.display = "none";
            });

            if (supportSection) {
                supportSection.style.display = "block";
            }

            if (reservation) reservation.style.display = "none";
            if (wish) wish.style.display = "none";
            if (coupon) coupon.style.display = "none";
            if (profile) profile.style.display = "none";

            if (summaryCards) summaryCards.style.display = "none";
            if (profileCard) profileCard.style.display = "none";

            menus.forEach(menu => {
                menu.classList.remove("tab-menu__item--active");
            });

        }


        // =========================
        // 로그인 상태
        // =========================
        else {

            sections.forEach(sec => {
                sec.style.display = "block";
            });

            if (reservation) reservation.style.display = "flex";
            if (wish) wish.style.display = "flex";
            if (coupon) coupon.style.display = "flex";
            if (profile) profile.style.display = "flex";

            if (summaryCards) summaryCards.style.display = "grid";
            if (profileCard) profileCard.style.display = "flex";

        }

    }

    // 페이지 최초 로딩
    updatePageByLogin();

    // 로그아웃 버튼 연동
    const logoutBtn = document.querySelector(".logout");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", function () {

            localStorage.removeItem("loginUser");

            setTimeout(function () {

                updatePageByLogin();

            }, 100);

        });

    }

});

// =========================
// 리뷰 작성 페이지 이동 기능
// =========================

document.addEventListener("DOMContentLoaded", function () {

    const reviewBtns = document.querySelectorAll("button");

    reviewBtns.forEach(btn => {

        if (btn.innerText.includes("리뷰작성") || btn.innerText.includes("리뷰 작성")) {

            btn.addEventListener("click", function () {

                // 리뷰 작성 페이지 이동
                window.location.href = "./review_write.html";

            });

        }

    });

});

// =========================
// 스크롤 따라 메뉴 자동 선택 (Scroll Spy)
// =========================

document.addEventListener("DOMContentLoaded", function () {

    const sections = document.querySelectorAll(".mysec");
    const menus = document.querySelectorAll(".tab-menu__item");

    function activateMenu(id) {

        menus.forEach(menu => {
            menu.classList.remove("tab-menu__item--active");
        });

        const activeMenu = document.querySelector(`a[href="#${id}"]`);

        if (activeMenu) {
            activeMenu.classList.add("tab-menu__item--active");
        }

    }

    function scrollSpy() {

        let currentSection = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight) {

                currentSection = section.getAttribute("id");

            }

        });

        if (currentSection) {
            activateMenu(currentSection);
        }

    }

    window.addEventListener("scroll", scrollSpy);

});

// =========================
// 프로필 수정 이동 + 저장 기능
// =========================

document.addEventListener("DOMContentLoaded", function () {

    const profileBtn = document.querySelector(".profile-card__right .btn-main");
    const profileSection = document.querySelector("#sec-profile");

    const profileInputs = document.querySelectorAll("#sec-profile input");
    const saveBtn = document.querySelector("#sec-profile button[type='submit'], #sec-profile .save-btn");

    const sections = document.querySelectorAll(".mysec");
    const menus = document.querySelectorAll(".tab-menu__item");



    // =========================
    // 프로필 수정 버튼 → 프로필 관리 이동
    // =========================
    if (profileBtn) {

        profileBtn.addEventListener("click", function (e) {

            e.preventDefault();

            sections.forEach(sec => {
                sec.style.display = "none";
            });

            if (profileSection) {
                profileSection.style.display = "block";
            }

            menus.forEach(menu => {
                menu.classList.remove("tab-menu__item--active");
            });

            const profileMenu = document.querySelector('a[href="#sec-profile"]');

            if (profileMenu) {
                profileMenu.classList.add("tab-menu__item--active");
            }

            window.scrollTo({
                top: profileSection.offsetTop - 80,
                behavior: "smooth"
            });

        });

    }



    // =========================
    // 저장된 프로필 불러오기
    // =========================
    const savedProfile = JSON.parse(localStorage.getItem("profileData"));

    if (savedProfile && profileInputs.length) {

        profileInputs.forEach(input => {

            if (savedProfile[input.name]) {
                input.value = savedProfile[input.name];
            }

        });

    }



    // =========================
    // 프로필 저장
    // =========================
    if (saveBtn) {

        saveBtn.addEventListener("click", function (e) {

            e.preventDefault();

            const profileData = {};

            profileInputs.forEach(input => {
                profileData[input.name] = input.value;
            });

            localStorage.setItem("profileData", JSON.stringify(profileData));

            alert("프로필이 저장되었습니다.");

        });

    }

});

// =========================
// 비밀번호 변경 기능
// =========================

document.addEventListener("DOMContentLoaded", function () {

    const changeBtns = document.querySelectorAll("button");

    changeBtns.forEach(btn => {

        if (btn.innerText.includes("변경하기")) {

            btn.addEventListener("click", function (e) {

                e.preventDefault();

                const passwordInputs = document.querySelectorAll('input[type="password"]');

                if (passwordInputs.length < 2) {
                    alert("비밀 번호가 변경되지 않았습니다.");
                    return;
                }

                const currentPw = passwordInputs[0].value.trim();
                const newPw = passwordInputs[1].value.trim();

                const savedPw = localStorage.getItem("userPassword") || "1234";


                // 현재 비밀번호 확인
                if (currentPw !== savedPw || newPw === "") {

                    alert("비밀 번호가 변경되지 않았습니다.");
                    return;

                }


                // 변경 성공
                localStorage.setItem("userPassword", newPw);

                alert("비밀 번호가 변경되었습니다.");

                passwordInputs.forEach(input => {
                    input.value = "";
                });

            });

        }

    });

});

// =========================
// 예약 취소 기능
// T3_2nd_mypage.js 와 연동
// =========================

document.addEventListener("DOMContentLoaded", function () {

    // -------------------------------------------------------
    // 예약 상태 데이터 (localStorage 기반)
    // 키: "reservations"  값: [{ id, cancelled }, ...]
    // -------------------------------------------------------
    function getReservations() {
        return JSON.parse(localStorage.getItem("reservations")) || [];
    }

    function saveReservations(data) {
        localStorage.setItem("reservations", JSON.stringify(data));
    }

    // -------------------------------------------------------
    // 예약 카드 초기화
    //  - 카드마다 고유 id(data-reservation-id) 부여
    //  - 이미 취소된 카드는 취소 완료 상태로 렌더링
    // -------------------------------------------------------
    function initReservationCards() {

        const bookingCards = document.querySelectorAll(".booking-card");
        const savedData    = getReservations();

        bookingCards.forEach(function (card, index) {

            // 이용 완료 카드(리뷰작성 버튼이 있는 카드)는 취소 대상에서 제외
            const reviewBtn = Array.from(
                card.querySelectorAll("button")
            ).find(function (btn) {
                return btn.innerText.includes("리뷰작성") || btn.innerText.includes("리뷰 작성");
            });

            if (reviewBtn) return;

            // 고유 ID 부여
            const cardId = "booking-" + index;
            card.setAttribute("data-reservation-id", cardId);

            // 취소 버튼 탐색
            const cancelBtn = Array.from(
                card.querySelectorAll("button")
            ).find(function (btn) {
                return btn.innerText.trim().replace(/\s/g, "") === "예약취소";
            });

            if (!cancelBtn) return;

            // 저장된 취소 상태 반영
            const saved = savedData.find(function (r) { return r.id === cardId; });

            if (saved && saved.cancelled) {
                applyCancelledStyle(card, cancelBtn);
            } else {
                // 취소 버튼 이벤트 등록
                cancelBtn.addEventListener("click", function () {
                    handleCancelClick(card, cancelBtn, cardId);
                });
            }
        });
    }

    // -------------------------------------------------------
    // 취소 버튼 클릭 핸들러
    // -------------------------------------------------------
    function handleCancelClick(card, cancelBtn, cardId) {

        // 숙소명 추출 (있으면 메시지에 포함)
        const titleEl   = card.querySelector(".booking-card__title");
        const hotelName = titleEl ? titleEl.innerText.trim() : "해당 예약";

        // 확인 다이얼로그
        const confirmed = confirm(
            "예약 취소하시겠습니까?\n\n" +
            "· 숙소: " + hotelName + "\n" +
            "· 환불 규정은 숙소 정책에 따라 다를 수 있습니다."
        );

        if (!confirmed) return;

        // ----- 취소 처리 -----
        const reservations = getReservations();
        const existing     = reservations.find(function (r) { return r.id === cardId; });

        if (existing) {
            existing.cancelled = true;
        } else {
            reservations.push({ id: cardId, cancelled: true });
        }

        saveReservations(reservations);

        // UI 업데이트
        applyCancelledStyle(card, cancelBtn);

        // 예약 건수 요약 카드 업데이트
        updateReservationCount();

        alert("예약이 취소되었습니다.\n환불은 영업일 기준 3~5일 내 처리됩니다.");
    }

    // -------------------------------------------------------
    // 취소 완료 스타일 적용
    // -------------------------------------------------------
    function applyCancelledStyle(card, cancelBtn) {

        // 배지 변경
        const badge = card.querySelector(".badge");
        if (badge) {
            badge.textContent = "예약 취소";
            badge.classList.remove("badge--dark");
            badge.classList.add("badge--cancel");
        }

        // 카드 흐림 처리
        card.style.opacity = "0.55";

        // 취소 버튼 비활성화
        cancelBtn.textContent         = "취소 완료";
        cancelBtn.disabled            = true;
        cancelBtn.style.cursor        = "default";
        cancelBtn.style.opacity       = "0.6";
        cancelBtn.style.pointerEvents = "none";

        // 이미 복구 버튼이 있으면 중복 추가 방지
        if (card.querySelector(".btn-undo-cancel")) return;

        // "취소 복구" 버튼 추가
        const undoBtn = document.createElement("button");
        undoBtn.type      = "button";
        undoBtn.className = "btn-outline btn-undo-cancel";
        undoBtn.textContent = "취소 복구";
        cancelBtn.parentNode.appendChild(undoBtn);

        undoBtn.addEventListener("click", function () {
            handleUndoCancel(card, cancelBtn, undoBtn,
                             card.getAttribute("data-reservation-id"));
        });
    }

    // -------------------------------------------------------
    // 예약 취소 복구 핸들러
    // -------------------------------------------------------
    function handleUndoCancel(card, cancelBtn, undoBtn, cardId) {

        const confirmed = confirm("예약 취소를 복구하시겠습니까?");
        if (!confirmed) return;

        // localStorage 상태 복구
        const reservations = getReservations();
        const existing     = reservations.find(function (r) { return r.id === cardId; });
        if (existing) existing.cancelled = false;
        saveReservations(reservations);

        // 배지 원복
        const badge = card.querySelector(".badge");
        if (badge) {
            badge.textContent = "예약 완료";
            badge.classList.remove("badge--cancel");
            badge.classList.add("badge--dark");
        }

        // 카드 흐림 해제
        card.style.opacity = "1";

        // 취소 버튼 복구
        cancelBtn.textContent         = "예약취소";
        cancelBtn.disabled            = false;
        cancelBtn.style.cursor        = "";
        cancelBtn.style.opacity       = "";
        cancelBtn.style.pointerEvents = "";

        // 취소 버튼에 이벤트 재등록
        cancelBtn.addEventListener("click", function onCancelAgain() {
            cancelBtn.removeEventListener("click", onCancelAgain);
            handleCancelClick(card, cancelBtn, cardId);
        });

        // 복구 버튼 제거
        undoBtn.remove();

        // 예약 건수 업데이트
        updateReservationCount();

        alert("예약 취소가 복구되었습니다.");
    }

    // -------------------------------------------------------
    // 요약 카드의 예약 건수 업데이트
    // -------------------------------------------------------
    function updateReservationCount() {

        const sumCards = document.querySelectorAll(".sum");

        sumCards.forEach(function (sum) {

            const titleEl = sum.querySelector(".sum__title");
            if (!titleEl || titleEl.innerText.trim() !== "예약") return;

            const valueEl = sum.querySelector(".sum__value");
            if (!valueEl) return;

            // 취소되지 않은 예약 카드 수 계산
            const totalCards     = document.querySelectorAll(".booking-card[data-reservation-id]").length;
            const cancelledCount = getReservations().filter(function (r) { return r.cancelled; }).length;
            const activeCount    = Math.max(0, totalCards - cancelledCount);

            valueEl.textContent = activeCount + "건";
        });
    }

    // -------------------------------------------------------
    // 취소 배지 스타일 동적 삽입
    // -------------------------------------------------------
    (function injectCancelStyle() {
        const style = document.createElement("style");
        style.textContent =
            ".badge--cancel {" +
            "  background: #e53935 !important;" +
            "  color: #fff !important;" +
            "}" +
            ".booking-card {" +
            "  transition: opacity 0.3s;" +
            "}";
        document.head.appendChild(style);
    })();

    // -------------------------------------------------------
    // 실행
    // -------------------------------------------------------
    initReservationCards();
    updateReservationCount();

});

// =========================
// 상세보기 / 리뷰 작성 페이지 이동 기능
// 기존 T3_2nd_mypage.js 는 건드리지 않음
// =========================

document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".booking-card").forEach(function (card) {

        // -------------------------------------------------------
        // 상세보기 버튼 → ../html/T3_2nd_detail.html
        // HTML에 <a> 태그로 이미 감싸진 경우도 있으므로
        // 버튼 자체와 내부 <a> 모두 href 를 덮어씁니다.
        // -------------------------------------------------------
        card.querySelectorAll("button").forEach(function (btn) {

            if (!btn.innerText.trim().includes("상세보기")) return;

            // 버튼 안에 <a> 태그가 있으면 href 교체
            const anchor = btn.querySelector("a");
            if (anchor) {
                anchor.href = "../html/T3_2nd_detail.html";
            }

            // 버튼 클릭 이벤트로도 이동 (a 태그 없는 경우 대비)
            btn.addEventListener("click", function (e) {
                // a 태그가 있으면 a 태그의 기본 동작에 맡기고, 없으면 직접 이동
                if (!btn.querySelector("a")) {
                    window.location.href = "../html/T3_2nd_detail.html";
                }
            });
        });

        // -------------------------------------------------------
        // 리뷰 작성 버튼 → ../html/T3_2nd_review.html
        // 기존 mypage.js 의 이벤트보다 나중에 등록되므로
        // stopImmediatePropagation 으로 기존 핸들러 무력화 후 이동
        // -------------------------------------------------------
        card.querySelectorAll("button").forEach(function (btn) {

            const text = btn.innerText.trim();
            if (!text.includes("리뷰작성") && !text.includes("리뷰 작성")) return;

            btn.addEventListener("click", function (e) {
                e.stopImmediatePropagation(); // 기존 alert / review_write.html 핸들러 차단
                window.location.href = "../html/T3_2nd_review.html";
            });
        });
    });

});