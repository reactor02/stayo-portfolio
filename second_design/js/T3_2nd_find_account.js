window.onload = function () {

    const tabId = document.getElementById("tab-id"); // 아이디 찾기 탭 버튼
    const tabPw = document.getElementById("tab-pw"); // 비밀번호 찾기 탭버튼

    const formId = document.getElementById("form-id"); // 아이디 찾기 form
    const formPw = document.getElementById("form-pw"); // 비밀번호 찾기 form
    const pageTitle = document.querySelector('#page-title') // 상단 제목 
    const pageDesc = document.querySelector('#page-desc')   // 상단 설명 문구
    const hintBox = document.getElementById("hint-box");    // 아이디 찾기 안내 박스 

    // 아이디 찾기 요소들 
    const idName = document.getElementById("id-name");  // 이름 input
    const idPhone = document.getElementById("id-phone"); // 휴대폰 번호 input
    const idForm = document.getElementById("form-id");  // 아이디 form
    const idBtn = idForm.querySelector(".find-btn");    // 아이디 찾기 버튼 
    const idError = idForm.querySelector(".error-msg"); // 아이디 에러 메시지 영역 

    // 비밀번호 찾기 요소
    const pwEmail = document.getElementById("pw-email");    // 이메일 input
    // const pwForm = document.getElementById("form-pw");      // 비밀번호 form
    const pwBtn = document.getElementById("pw-btn");        // 비밀번호 재설정 버튼
    

    // pwForm 즉 id="form-pw" 아래에 있는 class= error-msg

    const pwSection = document.getElementById("pw-section"); // 비밀번호 영역 전체
    const idSection = document.getElementById("id-section"); // 아이디 영역 전체 
    const password = document.querySelector("#password")
    const passwordcheck = document.querySelector("#passwordcheck")
    const pwName = document.querySelector('#pw-name')
    const pwPhone = document.querySelector('#pw-phone')








    // =========================
    // 아이디 찾기 클릭 이벤트 
    // =========================
    idBtn.addEventListener("click", function (e) {

        e.preventDefault(); // form 기본 제출 막음 

        // 입력값 가져오기 + 앞뒤 공백 제거 
        const nameValue = idName.value.trim();
        const phoneValue = idPhone.value.trim();
        // const cleanPhone = phoneValue.replaceAll("-", ""); //

        // 에러메시지 먼저 숨김 
        idError.classList.add("hide");

        if (nameValue === "" && phoneValue === "") {
            idError.textContent = "이름과 휴대폰 번호를 입력해주세요.";
            idError.classList.remove("hide");

        } else if (nameValue === "") {
            idError.textContent = "이름을 입력해주세요.";
            idError.classList.remove("hide");

        } else if (phoneValue === "") {
            idError.textContent = "휴대폰 번호를 입력해주세요.";
            idError.classList.remove("hide");

            // 전화번호가 숫자가 아닐 때 
        } else if (isNaN(phoneValue)) {
            idError.textContent = "휴대폰 번호는 숫자만 입력해주세요.";
            idError.classList.remove("hide");

        } else if (phoneValue.length < 10 || phoneValue.length > 11) {
            idError.textContent = "휴대폰 번호는 10~11자리로 입력해주세요.";
            idError.classList.remove("hide");

            // 모든 조건 통과 
        } else {
            alert("아이디 찾기 요청이 완료되었습니다.");
        }
    });

    // =========================
    // 비밀번호 찾기
    // =========================
    pwBtn.addEventListener("click", function (e) {

        e.preventDefault(); // 기본 제출 막음 
        pwSection.style.display = "block"; // 혹시 모르니 보여주기 없어도 될듯 

        const emailValue = pwEmail.value.trim(); // 이메일 값 가져오기 
        const passwordValue = password.value.trim();
        const passwordcheckValue = passwordcheck.value.trim();
        const nameValue = pwName.value.trim();
        const phoneValue = pwPhone.value.trim();

        const emailError = document.querySelector("#email-error");
        const nameError = document.querySelector("#name-error");
        const phoneError = document.querySelector("#phone-error");
        const passwordError = document.querySelector('#password-error')
        const passwordcheckError = document.querySelector('#passwordcheck-error')


        // 모든 에러 초기화 
        emailError.classList.add("hide");
        nameError.classList.add("hide");
        phoneError.classList.add("hide");
        passwordError.classList.add("hide");
        passwordcheckError.classList.add("hide");

        let isValid = true;
        
        if (emailValue === "") {
            emailError.textContent = "이메일을 입력해주세요.";
            emailError.classList.remove("hide");
            isValid = false;

        } else if (
            emailValue.indexOf("@") === -1 ||
            emailValue.indexOf(".") === -1 ||
            emailValue.length <= 6

        ) {
            emailError.textContent = "이메일 형식이 올바르지 않습니다.";
            emailError.classList.remove("hide");
            isValid = false;

        }

        // 이름 검사
        if (nameValue === "") {
            nameError.textContent = "이름을 입력해주세요.";
            nameError.classList.remove("hide");
            isValid = false;
        }
        // 휴대폰 검사
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

        // 비밀번호 검사 

        if (passwordValue === "") {
            passwordError.textContent = "새 비밀번호를 입력해주세요.";
            passwordError.classList.remove("hide");
            isValid = false;

        } else if (passwordcheckValue === "") {
            passwordcheckError.textContent = "새 비밀번호 확인을 입력해주세요.";
            passwordcheckError.classList.remove("hide");
            isValid = false;

        } else if (passwordValue !== passwordcheckValue) {
            passwordcheckError.textContent = "비밀번호가 일치하지 않습니다.";
            passwordcheckError.classList.remove("hide");
            isValid = false;
        }

        // 모두 다 통과했다면 

        if (isValid) {
            alert("비밀번호 재설정이 완료되었습니다.");
        }
    });



    tabId.addEventListener("click", function () {

        tabId.classList.add("find-tab--active");
        tabPw.classList.remove("find-tab--active");

        formId.classList.remove("hide");
        formPw.classList.add("hide");
        hintBox.classList.remove("hide");

        idSection.style.display = "block";
        pwSection.style.display = "none"; // 이거 주석해도 상관없음 

        // 텍스트 변경
        pageTitle.textContent = "아이디 찾기";
        pageDesc.textContent =
            "가입 시 입력한 정보로 아이디(이메일)를 확인할 수 있어요.";
    });

    tabPw.addEventListener("click", function () {


        tabPw.classList.add("find-tab--active"); //
        tabId.classList.remove("find-tab--active");

        formPw.classList.remove("hide");
        formId.classList.add("hide");
        hintBox.classList.add("hide");

        idSection.style.display = "none"; // 이거 주석해도 가능
        pwSection.style.display = "block";

        pageTitle.textContent = "비밀번호 찾기";
        pageDesc.textContent =
            "가입한 이메일을 입력하면 비밀번호 재설정을 진행할 수 있어요.";
    });
    
    
    

}
