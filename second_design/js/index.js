window.addEventListener('load', bind)
function bind(){

    // 팝업창 기능 구현
    const pNumber = document.getElementById("pNumber");
    const realNumber = document.getElementById("realNumber")
    const popup = document.getElementById("popup");
    const minusBtn = document.getElementById("minusBtn")
    const pCount = document.getElementById("pCount")
    const plusBtn = document.getElementById("plusBtn")
    const confirmBtn = document.getElementById("confirmBtn")

    // value 값 저장
    let count = 0;
    
    

    pNumber.addEventListener("click", (e) => {
    e.stopPropagation(); 
    popup.style.display = "block";
    });

    // 팝업 클릭시 닫히는거 방지
    popup.addEventListener("click", (e) => {
    e.stopPropagation();
    });

    // 바깥 클릭 감지
    document.addEventListener("click", () => {
    popup.style.display = "none";
    });
    // 인원 감소
    minusBtn.addEventListener("click", () => {
        if(Number(pCount.textContent) <= 0){
            pCount.textContent =  0
        }else{
            pCount.textContent =  Number(pCount.textContent)-1
            count =  Number(pCount.textContent)
        }
    });

    // 인원 증가
    plusBtn.addEventListener("click", () => {
        pCount.textContent =  Number(pCount.textContent)+1
        count =  Number(pCount.textContent)
    });

    //인풋 창에 적용
    confirmBtn.addEventListener("click", () => {
        pNumber.value = `성인 ${count}명`
        realNumber.value= count
        popup.style.display = "none";

    });


    //checkin checkout
        const text1 = document.getElementById("text1");
    const text2 = document.getElementById("text2");
    const date1 = document.getElementById("date1");
    const date2 = document.getElementById("date2");

    // 오늘 날짜 제한
    const today = new Date().toISOString().split('T')[0];
    date1.min = today;
    date2.min = today;

    // 체크인 날짜 선택 시 텍스트 업데이트 및 체크아웃 최소날짜 설정
    date1.addEventListener("input", function() {
        text1.value = this.value;
        date2.min = this.value;
        text1.remove(); 
        date1.style.color = 'black'
    });

    // 체크아웃 날짜 선택 시 텍스트 업데이트
    date2.addEventListener("input", function() {
        text2.value = this.value;
        text2.remove()
        date2.style.color = 'black'
    });

}