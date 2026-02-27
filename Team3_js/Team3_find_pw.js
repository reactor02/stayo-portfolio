window.onload = function () {

    const email = document.querySelector('#email');
    const btn = document.querySelector('.find-btn');
    const error = document.querySelector('.error-msg');

    btn.addEventListener('click', function () {

    const emailValue = email.value.trim();

        error.classList.add("hide");

        if (emailValue === "") {
            error.textContent = "이메일을 입력해주세요.";
            error.classList.remove("hide");

        } else if (emailValue.indexOf("@") === -1 || emailValue.indexOf(".") === -1) {
            error.textContent = "올바른 이메일 형식이 아닙니다.";
            error.classList.remove("hide");

        } else {
            alert("비밀번호 찾기 요청이 완료되었습니다.");
        }

    });
};