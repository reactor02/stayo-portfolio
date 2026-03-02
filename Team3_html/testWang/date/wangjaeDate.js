window.onload = function() {
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
};

