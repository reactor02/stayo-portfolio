document.addEventListener("DOMContentLoaded", function () {

    // 로그인 버튼
    const loginBtn = document.querySelector(".header-guest .btn--ghost");

    // 기존 로그아웃 버튼 제거
    const existLogout = document.querySelectorAll(".logout, .btn-outline");
    existLogout.forEach(btn => {
        if (btn.textContent.includes("로그아웃")) {
            btn.remove();
        }
    });

    let clickCount = 0;
    let logoutBtn = null;

    loginBtn.addEventListener("click", function (e) {

        e.preventDefault();
        clickCount++;

        // 두 번째 클릭 시 로그아웃 버튼 생성
        if (clickCount === 2 && !logoutBtn) {

            logoutBtn = document.createElement("button");
            logoutBtn.innerText = "로그아웃";
            logoutBtn.className = "btn btn--ghost";

            logoutBtn.style.display = "block";
            logoutBtn.style.marginTop = "10px";

            loginBtn.parentElement.appendChild(logoutBtn);

            // 로그아웃 기능
            logoutBtn.addEventListener("click", function () {

                // 요약 카드 (예약, 찜, 쿠폰)
                document.querySelector(".summary-cards").style.display = "none";

                // 예약 내역
                document.querySelector("#sec-reservation").style.display = "none";

                // 찜 목록
                document.querySelector("#sec-wish").style.display = "none";

                // 쿠폰·포인트
                document.querySelector("#sec-coupon").style.display = "none";

                // 프로필 관리
                document.querySelector("#sec-profile").style.display = "none";

                // 좌측 메뉴 (예약/찜/쿠폰)
                const tabMenu = document.querySelectorAll(".tab-menu__item");
                tabMenu.forEach(item => {
                    const text = item.innerText;

                    if (
                        text.includes("예약") ||
                        text.includes("찜") ||
                        text.includes("쿠폰") ||
                        text.includes("프로필")
                    ) {
                        item.style.display = "none";
                    }
                });

                alert("로그아웃 되었습니다.");
            });
        }
    });

});