window.onload = function() {
    const text1 = document.getElementById("text1");
    const text2 = document.getElementById("text2");
    const date1 = document.getElementById("date1");
    const date2 = document.getElementById("date2");

    // 오늘 날짜 이전 선택 방지
    const today = new Date().toISOString().split('T')[0];
    date1.min = today;
    date2.min = today;

    // 날짜 선택 시 텍스트 상자에 값 복사
    date1.addEventListener("input", function() {
        text1.value = date1.value;
        date2.min = date1.value; // 체크아웃 최소날짜 제한
    });

    date2.addEventListener("input", function() {
        text2.value = date2.value;
    });
};