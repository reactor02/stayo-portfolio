window.onload = function () {
    const name = document.querySelector('#name')
    const phone = document.querySelector('#phone')
    const btn = document.querySelector('.find-btn')
    const error = document.querySelector('.error-msg')

    const tabId = document.querySelector('#tab-id');
    const tabPw = document.querySelector('#tab-pw');
    const nameLabel = document.querySelector('#name-label'); // 아이디 찾기 버튼과 비밀번호 찾기 버튼을 눌렀을 때 다른 효과가 나타나게 // 설정하려고 만듦

    const phoneGroup = phone.parentNode; // 휴대폰 전체 div 
    const userservice = document.querySelector('#user-service')
    
    btn.addEventListener('click', function () {

        const nameValue = name.value.trim();
        const phoneValue = phone.value.trim();
        
        // 기본적으로 숨겨놓기
        // error.classList.add("hide");
        
        if (nameValue === "" && phoneValue === "") {
            error.textContent = "이름과 휴대폰 번호를 입력해주세요.";
            error.classList.remove("hide");
            
        } else if (nameValue === "") {
            error.textContent = "이름을 입력해주세요.";
            error.classList.remove("hide");
            
        } else if (phoneValue === "") {
            error.textContent = "휴대폰 번호를 입력해주세요.";
            error.classList.remove("hide");
            
        } else if (isNaN(phoneValue)) { // 숫자인지 검사
            error.textContent = "휴대폰 번호는 숫자만 입력해주세요.";
            error.classList.remove("hide");
            
        } else if (phoneValue.length < 10 || phoneValue.length > 11) {
            error.textContent = "휴대폰 번호는 10~11자리로 입력해주세요.";
            error.classList.remove("hide");
            
        } else {
            alert("아이디 찾기 요청이 완료되었습니다.");
        }
        
    });
    tabPw.addEventListener('click',function(){
        
    })
    
    
    userservice.addEventListener('click', function () {
        
    })
    
    
};