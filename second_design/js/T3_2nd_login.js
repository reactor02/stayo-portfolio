window.onload = function () {

    const form = document.querySelector(".login-form");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const error = document.querySelector("#error-msg");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener("submit", function (e) {

        e.preventDefault();
        error.classList.add("hide");

        //  여기서 값을 다시 읽어야 함
        const emailValue = email.value.trim();
        const passwordValue = password.value.trim();
        
        // 관리자용 로그인 하드코딩 
        if (emailValue === "asdf1234@stayo.com" && passwordValue === "asdf1234") {
            alert('관리자로 로그인 하시겠습니까?')
            window.document.location.href= "T3_2nd_index_guest.html" // 이거 관리자용 메인페이지로 링크바꾸면 됨 
        }  


        if (emailValue === "" && passwordValue === "") {
            error.textContent = "이메일과 비밀번호를 입력해주세요.";
            error.classList.remove("hide");
            return;
        }
        else if (emailValue === "") {
            error.textContent = "이메일을 입력해주세요.";
            error.classList.remove("hide");
            return;
        }
        else if (!emailRegex.test(emailValue)) {
            error.textContent = "이메일 형식이 올바르지 않습니다.";
            error.classList.remove("hide");
            return;
        }
        else if (passwordValue === "") {
            error.textContent = "비밀번호를 입력해주세요.";
            error.classList.remove("hide");
            return;
        }

        //  유효성 통과 후 서버 로그인 요청
        API.V1.TB.Auth.login({
            loginId: emailValue,
            password: passwordValue
        })
            .done(function (res) {
                alert("로그인 성공");

                // 필요하면 여기서 토큰 저장 가능
                // localStorage.setItem("loginUser", JSON.stringify(res));
                // 로그인 상태 저장
                localStorage.setItem("login", "true");

                window.location.href = "T3_2nd_index.html";
            })
            .fail(function (err) {
                error.textContent = "아이디 또는 비밀번호가 올바르지 않습니다.";
                error.classList.remove("hide");
                console.log("로그인 실패", err);
            });

    });

    const kakaoBtn = document.getElementById("kakao-btn");
    const naverBtn = document.getElementById("naver-btn");
    kakaoBtn.addEventListener("click", function () {
        alert("카카오 로그인 기능은 추후 구현 예정입니다.");
        window.location.href = "https://accounts.kakao.com/"
    });

    naverBtn.addEventListener("click", function () {
        alert("네이버 로그인 기능은 추후 구현 예정입니다.");
        window.location.href = "https://nid.naver.com/"
    });


};