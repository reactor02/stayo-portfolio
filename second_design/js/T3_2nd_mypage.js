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

        if (btn.innerText.includes("자세히 보기")) {

            btn.addEventListener("click", function () {

                const inquiryItem = this.closest("li") || this.parentElement;

                if (!inquiryItem) return;

                let detailBox = inquiryItem.querySelector(".inquiry-detail-text");

                // 이미 열려있으면 닫기
                if (detailBox) {

                    detailBox.remove();
                    this.innerText = "자세히 보기";
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
// 프로필 수정 기능
// =========================

document.addEventListener("DOMContentLoaded", function () {

    const editBtn = document.querySelector(".profile-card__right .btn-main");

    if (!editBtn) return;

    editBtn.addEventListener("click", function (e) {

        e.preventDefault();

        const loginUser = localStorage.getItem("loginUser");

        if (!loginUser) {
            alert("로그인이 필요합니다.");
            return;
        }

        // 현재 프로필 데이터 불러오기
        const userData = JSON.parse(localStorage.getItem(loginUser)) || {};

        const currentName = userData.name || "";
        const currentEmail = userData.email || "";
        const currentPhone = userData.phone || "";

        // prompt로 수정
        const newName = prompt("이름을 수정하세요.", currentName);
        if (newName === null) return;

        const newEmail = prompt("이메일을 수정하세요.", currentEmail);
        if (newEmail === null) return;

        const newPhone = prompt("전화번호를 수정하세요.", currentPhone);
        if (newPhone === null) return;

        const updatedUser = {
            ...userData,
            name: newName,
            email: newEmail,
            phone: newPhone
        };

        localStorage.setItem(loginUser, JSON.stringify(updatedUser));

        alert("프로필이 수정되었습니다.");

        // 화면 즉시 반영
        const nameEl = document.querySelector(".profile-name");
        const emailEl = document.querySelector(".profile-email");
        const phoneEl = document.querySelector(".profile-phone");

        if (nameEl) nameEl.textContent = newName;
        if (emailEl) emailEl.textContent = newEmail;
        if (phoneEl) phoneEl.textContent = newPhone;

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