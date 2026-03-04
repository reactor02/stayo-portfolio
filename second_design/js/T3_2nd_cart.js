document.addEventListener("DOMContentLoaded", function () {

  /* ===============================
     🔐 로그인 시스템
  =============================== */

  const loginBtn = document.querySelector(".btn--login");
  const payBtn = document.querySelector(".btn-main--big");

  function isLoggedIn() {
    return localStorage.getItem("stayoUser") !== null;
  }

  function updateLoginUI() {
    if (isLoggedIn()) {
      loginBtn.textContent = "로그아웃";
    } else {
      loginBtn.textContent = "로그인";
    }
  }

  loginBtn.addEventListener("click", function (e) {
    e.preventDefault();

    if (isLoggedIn()) {
      localStorage.removeItem("stayoUser");
      alert("로그아웃 되었습니다.");
      updateLoginUI();
      return;
    }

    const id = prompt("아이디를 입력하세요");
    const pw = prompt("비밀번호를 입력하세요");

    if (!id || !pw) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    // 간단한 테스트 계정
    if (id === "admin" && pw === "1234") {
      localStorage.setItem("stayoUser", id);
      alert("로그인 성공!");
      updateLoginUI();
    } else {
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  });

  updateLoginUI();


  /* ===============================
     🛒 장바구니 시스템
  =============================== */

  const cartBox = document.querySelector(".cart-left");
  const summaryBox = document.querySelector(".summary-price");

  const TAX = 35000;
  const DISCOUNT_RATE = 0.1;

  let deletedItems = [];

  function getNumber(text) {
    return parseInt(text.replace(/[^0-9]/g, ""));
  }

  function formatWon(num) {
    return "₩" + num.toLocaleString();
  }

  function updateSummary() {

    const cartItems = document.querySelectorAll(".cart-item");
    let total = 0;

    cartItems.forEach(item => {
      const sumEl = item.querySelector(".cart-item__sum b");
      total += getNumber(sumEl.textContent);
    });

    const discount = Math.floor(total * DISCOUNT_RATE);
    const finalTotal = total + TAX - discount;

    const rows = summaryBox.querySelectorAll(".sum-row");

    rows[0].querySelector("b").textContent = formatWon(total);
    rows[1].querySelector("b").textContent = formatWon(TAX);
    rows[2].querySelector("b").textContent = "-" + formatWon(discount);
    rows[3].querySelector("b").textContent = formatWon(finalTotal);
  }


  /* ===============================
     ✏ 수정 / 삭제
  =============================== */

  cartBox.addEventListener("click", function (e) {

    const btn = e.target.closest("button");
    if (!btn) return;

    const item = btn.closest(".cart-item");
    if (!item) return;

    // 수정 버튼
    if (btn.textContent.trim() === "수정") {

      const nightEl = item.querySelector(".pill:last-child");
      let nights = parseInt(nightEl.textContent);

      nights = nights === 1 ? 2 : 1;
      nightEl.textContent = nights + "박";

      const unitPrice = getNumber(
        item.querySelector(".cart-item__price b").textContent
      );

      const newTotal = unitPrice * nights;

      item.querySelector(".cart-item__sum").innerHTML =
        `${formatWon(unitPrice)} × ${nights}박 = <b>${formatWon(newTotal)}</b>`;

      updateSummary();
    }

    // 삭제 버튼
    if (btn.textContent.trim() === "삭제") {

      if (!confirm("상품을 삭제하시겠습니까?")) return;

      deletedItems.push(item);
      item.remove();

      updateSummary();
      checkEmptyCart();
      updateScroll();
    }

  });


  /* ===============================
     🧺 빈 장바구니
  =============================== */

  const emptyMessage = document.createElement("div");
  emptyMessage.className = "empty";
  emptyMessage.innerHTML = `
      <div class="empty__icon">🧺</div>
      <div class="empty__title">장바구니가 비어있어요</div>
      <div class="empty__desc muted">원하는 숙소를 찾아 담아보세요.</div>
      <a class="btn-main" href="./list.html">숙소 보러가기</a>
  `;
  emptyMessage.style.display = "none";
  cartBox.appendChild(emptyMessage);

  function checkEmptyCart() {
    const cartItems = document.querySelectorAll(".cart-item");
    emptyMessage.style.display = cartItems.length === 0 ? "block" : "none";
  }


  /* ===============================
     ♻ 삭제 상품 복구
  =============================== */

  const restoreBtn = document.createElement("button");
  restoreBtn.textContent = "삭제 상품 재추가";
  restoreBtn.className = "btn-outline";
  restoreBtn.style.margin = "20px 0";
  cartBox.appendChild(restoreBtn);

  restoreBtn.addEventListener("click", function () {

    if (deletedItems.length === 0) return;

    if (!confirm("삭제된 상품을 다시 추가하시겠습니까?")) return;

    deletedItems.forEach(item => {
      cartBox.insertBefore(item, emptyMessage);
    });

    deletedItems = [];
    updateSummary();
    checkEmptyCart();
    updateScroll();
  });


  /* ===============================
     🗑 전체 삭제
  =============================== */

  const deleteAllBtn = document.createElement("button");
  deleteAllBtn.textContent = "전체 삭제";
  deleteAllBtn.className = "btn-ghost";
  deleteAllBtn.style.marginLeft = "10px";
  restoreBtn.after(deleteAllBtn);

  deleteAllBtn.addEventListener("click", function () {

    if (!confirm("전체 상품을 삭제하시겠습니까?")) return;

    document.querySelectorAll(".cart-item").forEach(item => {
      deletedItems.push(item);
      item.remove();
    });

    updateSummary();
    checkEmptyCart();
    updateScroll();
  });


  /* ===============================
     📜 스크롤 제한
  =============================== */

  function updateScroll() {
    const cartItems = document.querySelectorAll(".cart-item");
    if (cartItems.length >= 10) {
      cartBox.style.maxHeight = "700px";
      cartBox.style.overflowY = "auto";
    } else {
      cartBox.style.maxHeight = "";
      cartBox.style.overflowY = "";
    }
  }


  /* ===============================
     💳 결제 버튼
  =============================== */

  payBtn.addEventListener("click", function (e) {

  const cartItems = document.querySelectorAll(".cart-item");

  if (cartItems.length === 0) {
    alert("결제할 상품이 없습니다.");
    e.preventDefault();
    return;
  }

  if (!confirm("선택한 상품을 결제하시겠습니까?")) {
    e.preventDefault();
  }
});

  /* ===============================
     🔗 네비게이션 링크
  =============================== */

  const navLinks = document.querySelectorAll(".gnb__link");

  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const text = link.textContent.trim();

      if (text === "동행") {
        window.location.href = "companion.html";
      }
      else if (text === "회원신청") {
        window.location.href = "signup.html";
      }
      else if (text.includes("마이페이지")) {
        window.location.href =
          "http://127.0.0.1:5500/Team3_html/Team3_mypage.html";
      }
    });
  });


  /* ===============================
     🚀 초기 실행
  =============================== */

  updateSummary();
  checkEmptyCart();
  updateScroll();

});