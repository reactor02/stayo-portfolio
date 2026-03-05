window.addEventListener('load', bind)
function bind(){
    const dialog = document.getElementById("myDialog");
    const openBtn = document.getElementById("openBtn");
    const closeBtn = document.getElementById("closeBtn");
    const makeCouponeBtn =document.getElementById("makeCouponeBtn")
    const couponeList =document.getElementById("couponeList")
    

    console.log(makeCouponeBtn)

    openBtn.addEventListener("click", () => {
      dialog.showModal();
    });

    closeBtn.addEventListener("click", () => {
      dialog.close();
    });


    const minDate = document.getElementById("minDate");
    const maxDate = document.getElementById("maxDate");

    // 오늘 날짜 제한
    const today = new Date().toISOString().split('T')[0];
    minDate.min = today;
    maxDate.min = today;

    // 체크인 날짜 선택 시 텍스트 업데이트 및 체크아웃 최소날짜 설정
    minDate.addEventListener("input", function() {
        maxDate.min = this.value;
    });

    // 체크아웃 날짜 선택 시 텍스트 업데이트
    maxDate.addEventListener("input", function() {
        text2.value = this.value; 
    });
    
    makeCouponeBtn.addEventListener('click', function(evt){
        evt.stopPropagation()
        const a = document.createElement('div')
        

    })
    
    

}

