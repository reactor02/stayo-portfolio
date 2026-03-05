window.onload = function () {
    const name = document.querySelector('#name')
    const phone = document.querySelector('#phone')
    const btnId = document.querySelector('#form-id .find-btn')
    const btnPw = document.querySelector('#form-pw .find-btn')
    const error = document.querySelector('.error-msg')

    const tabId = document.querySelector('#tab-id');
    const tabPw = document.querySelector('#tab-pw');

    const formId = document.querySelector('#form-id');
    const formPw = document.querySelector('#form-pw');
    const userservice = document.querySelector('#user-service')

    btnId.addEventListener('click', function () {

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

    btnPw.addEventListener('click', function () {
        const email = document.querySelector('#email');
        const emailValue = email.value.trim();
        const errorPw = formPw.querySelector('.error-msg');

        if (emailValue === "") {
            errorPw.textContent = "이메일을 입력해주세요.";
            errorPw.classList.remove("hide");
        }
        else if (emailValue.indexOf("@") === -1 || emailValue.indexOf(".") === -1
            || emailValue.length <= 6) {
            errorPw.textContent = "이메일 형식이 올바르지 않습니다.";
            errorPw.classList.remove("hide");
        }
        else {
            alert("비밀번호 찾기 요청이 완료되었습니다.");
        }
    })

    tabId.addEventListener("click", function () {

        tabId.classList.add("active");
        tabPw.classList.remove("active");

        formId.classList.remove("hide");
        formPw.classList.add("hide");
    });


    tabPw.addEventListener("click", function () {

        tabPw.classList.add("active");
        tabId.classList.remove("active");

        formPw.classList.remove("hide");
        formId.classList.add("hide");
    });



    userservice.addEventListener('click', function () {
        // window.location.href = "" // 고객센터로 이동될 주소 넣기
    })


};