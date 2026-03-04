window.onload = function () {
    // const form = document.getElementById('login-form');
    const login = this.document.querySelector(".login-btn")
    const email = document.getElementById('email')
    const password = document.querySelector('#password')
    const error = document.getElementById('error-msg')
    const modal = document.getElementById("modal");
    const modalText = document.getElementById("modal-text");
    const modalClose = document.getElementById("modal-close");

    modalClose.addEventListener("click", function () {
        modal.classList.add("hide");
    });

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

        else if (emailValue.indexOf("@") === -1 || emailValue.indexOf(".") === -1 
            || emailValue.length <6) {
            error.textContent = "이메일 형식이 올바르지 않습니다";
            error.classList.remove("hide");
        }
        else if (passwordValue === "") {
            error.textContent = "비밀 번호를 입력해주세요.";
            error.classList.remove("hide");
        }
        else {
            modalText.textContent = "로그인 완료!";
            modal.classList.remove("hide");
            // window.location.href = "Team3_signup.html" // 메인페이지로 이동될 주소 넣기
        }
    })

}
