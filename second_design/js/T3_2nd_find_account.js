window.onload = function () {
    // DOM 전부 위로 정리
    //  탭 & 레이아웃
    const tabId = document.getElementById("tab-id");
    const tabPw = document.getElementById("tab-pw");
    const formId = document.getElementById("form-id");
    const formPw = document.getElementById("form-pw");
    const pageTitle = document.getElementById("page-title");
    const pageDesc = document.getElementById("page-desc");
    const hintBox = document.getElementById("hint-box");
    const idSection = document.getElementById("id-section");
    const pwSection = document.getElementById("pw-section");

    // 아이디 찾기 input
    const idName = document.getElementById("id-name");
    const idPhone = document.getElementById("id-phone");
    const idVerifyInput = document.getElementById("id-verify");

    //  아이디 찾기 에러
    // const idError = formId.querySelector(".error-msg");
    const idNameError = idName.parentElement.querySelector(".error-msg");
    const idPhoneError = idPhone.parentElement.querySelector(".error-msg");

    const idVerifyError = document.getElementById("id-verify-error");

    //  아이디 버튼
    const idBtn = formId.querySelector(".find-btn");

    //  비밀번호 찾기 input
    const pwEmail = document.getElementById("pw-email");
    const pwName = document.getElementById("pw-name");
    const pwPhone = document.getElementById("pw-phone");
    const password = document.getElementById("password");
    const passwordcheck = document.getElementById("passwordcheck");
    const pwVerifyInput = document.getElementById("pw-verify");

    //  비밀번호 에러
    const emailError = document.getElementById("email-error");
    const nameError = document.getElementById("name-error");
    const phoneError = document.getElementById("phone-error");
    const passwordError = document.getElementById("password-error");
    const passwordcheckError = document.getElementById("passwordcheck-error");
    const pwVerifyError = document.getElementById("pw-verify-error");

    //  버튼
    const pwBtn = document.getElementById("pw-btn");

    // 아이디찾기/ 비밀번호찾기인증  요청 버튼들
    const idverifyBtn = document.querySelector("#id-verify-btn");
    const pwverifyBtn = document.querySelector("#pw-verify-btn");

    // 정규 표현식
    const verifyRegex = /^\d{6}$/; // 인증번호 6자리 숫자 검사식 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 검사식
    const nameRegex = /^[가-힣A-Za-z]+$/; // 한글과 영어만 입력 가능한 정규식 

    // 아이디 찾기
    idBtn.addEventListener("click", function (e) {

        e.preventDefault();

        let isValid = true;

        const nameValue = idName.value.trim();
        const phoneValue = idPhone.value.trim();
        const verifyValue = idVerifyInput.value.trim();

        idNameError.classList.add("hide");
        idPhoneError.classList.add("hide");
        idVerifyError.classList.add("hide");

        if (nameValue === "" && phoneValue === "") {
            idNameError.textContent = "이름과 휴대폰 번호를 입력해주세요.";
            idNameError.classList.remove("hide");
            isValid = false;

        } else if (nameValue === "") {
            idNameError.textContent = "이름을 입력해주세요.";
            idNameError.classList.remove("hide");
            isValid = false;

        } else if (!nameRegex.test(nameValue)) {
            idNameError.textContent = "이름은 한글과 영어만 입력 가능합니다.";
            idNameError.classList.remove("hide");
            isValid = false;
        }
        else if (phoneValue === "") {
            idPhoneError.textContent = "휴대폰 번호를 입력해주세요.";
            idPhoneError.classList.remove("hide");
            isValid = false;

        } else if (isNaN(phoneValue)) { // 숫자가 아니라면 
            idPhoneError.textContent = "휴대폰 번호는 숫자만 입력해주세요.";
            idPhoneError.classList.remove("hide");
            isValid = false;

        } else if (phoneValue.length < 10 || phoneValue.length > 11) {
            idPhoneError.textContent = "휴대폰 번호는 10~11자리로 입력해주세요.";
            idPhoneError.classList.remove("hide");
            isValid = false;
        }

        if (verifyValue === "") {
            idVerifyError.textContent = "인증번호를 입력해주세요.";
            idVerifyError.classList.remove("hide");
            isValid = false;

        } else if (!verifyRegex.test(verifyValue)) {
            idVerifyError.textContent = "인증번호가 6자리가 아닙니다.";
            idVerifyError.classList.remove("hide");
            isValid = false;
        }

        if (isValid) {
            alert("아이디 찾기 요청이 완료되었습니다.");
            window.document.location.href = "T3_2nd_login.html"
        }
    });

    //  비밀번호 찾기
    pwBtn.addEventListener("click", function (e) {

        e.preventDefault();

        let isValid = true;

        const emailValue = pwEmail.value.trim();
        const nameValue = pwName.value.trim();
        const phoneValue = pwPhone.value.trim();
        const passwordValue = password.value.trim();
        const passwordcheckValue = passwordcheck.value.trim();
        const verifyValue = pwVerifyInput.value.trim();

        emailError.classList.add("hide");
        nameError.classList.add("hide");
        phoneError.classList.add("hide");
        passwordError.classList.add("hide");
        passwordcheckError.classList.add("hide");
        pwVerifyError.classList.add("hide");

        if (!emailRegex.test(emailValue)) {
            emailError.textContent = "올바른 이메일 형식이 아닙니다.";
            emailError.classList.remove("hide");
            isValid = false;
        }

        if (nameValue === "") {
            nameError.textContent = "이름을 입력해주세요.";
            nameError.classList.remove("hide");
            isValid = false;
        }

        else if (!nameRegex.test(nameValue)) {
            nameError.textContent = "이름은 한글과 영어만 입력 가능합니다.";
            nameError.classList.remove("hide");
            isValid = false;
        }


        if (phoneValue === "") {
            phoneError.textContent = "휴대폰 번호를 입력해주세요.";
            phoneError.classList.remove("hide");
            isValid = false;

        } else if (isNaN(phoneValue)) {
            phoneError.textContent = "휴대폰 번호는 숫자만 입력해주세요.";
            phoneError.classList.remove("hide");
            isValid = false;

        } else if (phoneValue.length < 10 || phoneValue.length > 11) {
            phoneError.textContent = "휴대폰 번호는 10~11자리로 입력해주세요.";
            phoneError.classList.remove("hide");
            isValid = false;
        }

        if (passwordValue === "") {
            passwordError.textContent = "새 비밀번호를 입력해주세요.";
            passwordError.classList.remove("hide");
            isValid = false;

        } else if (passwordcheckValue === "") {
            passwordcheckError.textContent = "새 비밀번호 확인을 입력해주세요.";
            passwordcheckError.classList.remove("hide");
            isValid = false;

        } else if (passwordValue.length < 8) {
            passwordcheckError.textContent = "비밀번호는 8글자 이상이여야 합니다.";
            passwordcheckError.classList.remove("hide");
            isValid = false;
        }

        else if (passwordValue !== passwordcheckValue) {
            passwordcheckError.textContent = "비밀번호가 일치하지 않습니다.";
            passwordcheckError.classList.remove("hide");
            isValid = false;
        }

        if (verifyValue === "") {
            pwVerifyError.textContent = "인증번호를 입력해주세요.";
            pwVerifyError.classList.remove("hide");
            isValid = false;

        } else if (!verifyRegex.test(verifyValue)) {
            pwVerifyError.textContent = "인증번호가 6자리가 아닙니다.";
            pwVerifyError.classList.remove("hide");
            isValid = false;
        }

        if (isValid) {
            alert("비밀번호 재설정이 완료되었습니다.");
            window.document.location.href = "T3_2nd_login.html"
        }
    });

    // 탭 전환
    tabId.addEventListener("click", function () {

        tabId.classList.add("find-tab--active");
        tabPw.classList.remove("find-tab--active");

        formId.classList.remove("hide");
        formPw.classList.add("hide");
        hintBox.classList.remove("hide");

        idSection.style.display = "block";
        pwSection.style.display = "none";

        pageTitle.textContent = "아이디 찾기";
        pageDesc.textContent =
            "가입 시 입력한 정보로 아이디(이메일)를 확인할 수 있어요.";
    });
    tabPw.addEventListener("click", function () {

        tabPw.classList.add("find-tab--active");
        tabId.classList.remove("find-tab--active");

        formPw.classList.remove("hide");
        formId.classList.add("hide");
        hintBox.classList.add("hide");

        idSection.style.display = "none";
        pwSection.style.display = "block";

        pageTitle.textContent = "비밀번호 찾기";
        pageDesc.textContent =
            "가입한 이메일을 입력하면 비밀번호 재설정을 진행할 수 있어요.";
    });
    // 5.인증 요청 버튼

    idverifyBtn.addEventListener("click", function () {

        const nameValue = idName.value.trim();
        const phoneValue = idPhone.value.trim();

        idNameError.classList.add("hide");
        idPhoneError.classList.add("hide");

        if (nameValue === "" && phoneValue === "") {
            idNameError.textContent = "이름과 휴대폰 번호를 입력해주세요.";
            idNameError.classList.remove("hide");

        } else if (nameValue === "") {
            idNameError.textContent = "이름을 입력해주세요.";
            idNameError.classList.remove("hide");

        } else if (phoneValue === "") {
            idPhoneError.textContent = "휴대폰 번호를 입력해주세요.";
            idPhoneError.classList.remove("hide");

        } else if (isNaN(phoneValue)) {
            idPhoneError.textContent = "휴대폰 번호는 숫자만 입력해주세요.";
            idPhoneError.classList.remove("hide");

        } else if (phoneValue.length < 10 || phoneValue.length > 11) {
            idPhoneError.textContent = "휴대폰 번호는 10~11자리로 입력해주세요.";
            idPhoneError.classList.remove("hide");

        } else {
            alert("인증번호가 발송되었습니다.");
        }

    });


    pwverifyBtn.addEventListener("click", function () {

        const emailValue = pwEmail.value.trim();
        const nameValue = pwName.value.trim();
        const phoneValue = pwPhone.value.trim();

        emailError.classList.add("hide");
        nameError.classList.add("hide");
        phoneError.classList.add("hide");

        if (emailValue === "" && nameValue === "" && phoneValue === "") {
            phoneError.textContent = "이메일, 이름, 휴대폰 번호를 입력해주세요.";
            phoneError.classList.remove("hide");

        } else if (emailValue === "") {
            emailError.textContent = "이메일을 입력해주세요.";
            emailError.classList.remove("hide");

        } else if (nameValue === "") {
            nameError.textContent = "이름을 입력해주세요.";
            nameError.classList.remove("hide");

        } else if (phoneValue === "") {
            phoneError.textContent = "휴대폰 번호를 입력해주세요.";
            phoneError.classList.remove("hide");

        } else if (isNaN(phoneValue)) {
            phoneError.textContent = "휴대폰 번호는 숫자만 입력해주세요.";
            phoneError.classList.remove("hide");

        } else if (phoneValue.length < 10 || phoneValue.length > 11) {
            phoneError.textContent = "휴대폰 번호는 10~11자리로 입력해주세요.";
            phoneError.classList.remove("hide");

        } else {
            alert("인증번호가 발송되었습니다.");
        }

    });

    /* 위에 코드를 그대로 유지한채로 input 전체에 이벤트를 걸고
   실시간 input 검사해서 에러 메시지 띄우기 
     */

    const inputs = document.querySelectorAll("input");

    inputs.forEach(function (input) {

        input.addEventListener("input", function () {

            const id = input.id;
            const value = input.value.trim();

            /* 아이디 찾기 */

            if (id === "id-name") {

                idNameError.classList.add("hide");

                if (value === "") {
                    idNameError.textContent = "이름을 입력해주세요.";
                    idNameError.classList.remove("hide");

                } else if (!nameRegex.test(value)) {
                    idNameError.textContent = "이름은 한글과 영어만 입력 가능합니다.";
                    idNameError.classList.remove("hide");
                }
            }

            if (id === "id-phone") {

                idPhoneError.classList.add("hide");;

                if (value === "") {
                    idPhoneError.textContent = "휴대폰 번호를 입력해주세요.";
                    idPhoneError.classList.remove("hide");

                } else if (isNaN(value)) {
                    idPhoneError.textContent = "휴대폰 번호는 숫자만 입력해주세요.";
                    idPhoneError.classList.remove("hide");

                } else if (value.length < 10 || value.length > 11) {
                    idPhoneError.textContent = "휴대폰 번호는 10~11자리로 입력해주세요.";
                    idPhoneError.classList.remove("hide");
                }
            }

            if (id === "id-verify") {

                idVerifyError.classList.add("hide");

                if (value === "") {
                    idVerifyError.textContent = "인증번호를 입력해주세요.";
                    idVerifyError.classList.remove("hide");

                } else if (!verifyRegex.test(value)) {
                    idVerifyError.textContent = "인증번호가 6자리가 아닙니다.";
                    idVerifyError.classList.remove("hide");
                }
            }


            /* 비밀번호 찾기 */

            if (id === "pw-email") {

                emailError.classList.add("hide");

                if (!emailRegex.test(value)) {
                    emailError.textContent = "올바른 이메일 형식이 아닙니다.";
                    emailError.classList.remove("hide");
                }
            }

            if (id === "pw-name") {

                nameError.classList.add("hide");

                if (value === "") {
                    nameError.textContent = "이름을 입력해주세요.";
                    nameError.classList.remove("hide");

                } else if (!nameRegex.test(value)) {
                    nameError.textContent = "이름은 한글과 영어만 입력 가능합니다.";
                    nameError.classList.remove("hide");
                }
            }

            if (id === "pw-phone") {

                phoneError.classList.add("hide");

                if (value === "") {
                    phoneError.textContent = "휴대폰 번호를 입력해주세요.";
                    phoneError.classList.remove("hide");

                } else if (isNaN(value)) {
                    phoneError.textContent = "휴대폰 번호는 숫자만 입력해주세요.";
                    phoneError.classList.remove("hide");

                } else if (value.length < 10 || value.length > 11) {
                    phoneError.textContent = "휴대폰 번호는 10~11자리로 입력해주세요.";
                    phoneError.classList.remove("hide");
                }
            }

            if (id === "password") {

                passwordError.classList.add("hide");

                if (value === "") {
                    passwordError.textContent = "새 비밀번호를 입력해주세요.";
                    passwordError.classList.remove("hide");
                }
            }

            if (id === "passwordcheck") {

                passwordcheckError.classList.add("hide");

                if (password.value !== passwordcheck.value) {
                    passwordcheckError.textContent = "비밀번호가 일치하지 않습니다.";
                    passwordcheckError.classList.remove("hide");
                }
            }

            if (id === "pw-verify") {

                pwVerifyError.classList.add("hide");

                if (value === "") {
                    pwVerifyError.textContent = "인증번호를 입력해주세요.";
                    pwVerifyError.classList.remove("hide");

                } else if (!verifyRegex.test(value)) {
                    pwVerifyError.textContent = "인증번호가 6자리가 아닙니다.";
                    pwVerifyError.classList.remove("hide");
                }
            }

        });

    });


};







