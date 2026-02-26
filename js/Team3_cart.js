document.addEventListener("DOMContentLoaded", function () {
  const cartItems = document.querySelectorAll(".cart-item");
  const totalPriceEl = document.querySelector(".summary .row:nth-child(1) b");
  const discountEl = document.querySelector(".summary .discount");
  const finalPriceEl = document.querySelector(".summary .total b");
  const payBtn = document.querySelector(".pay-btn");

  function getNumber(text) {
    return parseInt(text.replace(/[^0-9]/g, ""));
  }

  function formatWon(num) {
    return num.toLocaleString() + "원";
  }

  // ✅ 1. 각 상품 단가 데이터셋 저장 (기존 기능)
  cartItems.forEach(item => {
    const priceEl = item.querySelector(".price");
    const originalPrice = getNumber(priceEl.textContent);
    item.dataset.unitPrice = originalPrice;
  });

  // ✅ 2. 페이지 매핑 정보
  const productLinks = {
    "Hotel Bemger": "hotel_bemger_option.html",
    "Hotel Scomtian": "hotel_scomtian_option.html",
    "Hotel Senitanl": "hotel_senitanl_option.html"
  };

  // ✅ 3. 이미지 및 상품명 링크 연결 (추가 기능)
  cartItems.forEach(item => {
    const nameEl = item.querySelector(".name");
    const thumbEl = item.querySelector(".thumb"); 
    const hotelName = nameEl.textContent.trim();

    if (productLinks[hotelName]) {
      // 상품명 클릭 이벤트
      nameEl.style.cursor = "pointer";
      nameEl.style.textDecoration = "underline";
      nameEl.addEventListener("click", () => {
        window.location.href = productLinks[hotelName];
      });

      // 이미지 클릭 이벤트 추가
      thumbEl.style.cursor = "pointer";
      thumbEl.addEventListener("click", () => {
        window.location.href = productLinks[hotelName];
      });
    }
  });

  // ✅ 4. 결제하기 버튼 연결 (추가 기능)
  if (payBtn) {
    payBtn.addEventListener("click", function() {
      // 결제 페이지로 이동
      window.location.href = "checkout.html"; 
    });
  }

  // ✅ 5. 장바구니 합계 업데이트 로직 (기존 기능 유지)
  function updateSummary() {
    let total = 0;

    cartItems.forEach(item => {
      const checkbox = item.querySelector("input[type='checkbox']");
      const qtyEl = item.querySelector(".qty-val");
      const priceEl = item.querySelector(".price");

      const unitPrice = parseInt(item.dataset.unitPrice);
      const qty = parseInt(qtyEl.textContent);
      const itemTotal = unitPrice * qty;

      priceEl.textContent = formatWon(itemTotal);

      if (checkbox.checked) {
        total += itemTotal;
      }
    });

    const discount = Math.floor(total * 0.1);
    const finalPrice = total - discount;

    totalPriceEl.textContent = formatWon(total);
    discountEl.textContent = "-" + formatWon(discount);
    finalPriceEl.textContent = formatWon(finalPrice);
  }

  // ✅ 6. 수량 조절 및 체크박스 이벤트 (기존 기능 유지)
  cartItems.forEach(item => {
    const minusBtn = item.querySelector(".qty-btn:first-child");
    const plusBtn = item.querySelector(".qty-btn:last-child");
    const qtyEl = item.querySelector(".qty-val");
    const checkbox = item.querySelector("input[type='checkbox']");

    minusBtn.addEventListener("click", function () {
      let qty = parseInt(qtyEl.textContent);
      if (qty > 1) {
        qtyEl.textContent = qty - 1;
        updateSummary();
      }
    });

    plusBtn.addEventListener("click", function () {
      let qty = parseInt(qtyEl.textContent);
      qtyEl.textContent = qty + 1;
      updateSummary();
    });

    checkbox.addEventListener("change", updateSummary);
  });

  updateSummary();
});