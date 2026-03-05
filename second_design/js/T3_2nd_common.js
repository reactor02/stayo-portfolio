document.addEventListener("DOMContentLoaded", ()=>{
    const header = document.querySelector(".header");

    // 헤더가 없을 경우
    if(!header){
        return;
    };

    // 로그인이 성공했을 때 헤더 ui 바꿈
    if(localStorage.getItem("login") === "true"){
        header.classList.add("is-login");
    }; 

    const userMenu = document.querySelector(".user-menu");
    const avatarBtn = document.querySelector(".user-avatar-btn");

    if(!userMenu || !avatarBtn) return;

    avatarBtn.addEventListener('click', (e)=>{
        e.stopPropagation(); // 이벤트 전파 방지
        userMenu.classList.toggle("is-open");
    });

    document.addEventListener("click", (e) => {
        if(!userMenu.contains(e.target)){
            userMenu.classList.remove("is-open");
        }
    });

    const logout = document.querySelector(".logout");
    
    logout.addEventListener("click", ()=>{
    
        localStorage.removeItem("login");
        location.href = "T3_2nd_index.html";
    
    })
});
