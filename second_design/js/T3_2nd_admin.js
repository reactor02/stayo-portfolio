window.onload = function () {

    const status = document.querySelectorAll('.status'); // 상태 표시칸
    const approve = document.querySelectorAll('.approve'); // 승인 버튼
    const refuse = document.querySelectorAll('.refuse'); // 거절 버튼
    const pending = document.querySelectorAll('.pending'); // 보류 버튼

    const status1 = document.querySelectorAll('.status1'); // 상태 표시칸
    const energize = document.querySelectorAll('.energize'); // 활성화 버튼
    const stop = document.querySelectorAll('.stop'); // 정지 버튼



    // const excel = document.querySelector('#excel')
    // const excel2 = document.querySelector('#excel2')
    // excel.addEventListener('click', function () {
    //     alert('엑셀 다운로드 되었습니다')
    // })

    // excel2.addEventListener('click', function () {
    //     alert('엑셀 다운로드 되었습니다')
    // })

    const excel = document.querySelectorAll('.excel')  // 최근 예약의 엑셀 다운버튼 / 회원관리의 엑셀 다운버튼

    for (let i = 0; i < excel.length; i++) {
        excel[i].addEventListener('click', function () {
            alert('엑셀 다운로드 되었습니다')
        })
    }


    for (let i = 0; i < approve.length; i++) {

        approve[i].addEventListener('click', function () {
            status[i].textContent = "승인";
        });

        refuse[i].addEventListener('click', function () {
            status[i].textContent = "거절";
        });

        pending[i].addEventListener('click', function () {
            status[i].textContent = "보류";
        });

    }

    for (let i = 0; i < energize.length; i++) {

        energize[i].addEventListener('click', function () {
            status1[i].textContent = "정상";
            status1[i].style.color = "green";
        });

        stop[i].addEventListener('click', function () {
            status1[i].textContent = "정지";
            status1[i].style.color = "red";
        });

    }

    const rows = document.querySelectorAll("#table tbody tr");
    const showall = document.querySelector("#showall");

    let opened = false; // 현재 상태 (false = 2개만 보이는 상태)

    // 처음에 2개만 보이게
    for (let i = 2; i < rows.length; i++) {
        rows[i].style.display = "none";
    }

    // 전체보기 클릭
    showall.addEventListener("click", function () {

        if (opened == false) {
            // 전체보기
            for (let i = 0; i < rows.length; i++) {
                rows[i].style.display = "table-row"; // <tr> 처럼 
            }
            showall.textContent = "접기";
            opened = true

        } else {
            // 다시 2개만 보이게
            for (let i = 2; i < rows.length; i++) {
                rows[i].style.display = "none";
            }
            showall.textContent = "전체보기";
            opened = false;
        }

    });

    const item = document.querySelectorAll('.item--warn')
    const showall2 = document.querySelector('#showall2')

    let opened2 = false;
    // 처음 2개만 보이게 
    for (let i = 2; i < item.length; i++) {
        item[i].style.display = "none";
    }

    showall2.addEventListener("click", function () {
        if (opened2 == false) {
            // 전체보기
            for (let i = 0; i < item.length; i++) {
                item[i].style.display = "flex"; // 
            }
            showall2.textContent = "접기";
            opened2 = true

        } else {
            // 다시 2개만 보이게
            for (let i = 2; i < item.length; i++) {
                item[i].style.display = "none";
            }
            showall2.textContent = "전체보기";
            opened2 = false;
        }

    });





    const hide = document.querySelectorAll('.hide')  // 리뷰 신고 관리의 숨김버튼
    const keep = document.querySelectorAll('.keep')  // 리뷰 신고 관리의 유지버튼

    for (let i = 0; i < hide.length; i++) {
        hide[i].addEventListener('click', function () {
            alert('해당 리뷰가 숨김처리 되었습니다.')
            item[i].style.display ='none'

        })
    }

        
    for (let i = 0; i < keep.length; i++) {
        keep[i].addEventListener('click', function () {
            alert('해당 리뷰 유지 되었습니다.')
        })
    }





}