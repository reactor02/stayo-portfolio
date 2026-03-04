window.onload = function () {

    const form = document.querySelector(".login-form");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const error = document.querySelector("#error-msg");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener("submit", function (e) {
        console.log(error)

        e.preventDefault();

        const emailValue = email.value.trim();
        const passwordValue = password.value.trim();

        error.classList.add("hide");

        if (emailValue === "" && passwordValue === "") {
            error.textContent = "이메일과 비밀번호를 입력해주세요.";
            error.classList.remove("hide");
        }
        else if (emailValue === "") {
            error.textContent = "이메일을 입력해주세요.";
            error.classList.remove("hide");
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) { // 이메일 정규식 버전 
            error.textContent = "이메일 형식이 올바르지 않습니다.";
            error.classList.remove("hide");
        }
        else if (passwordValue === "") {
            error.textContent = "비밀번호를 입력해주세요.";
            error.classList.remove("hide");
        }
        else {
            alert("로그인 완료");
            window.location.href = "T3_2nd_index.html"
        }

    });


    const kakaoBtn = document.getElementById("kakao-btn");
    const naverBtn = document.getElementById("naver-btn");

    kakaoBtn.addEventListener("click", function () {
        alert("카카오 로그인 기능은 추후 구현 예정입니다.");
    });

    naverBtn.addEventListener("click", function () {
        alert("네이버 로그인 기능은 추후 구현 예정입니다.");
    });

};