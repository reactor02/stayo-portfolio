window.onload = function () {
    const password = document.querySelector('#password')
    const passwordcheck = document.querySelector('#passwordcheck')
    const birth = document.querySelector('#birth')
    const phone = document.querySelector('#phone')
    const email = document.querySelector('#email')
    const joinBtn = document.querySelector('#joinBtn')

    const passwordError = document.querySelector('#passwordError');
    const passwordCheckError = document.querySelector('#passwordCheckError');
    const birthError = document.querySelector('#birthError');
    const phoneError = document.querySelector('#phoneError');
    const emailError = document.querySelector('#emailError');

    const agree1 = document.querySelector('#agree1');
    const agree2 = document.querySelector('#agree2');
    const agree3 = document.querySelector('#agree3');
    const agreeError = document.querySelector('#agreeError');


    joinBtn.addEventListener('click', function () {

        // 입력값 가져오기
        const passwordValue = password.value.trim();
        const passwordCheckValue = passwordcheck.value.trim();
        const birthValue = birth.value.trim();
        const phoneValue = phone.value.trim();
        const emailValue = email.value.trim();

        // 기존 에러 초기화
        passwordError.textContent = "";
        passwordCheckError.textContent = "";
        birthError.textContent = "";
        phoneError.textContent = "";
        emailError.textContent = "";

        let isValid = true;

        // 비밀번호 검사
        if (passwordValue.length < 8) {
            passwordError.textContent = "비밀번호는 8자 이상이어야 합니다.";
            isValid = false;
        }

        // 비밀번호 확인 검사
        if (passwordValue !== passwordCheckValue) {
            passwordCheckError.textContent = "비밀번호가 일치하지 않습니다.";
            isValid = false;
        }

        // 생년월일 검사 (8자리 숫자)
        const birthRegex = /^\d{8}$/; // 숫자 8자리만 허용 
        if (!birthRegex.test(birthValue)) { // 정규식과 birthValue가 일치하지 않으면 
            birthError.textContent = "생년월일은 8자리 숫자로 입력하세요.";
            isValid = false;
        }

        // 전화번호 검사 (10~11자리 숫자)
        const phoneRegex = /^\d{10,11}$/; // 숫자 10~11자리만 허용 
        if (!phoneRegex.test(phoneValue)) {
            phoneError.textContent = "전화번호는 - 없이 숫자만 입력하세요.";
            isValid = false;
        }

        // 이메일 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 
        if (!emailRegex.test(emailValue)) {
            emailError.textContent = "올바른 이메일 형식이 아닙니다.";
            isValid = false;
        }

        // 필수 체크박스 검사
        if (!agree1.checked || !agree2.checked || !agree3.checked) {
            agreeError.textContent = "필수 약관에 모두 동의해주세요.";
            isValid = false;
        }

        // 모든 검사 통과
        if (isValid) {
            alert("회원가입 완료!");
        }






    })

}
