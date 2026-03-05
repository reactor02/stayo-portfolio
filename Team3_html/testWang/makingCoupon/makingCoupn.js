window.addEventListener('load', bind)
function bind() {
    //생성 버튼
    const dialog = document.getElementById("myDialog");
    const openBtn = document.getElementById("openBtn");
    const closeBtn = document.getElementById("closeBtn");

    // 수정 버튼
    const dialog2 = document.getElementById("myDialog2");
    const cBtn2 = document.getElementsByClassName("cBtn2");
    const closeBtn2 = document.getElementById("closeBtn2");
    // 쿠폰 생성
    const makecouponBtn = document.getElementById("makecouponBtn")
    const couponList = document.getElementById("couponList")
    const couponName = document.getElementById("couponName")
    const couponDiscount = document.getElementById("couponDiscount")
    // 쿠폰 수정용 전역 변수
    let currentEditItem = null;

    const minDate = document.getElementById("minDate");
    const maxDate = document.getElementById("maxDate");

    console.log(makecouponBtn)
    console.log(couponList)
    console.log(couponDiscount)
    // 생성용
    openBtn.addEventListener("click", () => {
        dialog.showModal();
    });

    closeBtn.addEventListener("click", () => {
        dialog.close();
    });
    // 수정용
    // cBtn2[0].addEventListener("click", () => {
    //     dialog2.showModal();
    // });

    closeBtn2.addEventListener("click", () => {
        dialog2.close();
    });




    // 오늘 날짜 제한
    const today = new Date().toISOString().split('T')[0];
    const today2 = new Date().toISOString().split('T')[0]
    console.log(today2)


    minDate.min = today;
    maxDate.min = today;

    // 체크인 날짜 선택 시 텍스트 업데이트 및 체크아웃 최소날짜 설정
    minDate.addEventListener("input", function () {
        maxDate.min = this.value;
    });

    // 체크아웃 날짜 선택 시 텍스트 업데이트
    maxDate.addEventListener("input", function () {
        maxDate.value = this.value;
    });

    makecouponBtn.addEventListener('click', function (evt) {

        try {
            const article = document.createElement("article");
            let name = couponName.value
            let dis = couponDiscount.value
            let expMin = minDate.value
            let expMax = maxDate.value
            console.log(minDate.value + maxDate.value)
            console.log(couponName.value)
            console.log(couponDiscount.value)
            article.className = "item item--warn";
            if (!couponName.value || !couponDiscount.value || !minDate.value || !maxDate.value) {
                alert("빈칸을 전부 채워주세요")
                return
            };

            if (today2 <= maxDate.value) {
                article.innerHTML = `
                
                <div class="item__left">
                <div class="item__title">쿠폰 이름: ${name}</div>
                <div class="discount red">할인율: ${dis}</div>
                <div class="item__meta muted"> 유효기간: ${expMin} ~ ${expMax}</div>
                </div>
                <div class="item__right">
                <button class="mini mini--ok cBtn" type="button">쿠폰 삭제2</button>
                <button class="mini cBtn2" type="button">쿠폰 수정2</button>
                </div>
                
            `;

                couponList.prepend(article);
            } else if (today2 > expMax) {
                article.innerHTML = `
                
                <div class="item__left">
                <div class="item__title">쿠폰 이름: ${name}</div>
                <div class="discount red">할인율: ${dis}</div>
                <div class="item__meta muted line-through"> 유효기간만료: ${expMin} ~ ${expMax}</div>
                </div>
                <div class="item__right">
                <button class="mini mini--ok cBtn" type="button">쿠폰 삭제2</button>
                <button class="mini cBtn2" type="button">쿠폰 수정2</button>
                </div>
                
            `
                couponList.prepend(article);
            }


        } catch (error) {
            console.log("테러나이트")
        }
        // evt.stopPropagation()
        console.log("click")

    })
    // 쿠폰 조작
    const aa = document.querySelector("#couponList")
    aa.addEventListener("click", function (e) {
        // 쿠폰 삭제
        if (e.target.classList.contains('cBtn')) {
            const parentCoupon = e.target.parentNode.parentNode
            parentCoupon.remove()
            // 쿠폰 수정
        } else if (e.target.classList.contains('cBtn2')) {
            // 클릭된 버튼의 조상인 .item 요소를 찾아서 변수에 저장
            currentEditItem = e.target.closest('.item');

            // 기존 쿠폰에 적힌 텍스트 읽어오기 및 value에 필요없는 문자열 삭제
            const oldName = currentEditItem.querySelector('.item__title').innerText.replace('쿠폰 이름: ', '');
            const oldDiscount = currentEditItem.querySelector('.discount').innerText.replace('할인율: ', '');

            // 수정 모달(myDialog2)의 입력창에 기존 값 넣어주기
            document.getElementById("couponName2").value = oldName;
            document.getElementById("couponDiscount2").value = oldDiscount;

            // 수정 모달 열기
            dialog2.showModal()
        }

    })


    // console.log(e.target)
    // const parentCoupon =e.currentTarget.parentNode.parentNode
    // parentCoupon.remove()


    const makeCouponBtn2 = document.getElementById("makeCouponBtn2");

    makeCouponBtn2.addEventListener('click', function () {
        try {
            if (currentEditItem) {
                // 모달창에 새로 입력한 값들 가져오기
                const newName = document.getElementById("couponName2").value;
                const newDiscount = document.getElementById("couponDiscount2").value;
                const newMin = document.getElementById("minDate2").value;
                const newMax = document.getElementById("maxDate2").value;

                // 필수 입력 체크 (빈칸 방지)
                if (!newName || !newMin || !newMax) {
                    alert("수정할 내용을 모두 입력해주세요.");
                    return;
                }

                // 기억해둔 기존 쿠폰 요소의 내용을 새 값으로 덮어쓰기
                currentEditItem.querySelector('.item__title').innerText = `쿠폰 이름: ${newName}`;
                currentEditItem.querySelector('.discount').innerText = `할인율: ${newDiscount}`;

                // 날짜 상태 업데이트 (만료 여부 체크 포함)
                const metaArea = currentEditItem.querySelector('.item__meta');
                if (today2 > newMax) {
                    metaArea.className = "item__meta muted line-through";
                    metaArea.innerText = `유효기간만료: ${newMin} ~ ${newMax}`;
                } else {
                    metaArea.className = "item__meta muted";
                    metaArea.innerText = `유효기간: ${newMin} ~ ${newMax}`;
                }

                // 모달 닫기 및 타겟 초기화
                dialog2.close();
                currentEditItem = null;
            }

        } catch(error) {
            console.log("수정 중 예기치 못한 에러가 발생했습니다. \n 잠시 후 다시 시작해주세요")
        }
       
      
    });


}

