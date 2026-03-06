
document.addEventListener("DOMContentLoaded", function () {

  const cartBox = document.querySelector(".cart-box");
  const summary = document.querySelector(".summary");
  const totalPriceEl = document.querySelector(".summary .row:nth-child(1) b");
  const discountEl = document.querySelector(".summary .discount");
  const finalPriceEl = document.querySelector(".summary .total b");
  const payBtn = document.querySelector(".pay-btn");

  let deletedItems = [];

  /* ---------------- 공통 함수 ---------------- */

  function getNumber(text) {
    return parseInt(text.replace(/[^0-9]/g, ""));
  }

  function formatWon(num) {
    return num.toLocaleString() + "원";
  }

  /* ---------------- 초기 상품 세팅 ---------------- */

  function initializeItems() {
    const cartItems = document.querySelectorAll(".cart-item");

    cartItems.forEach(item => {

      // 단가 저장 (최초 1회)
      const priceEl = item.querySelector(".price");
      if (!item.dataset.unitPrice) {
        item.dataset.unitPrice = getNumber(priceEl.textContent);
      }

      // 삭제 버튼 생성
      if (!item.querySelector(".delete-btn")) {
        const delBtn = document.createElement("button");
        delBtn.textContent = "삭제";
        delBtn.className = "delete-btn";
        delBtn.style.marginLeft = "10px";
        item.appendChild(delBtn);

        delBtn.addEventListener("click", function () {
          if (confirm("상품을 삭제하시겠습니까?")) {
            deletedItems.push(item);
            item.remove();
            updateSummary();
            checkEmptyCart();
            updateScroll();
          }
        });
      }

      // 수량 버튼 이벤트
      const minusBtn = item.querySelector(".qty-btn:first-child");
      const plusBtn = item.querySelector(".qty-btn:last-child");
      const qtyEl = item.querySelector(".qty-val");
      const checkbox = item.querySelector("input[type='checkbox']");

      minusBtn.onclick = function () {
        let qty = parseInt(qtyEl.textContent);
        if (qty > 1) {
          qtyEl.textContent = qty - 1;
          updateSummary();
        }
      };

      plusBtn.onclick = function () {
        let qty = parseInt(qtyEl.textContent);
        qtyEl.textContent = qty + 1;
        updateSummary();
      };

      checkbox.onchange = updateSummary;
    });
  }

  /* ---------------- 금액 계산 (할인 % 포함) ---------------- */

  function updateSummary() {
    const cartItems = document.querySelectorAll(".cart-item");
    let total = 0;

    cartItems.forEach(item => {
      const checkbox = item.querySelector("input[type='checkbox']");
      const qtyEl = item.querySelector(".qty-val");
      const priceEl = item.querySelector(".price");

      const unitPrice = parseInt(item.dataset.unitPrice);
      const qty = parseInt(qtyEl.textContent);
      const itemTotal = unitPrice * qty;

      // 상품 금액 표시 변경
      priceEl.textContent = formatWon(itemTotal);

      if (checkbox.checked) {
        total += itemTotal;
      }
    });

    const discountRate = 0.1; // 10%
    const discount = Math.floor(total * discountRate);
    const finalPrice = total - discount;

    totalPriceEl.textContent = formatWon(total);

    if (total > 0) {
      discountEl.textContent =
        "-" + formatWon(discount) + " (" + (discountRate * 100) + "%)";
    } else {
      discountEl.textContent = "-0원 (0%)";
    }

    finalPriceEl.textContent = formatWon(finalPrice);
  }

  /* ---------------- 전체 선택 기능 ---------------- */

  const selectAll = document.createElement("input");
  selectAll.type = "checkbox";
  selectAll.style.marginRight = "10px";

  const selectAllLabel = document.createElement("label");
  selectAllLabel.textContent = "전체 선택";
  selectAllLabel.prepend(selectAll);

  cartBox.insertBefore(selectAllLabel, cartBox.firstChild);

  selectAll.addEventListener("change", function () {
    const cartItems = document.querySelectorAll(".cart-item");
    cartItems.forEach(item => {
      item.querySelector("input[type='checkbox']").checked = selectAll.checked;
    });
    updateSummary();
  });

  /* ---------------- 빈 장바구니 문구 ---------------- */

  const emptyMessage = document.createElement("div");
  emptyMessage.textContent = "장바구니에 담긴 상품이 없습니다.";
  emptyMessage.style.textAlign = "center";
  emptyMessage.style.padding = "30px";
  emptyMessage.style.display = "none";
  cartBox.appendChild(emptyMessage);

  function checkEmptyCart() {
    const cartItems = document.querySelectorAll(".cart-item");
    emptyMessage.style.display = cartItems.length === 0 ? "block" : "none";
  }

  /* ---------------- 삭제 상품 재추가 ---------------- */

  const restoreBtn = document.createElement("button");
  restoreBtn.textContent = "삭제 상품 재추가";
  restoreBtn.style.margin = "10px";
  cartBox.appendChild(restoreBtn);

  restoreBtn.addEventListener("click", function () {
    if (deletedItems.length === 0) return;

    if (confirm("삭제된 상품을 다시 추가하시겠습니까?")) {
      deletedItems.forEach(item => {
        cartBox.insertBefore(item, summary);
      });
      deletedItems = [];
      initializeItems();
      updateSummary();
      checkEmptyCart();
      updateScroll();
    }
  });

  /* ---------------- 10개 이상 스크롤 ---------------- */

  function updateScroll() {
    const cartItems = document.querySelectorAll(".cart-item");
    if (cartItems.length >= 10) {
      cartBox.style.maxHeight = "600px";
      cartBox.style.overflowY = "auto";
    } else {
      cartBox.style.maxHeight = "";
      cartBox.style.overflowY = "";
    }
  }

  /* ---------------- 전체 삭제 ---------------- */

  const deleteAllBtn = document.createElement("button");
  deleteAllBtn.textContent = "전체 삭제";
  deleteAllBtn.style.margin = "10px";
  cartBox.appendChild(deleteAllBtn);

  deleteAllBtn.addEventListener("click", function () {
    if (confirm("전체 상품을 삭제하시겠습니까?")) {
      const cartItems = document.querySelectorAll(".cart-item");
      cartItems.forEach(item => {
        deletedItems.push(item);
        item.remove();
      });
      updateSummary();
      checkEmptyCart();
      updateScroll();
    }
  });

  /* ---------------- 결제 버튼 ---------------- */

  payBtn.addEventListener("click", function () {

    const checkedItems = document.querySelectorAll(".cart-item input[type='checkbox']:checked");

    if (checkedItems.length === 0) {
      alert("결제할 상품을 선택해주세요.");
      return;
    }

    let paymentData = [];
    let finalAmount = document.querySelector(".summary .total b").textContent;

    checkedItems.forEach(checkbox => {
      const item = checkbox.closest(".cart-item");

      paymentData.push({
        name: item.querySelector(".name").textContent,
        quantity: item.querySelector(".qty-val").textContent,
        price: item.querySelector(".price").textContent
      });
    });

    localStorage.setItem("paymentItems", JSON.stringify(paymentData));
    localStorage.setItem("finalAmount", finalAmount);

    if (confirm("선택한 상품을 결제하시겠습니까?")) {
      window.location.href = "payment.html";
    }
  });

  /* ---------------- 초기 실행 ---------------- */

  initializeItems();
  updateSummary();
  checkEmptyCart();
  updateScroll();
});

/* ----- 링크 코드 ------*/
/* ---------------- 🔗 헤더 네비게이션 링크 기능 추가 ---------------- */

(function () {

  const nav = document.querySelector(".nav");
  if (!nav) return;

  const links = nav.querySelectorAll("a");

  links.forEach(link => {

    const text = link.textContent.trim();

    // 기본 a 태그 href="#" 동작 방지
    link.addEventListener("click", function (e) {
      e.preventDefault();

      if (text === "동행") {
        window.location.href = "companion.html";
      }

      else if (text === "회원신청") {
        window.location.href = "signup.html";
      }

      else if (text.includes("마이페이지")) {
        window.location.href = "http://127.0.0.1:5500/Team3_html/Team3_mypage.html";
      }

    });

  });

})();