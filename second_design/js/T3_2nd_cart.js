document.addEventListener("DOMContentLoaded", function () {

  /* ===============================
     🛒 장바구니 시스템
  =============================== */

  const cartBox = document.querySelector(".cart-left");
  const summaryBox = document.querySelector(".summary-price");
  const payBtn = document.querySelector(".btn-main--big"); // 결제 버튼 선택자 추가

  const TAX = 35000;
  // 할인율(DISCOUNT_RATE) 변수 제거됨

  let deletedItems = [];

  function getNumber(text) {
    return parseInt(text.replace(/[^0-9]/g, ""));
  }

  function formatWon(num) {
    return "₩" + num.toLocaleString();
  }

  function updateSummary() {

    const cartItems = document.querySelectorAll(".cart-item");

    let stayTotal = 0;

    cartItems.forEach(item => {
      const sumEl = item.querySelector(".sum-total");
      if (!sumEl) return;

      const price = getNumber(sumEl.textContent);
      stayTotal += price;
    });

    // 세금 및 수수료 (기존 고정값 유지)
    const tax = TAX;

    // 최종 금액 (할인 계산 제외)
    const finalTotal = stayTotal + tax;

    const rows = summaryBox.querySelectorAll(".sum-row");

    if (rows.length >= 3) {
      // 숙박 요금
      rows[0].querySelector("b").textContent = formatWon(stayTotal);

      // 세금 및 수수료
      rows[1].querySelector("b").textContent = formatWon(tax);

      // 총 결제 금액 (할인 행이 빠졌으므로 rows[2]로 변경)
      rows[2].querySelector("b").textContent = formatWon(finalTotal);
    }
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

      let controller = item.querySelector(".qty-controller");

      // 이미 있으면 제거 (토글)
      if (controller) {
        controller.remove();
        return;
      }

      controller = document.createElement("span");
      controller.className = "qty-controller";
      controller.style.marginLeft = "10px";

      controller.innerHTML = `
        <button class="qty-minus">-</button>
        <span class="qty-val">1</span>
        <button class="qty-plus">+</button>
      `;

      btn.after(controller);

      const minusBtn = controller.querySelector(".qty-minus");
      const plusBtn = controller.querySelector(".qty-plus");
      const qtyVal = controller.querySelector(".qty-val");

      const nightEl = item.querySelector(".pill:last-child");

      minusBtn.addEventListener("click", function () {

        let qty = parseInt(qtyVal.textContent);

        if (qty > 1) {
          qty--;
          qtyVal.textContent = qty;
          nightEl.textContent = qty + "박";

          const unitPrice = getNumber(
            item.querySelector(".cart-item__price b").textContent
          );

          const total = unitPrice * qty;

          item.querySelector(".cart-item__sum").innerHTML =
          `
          <div class="sum-line1">${formatWon(unitPrice)} × ${qty}박</div>
          <div class="sum-total">총 ${formatWon(total)}</div>
          `;

          updateSummary();
        }
      });

      plusBtn.addEventListener("click", function () {

        let qty = parseInt(qtyVal.textContent);

        qty++;
        qtyVal.textContent = qty;
        nightEl.textContent = qty + "박";

        const unitPrice = getNumber(
          item.querySelector(".cart-item__price b").textContent
        );

        const total = unitPrice * qty;

        item.querySelector(".cart-item__sum").innerHTML =
        `
        <div class="sum-line1">${formatWon(unitPrice)} × ${qty}박</div>
        <div class="sum-total">총 ${formatWon(total)}</div>
        `;

        updateSummary();
      });
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

  if (payBtn) {
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
  }


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
