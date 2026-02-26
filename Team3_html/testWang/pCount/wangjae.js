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
    e.stopPropagation(); // 🔥 중요
    popup.style.display = "block";
    });

    // 팝업 내부 클릭시 닫히는거 방지
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
        pNumber.value = `사람 ${count}명`
        realNumber.value= count
        popup.style.display = "none";

    });

    

}


