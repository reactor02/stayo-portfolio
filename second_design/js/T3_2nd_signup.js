window.onload = function () {
    const joinBtn = document.querySelector('#joinBtn');

    const name = document.querySelector('#name');
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');
    const passwordcheck = document.querySelector('#passwordcheck');
    const phone = document.querySelector('#phone');
    const birthYear = document.querySelector('#birthYear');
    const birthMonth = document.querySelector('#birthMonth');
    const birthDay = document.querySelector('#birthDay');

    const nameError = document.querySelector('#nameError');
    const emailError = document.querySelector('#emailError');
    const passwordError = document.querySelector('#passwordError');
    const passwordCheckError = document.querySelector('#passwordCheckError');
    const phoneError = document.querySelector('#phoneError');
    const birthError = document.querySelector('#birthError');
    const agreeError = document.querySelector('#agreeError');

    const agreeAll = document.querySelector('#agreeAll');
    const agreeItems = document.querySelectorAll('.agreeItem');
    const agree1 = document.querySelector('#agree1');
    const agree2 = document.querySelector('#agree2');
    const agree3 = document.querySelector('#agree3');


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
            if (!agree1.checked || !agree2.checked || !agree3.checked) {
                allChecked = false;
            }

            agreeAll.checked = allChecked;
        });
    }

    // 가입 버튼 클릭
    joinBtn.addEventListener('click', function (e) {
        e.preventDefault();

        // 초기화
        nameError.textContent = "";
        emailError.textContent = "";
        passwordError.textContent = "";
        passwordCheckError.textContent = "";
        phoneError.textContent = "";
        birthError.textContent = "";
        agreeError.textContent = "";

        let isValid = true;

        // 이름
        if (name.value.trim() === '') {
            nameError.textContent = "이름을 입력해주세요.";
            isValid = false;
        }

        // 이메일
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일을 검사하는 정규식 
        if (!emailRegex.test(email.value.trim())) {
            emailError.textContent = "올바른 이메일 형식이 아닙니다.";
            isValid = false;
        }

        // 비밀번호
        if (password.value.trim().length < 8) {
            passwordError.textContent = "비밀번호는 8자 이상이어야 합니다.";
            isValid = false;
        }

        // 비밀번호 확인
        if (password.value.trim() !== passwordcheck.value.trim()) {
            passwordCheckError.textContent = "비밀번호가 일치하지 않습니다.";
            isValid = false;
        }

        // 휴대폰
        const phoneRegex = /^\d{10,11}$/; // 10~11자리 숫자만 입력하게
        if (!phoneRegex.test(phone.value.trim())) {
            phoneError.textContent = "전화번호는 - 없이 숫자만 10~11자리로 입력하세요.";
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
    });

    naverBtn.addEventListener("click", function () {
        alert("네이버 로그인 기능은 추후 구현 예정입니다.");
    });
}