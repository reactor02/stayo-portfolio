window.onload = function () {

    // 각각의 DOM들 가져오기 
    const joinBtn = document.querySelector('#joinBtn');
    const name = document.querySelector('#name');
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');
    const passwordcheck = document.querySelector('#passwordcheck');
    const phone = document.querySelector('#phone');
    const birthYear = document.querySelector('#birthYear');
    const birthMonth = document.querySelector('#birthMonth');
    const birthDay = document.querySelector('#birthDay');

    //에러 메시지 칸들 
    const nameError = document.querySelector('#nameError');
    const emailError = document.querySelector('#emailError');
    const passwordError = document.querySelector('#passwordError');
    const passwordCheckError = document.querySelector('#passwordCheckError');
    const phoneError = document.querySelector('#phoneError');
    const birthError = document.querySelector('#birthError');
    const agreeError = document.querySelector('#agreeError');

    // 동의 창들 
    const agreeAll = document.querySelector('#agreeAll');
    const agreeItems = document.querySelectorAll('.agreeItem');
    const agree1 = document.querySelector('#agree1');
    const agree2 = document.querySelector('#agree2');
    const agree3 = document.querySelector('#agree3');
    const agree4 = document.querySelector('#agree4');


    const idPhone = document.querySelector("#phone");
    const idName = document.querySelector("#name");

    const regex = /[^0-9]/g;
    const regexName = /[^ㄱ-ㅎ가-힣-a-zA-Z]/g;

    // name을 가져와서 
    // 정규 표현식으로 ㄱ~ㅎ a~z ,A-Z 가 오면 공백으로 만드는 코드 
    // console.log(idPhone)
    idName.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(regexName, "");
    })

    // phone을 가져와서 숫자가 아니면 공백으로 만드는 코드
    idPhone.addEventListener("input", (e) => {

        e.target.value = e.target.value.replace(regex, "");
    })


    // 전체 동의 체크
    agreeAll.addEventListener('change', function () {
        for (let i = 0; i < agreeItems.length; i++) {
            agreeItems[i].checked = agreeAll.checked;
        }
    });

    // 개별 체크박스 변경 시 전체 체크 상태 반영
    for (let i = 0; i < agreeItems.length; i++) {
        agreeItems[i].addEventListener('change', function () {
            let allChecked = true;

            // 필수 3개 체크박스만 확인
            if (!agree1.checked || !agree2.checked || !agree3.checked || !agree4.checked) {
                allChecked = false;
            }

            agreeAll.checked = allChecked;
        });
    }

    // 비밀번호 입력하세요 옆에 버튼 클릭하면 입력한 것 볼 수 있게 
    const pwbtn = document.querySelector("#pw-btn");
    const pwbtn1 = document.querySelector("#pw-btn1");

    pwbtn.addEventListener("click", function () {

        if (password.type === "password") {
            password.type = "text";
        } else {
            password.type = "password";
        }

    });
    //  여기는 비밀번호 확인일때도 같이 동작하도록
    pwbtn1.addEventListener("click", function () {

        if (passwordcheck.type === "password") {
            passwordcheck.type = "text";
        } else {
            passwordcheck.type = "password";
        }

    });

    //  이름 실시간 검사 
    name.addEventListener("input", function () {

        const nameRegex = /^[가-힣a-zA-Z]+$/;

        if (name.value.trim() === '') {
            nameError.textContent = "이름을 입력해주세요.";
        }
        else if (!nameRegex.test(name.value.trim())) {
            nameError.textContent = "이름은 한글 또는 영어만 입력 가능합니다.";
        }
        else {
            nameError.textContent = "";
        }

    });


    //  이메일 실시간 검사 
    email.addEventListener("input", function () {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email.value.trim() === "") {
            emailError.textContent = "이메일을 입력해주세요.";
        }
        else if (!emailRegex.test(email.value.trim())) {
            emailError.textContent = "올바른 이메일 형식이 아닙니다.";
        }
        else {
            emailError.textContent = "";
        }

    });


    // 비밀번호 실시간 검사 
    password.addEventListener("input", function () {

        if (password.value.trim().length < 8) {
            passwordError.textContent = "비밀번호는 8자 이상이어야 합니다.";
        }
        else {
            passwordError.textContent = "";
        }

    });


    //  비밀번호 확인 실시간 검사 
    passwordcheck.addEventListener("input", function () {

        if (passwordcheck.value.trim() === "") {
            passwordCheckError.textContent = "비밀번호 확인을 입력해주세요.";
        }
        else if (password.value.trim() !== passwordcheck.value.trim()) {
            passwordCheckError.textContent = "비밀번호가 일치하지 않습니다.";
        }
        else {
            passwordCheckError.textContent = "";
        }

    });


    //  휴대폰 실시간 검사 
    phone.addEventListener("input", function () {

        const phoneRegex = /^\d{10,11}$/;

        if (!phoneRegex.test(phone.value.trim())) {
            phoneError.textContent = "전화번호는 - 없이 숫자만 10~11자리로 입력하세요.";
        }
        else {
            phoneError.textContent = "";
        }

    });


    // 가입 버튼 클릭


    joinBtn.addEventListener('click', function (e) {

        e.preventDefault();



        birthError.textContent = "";
        agreeError.textContent = "";

        let isValid = true;

        if (name.value.trim() === '') {
            nameError.textContent = "이름을 입력해주세요.";
        }

        if (email.value.trim() === "") {
            emailError.textContent = "이메일을 입력해주세요.";
            isValid = false;
        }

        if (password.value.trim().length < 8) {
            passwordError.textContent = "비밀번호는 8자 이상이어야 합니다.";
            isValid = false;
        }
        
        if (passwordcheck.value.trim() === "") {
            passwordCheckError.textContent = "비밀번호 확인을 입력해주세요.";
        }

        if (password.value !== passwordcheck.value) {
            passwordCheckError.textContent = "비밀번호가 일치하지 않습니다.";
            isValid = false;
        }



        // 생년월일

        // 년/월/일의 값을 숫자로 변환함 
        const year = parseInt(birthYear.value);
        const month = parseInt(birthMonth.value);
        const day = parseInt(birthDay.value);

        // 하나라도 비어있다면 
        if (!year || !month || !day) {
            birthError.textContent = "생년월일을 모두 입력해주세요.";
            isValid = false;

            // 입력한 날짜로 date 객체 생성
            // 자바스크립트는 월은 0부터 시작해서 month -1 해야함 
        } else {
            const inputDate = new Date(year, month - 1, day);
            const today = new Date(); // 오늘 날짜 객체 생성

            // 존재하지 않는 날짜 검사
            if (
                inputDate.getFullYear() !== year ||
                inputDate.getMonth() !== month - 1 ||
                inputDate.getDate() !== day
            ) {
                birthError.textContent = "존재하지 않는 날짜입니다.";
                isValid = false;
            }
            // 미래 날짜 검사
            // 입력날짜가 오늘부터 크면 미래 
            else if (inputDate > today) {
                birthError.textContent = "미래 날짜는 선택할 수 없습니다.";
                isValid = false;
            }
            else {
                let age = today.getFullYear() - year; // 현재날짜 -입력날짜 
                if (age < 15) {
                    birthError.textContent = "15세 이상만 가입 가능합니다.";
                    isValid = false;
                }
            }
        }

        // 필수 약관
        if (!agree1.checked || !agree2.checked || !agree3.checked) {
            agreeError.textContent = "필수 약관에 모두 동의해주세요.";
            isValid = false;
        }

        if (isValid) {
            API.V1.TB.Auth.signup({
                loginId: email.value.trim(),       // ← 입력한 이메일 사용
                password: password.value.trim(),   // ← 입력한 비밀번호 사용
                displayName: name.value.trim(),    // ← 입력한 이름 사용
                email: email.value.trim()
            })
                .done(function (res) {
                    console.log("회원가입 성공", res);
                    alert("회원가입 완료!");
                    window.location.href = "T3_2nd_login.html"
                })
                .fail(function (err) {
                    console.log("회원가입 실패", err);
                    alert("회원가입 실패");
                });
        }


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
}