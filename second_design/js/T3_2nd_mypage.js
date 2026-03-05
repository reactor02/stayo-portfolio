document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       0. 상단 GNB 메뉴 링크 연결
    ===================================================== */
    const gnbLinks = document.querySelectorAll(".gnb__link");

    const linkMap = {
        "숙소": "stay.html",
        "항공권": "flight.html",
        "패키지": "package.html",
        "액티비티": "activity.html",
        "렌터카": "rentcar.html"
    };

    gnbLinks.forEach(link => {
        const text = link.textContent.trim();
        if (linkMap[text]) {
            link.href = linkMap[text];
        }
    });


    /* =====================================================
       1. 로그인 기능 + 링크 이동
    ===================================================== */
    const loginBtn = document.querySelector(".btn--login");
    const profileName = document.querySelector(".profile-name");
    const profileEmail = document.querySelector(".profile-email");
    const logoutBtn = document.querySelector(".profile-card__right .btn-outline");

    function updateLoginUI() {
        const user = JSON.parse(localStorage.getItem("stayoUser"));

        if (user) {
            loginBtn.textContent = user.name + "님";
            loginBtn.href = "#";
            profileName.textContent = user.name + " 님";
            profileEmail.textContent = user.email;
        } else {
            loginBtn.textContent = "로그인";
            loginBtn.href = "login.html"; // 로그인 페이지 연결
        }
    }

    updateLoginUI();

  logoutBtn.addEventListener("click", function () {

    if (confirm("로그아웃 하시겠습니까?")) {

        localStorage.removeItem("stayoUser");


        /* =========================
           기존 기능 (계정 정보 제거)
        ==========================*/

        const profileCard = document.querySelector(".profile-card");
        if (profileCard) profileCard.remove();

        const chips = document.querySelectorAll(".chip");
        chips.forEach(chip => chip.remove());

        const profileEditBtn = document.querySelector(".btn-main");
        if (profileEditBtn) profileEditBtn.remove();


        /* =========================
           예약 / 찜 / 쿠폰 메뉴 제거
        ==========================*/

        const tabMenuItems = document.querySelectorAll(".tab-menu__item");

        tabMenuItems.forEach(item => {

            const text = item.textContent.trim();

            if (
                text.includes("예약") ||
                text.includes("찜") ||
                text.includes("쿠폰") ||
                text.includes("프로필")
            ) {
                item.style.display = "none";
            }

        });


        /* =========================
           summary 카드 제거
        ==========================*/

        const summaryCards = document.querySelector(".summary-cards");

        if (summaryCards) {

            const cards = summaryCards.children;

            Array.from(cards).forEach(card => {

                const text = card.textContent;

                if (
                    text.includes("예약") ||
                    text.includes("찜") ||
                    text.includes("쿠폰")
                ) {
                    card.remove();
                }

            });

        }

/* ---------------------------
   나의 문의 내역 제거
----------------------------*/

const inquiryTitle = document.querySelectorAll(".support__title");

inquiryTitle.forEach(title => {

    if (title.textContent.includes("나의 문의 내역")) {
        title.remove();
    }

});


const inquiryList = document.querySelector(".inquiry-list");

if (inquiryList) {
    inquiryList.remove();
}


/* ---------------------------
   예약 내역 패널 제거
----------------------------*/

const reservationTitle = document.querySelectorAll(".panel__title");

reservationTitle.forEach(title => {

    if (title.textContent.includes("예약 내역")) {
        title.remove();
    }

});


const panelActions = document.querySelector(".panel__actions");

if (panelActions) {
    panelActions.remove();
}


/* ---------------------------
   예약 카드 전체 제거
----------------------------*/

const bookingCards = document.querySelectorAll(".booking-card");

bookingCards.forEach(card => {
    card.remove();
});
        /* =========================
           로그인 버튼 변경
        ==========================*/

        const loginBtn = document.querySelector(".btn--login");

        if (loginBtn) {

            loginBtn.textContent = "로그인";

            loginBtn.onclick = function () {

                location.reload();

            };

        }

    }

});

    /* =====================================================
       2. 탭 메뉴 기능 (기존 유지)
    ===================================================== */
    const tabMenuItems = document.querySelectorAll(".tab-menu__item");
    const sections = document.querySelectorAll(".mysec");

    function showSection(targetId) {
        sections.forEach(sec => {
            sec.style.display = (sec.id === targetId) ? "block" : "none";
        });

        tabMenuItems.forEach(item => {
            item.classList.remove("tab-menu__item--active");
            if (item.getAttribute("href") === "#" + targetId) {
                item.classList.add("tab-menu__item--active");
            }
        });
    }

    showSection("sec-reservation");

    tabMenuItems.forEach(item => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            showSection(this.getAttribute("href").replace("#", ""));
        });
    });


    /* =====================================================
       3. 예약 상세보기 & 예약취소 (기존 유지)
    ===================================================== */
    document.querySelectorAll(".booking-card").forEach(card => {

        const title = card.querySelector(".booking-card__title").textContent;
        const dates = card.querySelector(".booking-card__dates").innerText;
        const price = card.querySelector(".booking-card__price").innerText;

        card.querySelectorAll(".btn-outline").forEach(btn => {

            if (btn.textContent.includes("상세보기")) {
                btn.addEventListener("click", function () {
                    alert("숙소: " + title + "\n일정: " + dates + "\n" + price);
                });
            }

            if (btn.textContent.includes("예약취소")) {
                btn.addEventListener("click", function () {
                    if (confirm("예약을 취소하시겠습니까?")) {
                        card.remove();
                        alert("예약이 취소되었습니다.");
                    }
                });
            }

        });
    });


    /* =====================================================
       4. 비밀번호 변경 (8자 메시지 UI 출력 추가)
    ===================================================== */
    const pwForm = document.querySelector(".pw-form");

    pwForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const newPwInput = this.querySelectorAll("input[type='password']")[1];
        const confirmPwInput = this.querySelectorAll("input[type='password']")[2];

        const newPw = newPwInput.value;
        const confirmPw = confirmPwInput.value;

        // 기존 메시지 제거
        const oldMsg = this.querySelector(".pw-error");
        if (oldMsg) oldMsg.remove();

        if (newPw.length < 8) {
            const errorMsg = document.createElement("p");
            errorMsg.className = "pw-error";
            errorMsg.style.color = "red";
            errorMsg.style.fontSize = "13px";
            errorMsg.textContent = "비밀번호는 8자 이상이어야 합니다.";
            newPwInput.parentElement.appendChild(errorMsg);
            return;
        }

        if (newPw !== confirmPw) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        alert("비밀번호가 변경되었습니다.");
        this.reset();
    });


});

