window.addEventListener('load', bind)
function bind() {
    const dialog = document.getElementById("myDialog");
    const openBtn = document.getElementById("openBtn");
    const closeBtn = document.getElementById("closeBtn");
    const makecouponBtn = document.getElementById("makecouponBtn")
    const couponList = document.getElementById("couponList")
    const couponName = document.getElementById("couponName")
    const couponDiscount = document.getElementById("couponDiscount")

    const minDate = document.getElementById("minDate");
    const maxDate = document.getElementById("maxDate");

    console.log(makecouponBtn)
    console.log(couponList)
    console.log(couponDiscount)

    openBtn.addEventListener("click", () => {
        dialog.showModal();
    });

    closeBtn.addEventListener("click", () => {
        dialog.close();
    });


   

    // 오늘 날짜 제한
    const today = new Date().toISOString().split('T')[0];
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
            if(couponName.value && couponDiscount.value && minDate.value && maxDate.value){
        const article = document.createElement("article"); 
        let name = couponName.value
        let dis = couponDiscount.value
        let expMin = minDate.value 
        let expMax = maxDate.value
        console.log(minDate.value + maxDate.value)
        console.log(couponName.value)
        console.log(couponDiscount.value)
        article.className = "item item--warn";
        
        article.innerHTML = `
            <div class="item__left">
            <div class="item__title">쿠폰 이름: ${name}</div>
            <div class="discount red">할인율: ${dis}</div>
            <div class="item__meta muted"> 유효기간: ${expMin} ~ ${expMax}</div>
            </div>
            <div class="item__right">
            <button class="mini mini--ok" type="button">쿠폰 삭제2</button>
            <button class="mini" type="button">쿠폰 수정2</button>
            </div>
            `;

        couponList.prepend(article);
        } else {
            alert("빈칸을 전부 채워주세요")
        }
            
        } catch (error) {
            console("테러나이트")
        }
        // evt.stopPropagation()
        console.log("click")
        
        
        
            
        // } catch (error) {
        //     console.log("무언가 빠졌습니다")
            
        // }

       
        // couponList.innerHTML += `
        //     <article class="item item--warn">
        //     <div class="item__left">
        //         <div class="item__title">쿠폰 이름2</div>
        //         <div class="discount red">할인율2</div>
        //         <div class="item__meta muted">유효기간2</div>
        //     </div>
        //     <div class="item__right">
        //         <button class="mini mini--ok" type="button">쿠폰 삭제2</button>
        //         <button class="mini" type="button">쿠폰 수정2</button>
        //     </div>
        // ` 



    })



}

