document.addEventListener("DOMContentLoaded", function () {

  /* ===============================
     1️⃣ 사이드 메뉴 버튼 전체 링크 연결
  =============================== */

  const sideButtons = document.querySelectorAll(".side-item");

  // ✅ 모든 버튼 링크 매핑 (예약 내역 포함)
  const sideLinkMap = {
    "예약 내역": "mypage.html",        // 현재 페이지
    "프로필 관리": "profile.html",
    "쿠폰/포인트": "coupon.html",
    "관심 숙소": "wishlist.html",
    "고객센터": "cs.html"
  };

  sideButtons.forEach(button => {
    button.addEventListener("click", function () {

      const text = this.innerText.trim();

      // ✅ active 효과 유지
      sideButtons.forEach(btn => btn.classList.remove("active"));
      this.classList.add("active");

      // ✅ 실제 화면 이동
      if (sideLinkMap[text]) {
        setTimeout(() => {
          window.location.href = sideLinkMap[text];
        }, 150);
      }

    });
  });


  /* ===============================
     2️⃣ 상세보기 버튼 기능 유지
  =============================== */

  const detailButtons = document.querySelectorAll(".btn.outline");

  detailButtons.forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();

      this.style.backgroundColor = "#222";
      this.style.color = "#fff";

      setTimeout(() => {
        window.location.href = "detail.html";
      }, 150);
    });
  });


  /* ===============================
     3️⃣ 후기 작성 버튼 기능 유지
  =============================== */

  const reviewButtons = document.querySelectorAll(".btn.solid");

  reviewButtons.forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();

      this.style.backgroundColor = "#ff4d4f";
      this.style.color = "#fff";

      setTimeout(() => {
        window.location.href = "review.html";
      }, 150);
    });
  });

});