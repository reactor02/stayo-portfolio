window.onload = function () {
    // const form = document.getElementById('login-form');
    const login = this.document.querySelector(".login-btn")
    const email = document.getElementById('email')
    const password = document.querySelector('#password')
    const error = document.getElementById('error-msg')
    login.addEventListener('click', function (e) {
        e.preventDefault(); // 브라우저 고유의 동작을 막기위해 넣음

        const emailValue = email.value.trim();
        const passwordValue = password.value.trim();
        if (emailValue === "" && passwordValue === "") {
            error.textContent = "이메일과 비밀번호를 입력해주세요.";
            error.classList.remove("hide");
        }
        else if (emailValue === "") {
            error.textContent = "이메일을 입력해주세요.";
            error.classList.remove("hide");
        }
        else if (passwordValue === "") {
            error.textContent = "비밀 번호를 입력해주세요.";
            error.classList.remove("hide");
        }
        else {
            error.classList.add("hide");
            alert("로그인 완료");
        }
    })

}
