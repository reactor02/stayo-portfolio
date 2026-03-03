document.addEventListener("DOMContentLoaded", function () {

  /* ===============================
     1️⃣ 사이드 메뉴 5개 링크 기능 유지
  =============================== */

  const sideButtons = document.querySelectorAll(".side-item");

  const sideLinkMap = {
    "예약 내역": "mypage.html",
    "프로필 관리": "profile.html",
    "쿠폰/포인트": "coupon.html",
    "관심 숙소": "wishlist.html",
    "고객센터": "cs.html"
  };

  sideButtons.forEach(button => {
    button.addEventListener("click", function () {

      const text = this.innerText.replace(/\s/g, "");

      sideButtons.forEach(btn => btn.classList.remove("active"));
      this.classList.add("active");

      if (text.includes("예약내역")) {
        window.location.href = sideLinkMap["예약 내역"];
      } 
      else if (text.includes("프로필관리")) {
        window.location.href = sideLinkMap["프로필 관리"];
      }
      else if (text.includes("쿠폰/포인트")) {
        window.location.href = sideLinkMap["쿠폰/포인트"];
      }
      else if (text.includes("관심숙소")) {
        window.location.href = sideLinkMap["관심 숙소"];
      }
      else if (text.includes("고객센터")) {
        window.location.href = sideLinkMap["고객센터"];
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


  /* ===============================
     4️⃣ 헤더 메뉴 (동행 / 회원신청 / 마이메리) 추가
  =============================== */

  const headerLinks = document.querySelectorAll(".nav a");

  const headerLinkMap = {
    "동행": "companion.html",
    "회원신청": "signup.html",
    "마이메리": "mypage.html"
  };

  headerLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const text = this.innerText.trim();

      // 클릭 시 시각적 효과
      this.style.color = "#ff4d4f";
      this.style.fontWeight = "bold";

      if (headerLinkMap[text]) {
        setTimeout(() => {
          window.location.href = headerLinkMap[text];
        }, 150);
      }
    });
  });

});