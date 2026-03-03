window.addEventListener('load', bind)
function bind() {

    // 찜목록 빨간마크
    // document.querySelector('.listNumber').addEventListener('' )



    // 팝업창 기능 구현
    const pNumber = document.getElementById("pNumber");
    const realNumber = document.getElementById("realNumber")
    const popup = document.getElementById("popup");
    const minusBtn = document.getElementById("minusBtn")
    const pCount = document.getElementById("pCount")
    const plusBtn = document.getElementById("plusBtn")
    const confirmBtn = document.getElementById("confirmBtn")
    const heart = document.querySelector("svg.heart")


    //heart 색변경 및 찜버튼에 정보전달
    heart.addEventListener("click", function(e){
        if(getComputedStyle(heart).getPropertyValue('fill') == 'rgb(229, 57, 53)'){
            heart.style.fill = "rgb(107, 107, 107)"
        }else if(getComputedStyle(heart).getPropertyValue('fill') == "rgb(107, 107, 107)"){
            heart.style.fill = 'rgb(229, 57, 53)'
        }
        e.stopPropagation()

    })


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
        if (Number(pCount.textContent) <= 0) {
            pCount.textContent = 0
        } else {
            pCount.textContent = Number(pCount.textContent) - 1
            count = Number(pCount.textContent)
        }
    });

    // 인원 증가
    plusBtn.addEventListener("click", () => {
        pCount.textContent = Number(pCount.textContent) + 1
        count = Number(pCount.textContent)
    });

    //인풋 창에 적용
    confirmBtn.addEventListener("click", () => {
        pNumber.value = `성인 ${count}명`
        realNumber.value = count
        popup.style.display = "none";

    });


    const date1 = document.getElementById('date1');
    const date2 = document.getElementById('date2');
    const text1 = document.getElementById('text1');
    const text2 = document.getElementById('text2');

    // 오늘 이전 날짜 선택 막기
    const today = new Date().toISOString().split('T')[0];
    date1.min = today;
    date2.min = today;

    // 체크인 선택
    date1.addEventListener('change', function () {
        const val = this.value;
        if (!val) return;

        // placeholder 텍스트 숨기고 날짜 표시
        text1.style.display = 'none';
        this.style.color = '#111';

        // 체크아웃 최솟값을 체크인 다음날로 설정
        const next = new Date(val);
        next.setDate(next.getDate() + 1);
        date2.min = next.toISOString().split('T')[0];

        // 체크아웃이 체크인보다 앞이면 초기화
        if (date2.value && date2.value <= val) {
            date2.value = '';
            text2.style.display = '';
            date2.style.color = 'transparent';
        }
    });

    // 체크아웃 선택
    date2.addEventListener('change', function () {
        if (!this.value) return;
        text2.style.display = 'none';
        this.style.color = '#111';
    });






}