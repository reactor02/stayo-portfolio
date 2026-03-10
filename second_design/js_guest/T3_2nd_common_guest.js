document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".header");

    // 헤더가 없을 경우
    if (!header) {
        return;
    };

    // 준비안된 메뉴들 전부 alert
    const yet = document.querySelectorAll(".alert")

    yet.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            alert("준비중입니다.");
        })
    })   
});





