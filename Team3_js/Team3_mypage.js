document.addEventListener("DOMContentLoaded", function () {

  /* ===============================
     1️⃣ 사이드 메뉴 기능 (그대로 유지)
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

      if (text.includes("예약내역")) window.location.href = sideLinkMap["예약 내역"];
      else if (text.includes("프로필관리")) window.location.href = sideLinkMap["프로필 관리"];
      else if (text.includes("쿠폰/포인트")) window.location.href = sideLinkMap["쿠폰/포인트"];
      else if (text.includes("관심숙소")) window.location.href = sideLinkMap["관심 숙소"];
      else if (text.includes("고객센터")) window.location.href = sideLinkMap["고객센터"];

    });
  });


  /* ===============================
     2️⃣ 상세보기 / 후기 작성 (유지)
  =============================== */

  document.querySelectorAll(".btn.outline").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      this.style.backgroundColor = "#222";
      this.style.color = "#fff";
      setTimeout(() => window.location.href = "detail.html", 150);
    });
  });

  document.querySelectorAll(".btn.solid").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      this.style.backgroundColor = "#ff4d4f";
      this.style.color = "#fff";
      setTimeout(() => window.location.href = "review.html", 150);
    });
  });


  /* ===============================
     3️⃣ 헤더 메뉴 + 마이메리 기능 확장
  =============================== */

  const headerLinks = document.querySelectorAll(".nav a");

  headerLinks.forEach(link => {
    link.addEventListener("click", function (e) {

      const text = this.innerText.trim();

      this.style.color = "#ff4d4f";
      this.style.fontWeight = "bold";

      if (text === "동행") {
        e.preventDefault();
        setTimeout(() => window.location.href = "companion.html", 150);
      }

      else if (text === "회원신청") {
        e.preventDefault();
        setTimeout(() => window.location.href = "signup.html", 150);
      }

      else if (text.includes("마이메리")) {
        e.preventDefault();
        showAccountSettings();
      }

    });
  });


  /* ===============================
     4️⃣ 아이디 + 비밀번호 관리 UI
  =============================== */

  function showAccountSettings() {

    if (document.getElementById("account-box")) return;

    const container = document.createElement("div");
    container.id = "account-box";
    container.style.marginTop = "30px";
    container.style.padding = "20px";
    container.style.border = "1px solid #ddd";
    container.style.borderRadius = "8px";
    container.style.backgroundColor = "#fafafa";

    // 기본 아이디 (임시 저장용)
    let currentId = localStorage.getItem("userId") || "nanoUser";

    container.innerHTML = `
      <h3>계정 관리</h3>

      <h4>현재 아이디</h4>
      <p id="currentId">${currentId}</p>

      <input type="text" id="newId" placeholder="새 아이디 입력" style="display:block;margin:10px 0;padding:8px;width:250px;">
      <button id="changeIdBtn" style="padding:6px 12px;">아이디 변경</button>
      <p id="idMessage" style="margin-top:8px;"></p>

      <hr style="margin:20px 0;">

      <h4>비밀번호 변경</h4>
      <input type="password" id="newPw" placeholder="새 비밀번호 입력" style="display:block;margin:10px 0;padding:8px;width:250px;">
      <input type="password" id="confirmPw" placeholder="새 비밀번호 확인" style="display:block;margin:10px 0;padding:8px;width:250px;">
      <button id="changePwBtn" style="padding:6px 12px;">비밀번호 변경</button>
      <p id="pwMessage" style="margin-top:8px;"></p>
    `;

    document.querySelector(".my-content").prepend(container);


    /* ===== 아이디 변경 기능 ===== */

    document.getElementById("changeIdBtn").addEventListener("click", function () {

      const newId = document.getElementById("newId").value.trim();
      const message = document.getElementById("idMessage");

      if (newId === "") {
        message.style.color = "red";
        message.innerText = "새 아이디를 입력해주세요.";
      } else {
        localStorage.setItem("userId", newId);
        document.getElementById("currentId").innerText = newId;
        message.style.color = "green";
        message.innerText = "아이디가 변경되었습니다.";
      }

    });


    /* ===== 비밀번호 변경 기능 ===== */

    document.getElementById("changePwBtn").addEventListener("click", function () {

      const newPw = document.getElementById("newPw").value;
      const confirmPw = document.getElementById("confirmPw").value;
      const message = document.getElementById("pwMessage");

      if (newPw === "" || confirmPw === "") {
        message.style.color = "red";
        message.innerText = "모든 항목을 입력해주세요.";
      }
      else if (newPw !== confirmPw) {
        message.style.color = "red";
        message.innerText = "비밀번호가 일치하지 않습니다.";
      }
      else {
        message.style.color = "green";
        message.innerText = "비밀번호가 성공적으로 변경되었습니다.";
      }

    });

  }

});