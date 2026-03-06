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
            status[i].style.color = "green"

        });

        refuse[i].addEventListener('click', function () {
            status[i].textContent = "거절";
            status[i].style.color = "red";
        });

        pending[i].addEventListener('click', function () {
            status[i].textContent = "보류";
            status[i].style.color = "grey";
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
            alert('해당 리뷰가 되었습니다.')
        })
    }





}
/* ================================================
   쿠폰/프로모션 로직 (makingCoupn.js 이식 - admin 전용 id 사용)
================================================ */
window.addEventListener('load', function adminCouponBind() {

    const dialog         = document.getElementById("adminDialog");
    const openBtn        = document.getElementById("adminOpenBtn");
    const closeBtn       = document.getElementById("adminCloseBtn");

    const dialog2        = document.getElementById("adminDialog2");
    const closeBtn2      = document.getElementById("adminCloseBtn2");

    const makecouponBtn  = document.getElementById("adminMakeCouponBtn");
    const couponList     = document.getElementById("adminCouponList");
    const couponName     = document.getElementById("adminCouponName");
    const couponDiscount = document.getElementById("adminCouponDiscount");
    const minDate        = document.getElementById("adminMinDate");
    const maxDate        = document.getElementById("adminMaxDate");

    let currentEditItem  = null;

    // 오늘 날짜 제한
    const today = new Date().toISOString().split('T')[0];
    minDate.min = today;
    maxDate.min = today;

    // 생성 모달 열기/닫기
    openBtn.addEventListener("click", () => { dialog.showModal(); });
    closeBtn.addEventListener("click", () => { dialog.close(); });

    // 수정 모달 닫기
    closeBtn2.addEventListener("click", () => { dialog2.close(); });

    // 시작일 선택 시 종료일 최소날짜 연동
    minDate.addEventListener("input", function () {
        maxDate.min = this.value;
    });

    // 쿠폰 생성
    makecouponBtn.addEventListener('click', function () {
        try {
            const name   = couponName.value;
            const dis    = couponDiscount.value;
            const expMin = minDate.value;
            const expMax = maxDate.value;

            if (!name || !dis || !expMin || !expMax) {
                alert("빈칸을 전부 채워주세요");
                return;
            }

            const article = document.createElement("article");
            article.className = "item item--warn";

            if (today <= expMax) {
                article.innerHTML = `
                    <div class="item__left">
                        <div class="item__title">쿠폰 이름: ${name}</div>
                        <div class="discount red">할인율: ${dis}</div>
                        <div class="item__meta muted">유효기간: ${expMin} ~ ${expMax}</div>
                    </div>
                    <div class="item__right">
                        <button class="mini mini--ok adminCBtn" type="button">쿠폰 삭제</button>
                        <button class="mini adminCBtn2" type="button">쿠폰 수정</button>
                    </div>`;
            } else {
                article.innerHTML = `
                    <div class="item__left">
                        <div class="item__title">쿠폰 이름: ${name}</div>
                        <div class="discount red">할인율: ${dis}</div>
                        <div class="item__meta muted line-through">유효기간만료: ${expMin} ~ ${expMax}</div>
                    </div>
                    <div class="item__right">
                        <button class="mini mini--ok adminCBtn" type="button">쿠폰 삭제</button>
                        <button class="mini adminCBtn2" type="button">쿠폰 수정</button>
                    </div>`;
            }

            couponList.prepend(article);
            dialog.close();

            // 입력값 초기화
            couponName.value = '';
            minDate.value    = '';
            maxDate.value    = '';

        } catch (error) {
            console.log("쿠폰 생성 중 오류 발생", error);
        }
    });

    // 쿠폰 목록 이벤트 위임 (삭제 / 수정)
    couponList.addEventListener("click", function (e) {

        // 삭제
        if (e.target.classList.contains('adminCBtn')) {
            e.target.closest('.item').remove();

        // 수정 모달 열기
        } else if (e.target.classList.contains('adminCBtn2')) {
            currentEditItem = e.target.closest('.item');

            const oldName     = currentEditItem.querySelector('.item__title').innerText.replace('쿠폰 이름: ', '');
            const oldDiscount = currentEditItem.querySelector('.discount').innerText.replace('할인율: ', '');

            document.getElementById("adminCouponName2").value     = oldName;
            document.getElementById("adminCouponDiscount2").value = oldDiscount;

            const adminMinDate2 = document.getElementById("adminMinDate2");
            const adminMaxDate2 = document.getElementById("adminMaxDate2");
            adminMinDate2.min   = today;
            adminMaxDate2.min   = today;

            dialog2.showModal();
        }
    });

    // 쿠폰 수정 저장
    document.getElementById("adminMakeCouponBtn2").addEventListener('click', function () {
        try {
            if (!currentEditItem) return;

            const newName     = document.getElementById("adminCouponName2").value;
            const newDiscount = document.getElementById("adminCouponDiscount2").value;
            const newMin      = document.getElementById("adminMinDate2").value;
            const newMax      = document.getElementById("adminMaxDate2").value;

            if (!newName || !newMin || !newMax) {
                alert("수정할 내용을 모두 입력해주세요.");
                return;
            }

            currentEditItem.querySelector('.item__title').innerText = `쿠폰 이름: ${newName}`;
            currentEditItem.querySelector('.discount').innerText    = `할인율: ${newDiscount}`;

            const metaArea = currentEditItem.querySelector('.item__meta');
            if (today > newMax) {
                metaArea.className = "item__meta muted line-through";
                metaArea.innerText = `유효기간만료: ${newMin} ~ ${newMax}`;
            } else {
                metaArea.className = "item__meta muted";
                metaArea.innerText = `유효기간: ${newMin} ~ ${newMax}`;
            }

            dialog2.close();
            currentEditItem = null;

        } catch (error) {
            console.log("쿠폰 수정 중 오류 발생", error);
        }
    });

});
