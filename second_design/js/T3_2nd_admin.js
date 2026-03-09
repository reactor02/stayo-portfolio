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



    // 승인대기 테이블 tbody 가져오기
    const waitingtable = document.querySelector("#waitingtable tbody");

    // 처리완료 테이블 tbody 가져오기
    const doneTable = document.querySelector("#donetable tbody");

    // 문서 전체에서 클릭 이벤트를 감지 (이벤트 위임 방식)
    waitingtable.addEventListener("click", function (e) {

        // 클릭된 요소가 승인 버튼이면
        if (e.target.classList.contains("approve")) {

            // 클릭된 버튼이 포함된 가장 가까운 tr 찾기 (행 전체)
            const row = e.target.closest("tr");

            // 상태 칸(.status)의 텍스트를 승인으로 변경
            row.querySelector(".status").textContent = "승인";

            // 해당 행을 처리완료 테이블로 이동
            doneTable.appendChild(row);

            // 관리 버튼을 수정요청 버튼으로 변경
            row.querySelector(".td-actions").innerHTML =
                '<button class="mini editRequest">수정요청</button>';
        }


        // 클릭된 요소가 거절 버튼이면
        if (e.target.classList.contains("refuse")) {

            // 클릭된 버튼이 속한 행 찾기
            const row = e.target.closest("tr");

            // 상태를 거절로 변경
            row.querySelector(".status").textContent = "거절";

            // 처리완료 테이블로 이동
            doneTable.appendChild(row);

            // 관리 버튼을 수정요청으로 변경
            row.querySelector(".td-actions").innerHTML =
                '<button class="mini editRequest">수정요청</button>';
        }


        // 클릭된 요소가 보류 버튼이면
        if (e.target.classList.contains("pending")) {

            // 클릭된 버튼이 속한 행 찾기
            const row = e.target.closest("tr");

            // 상태를 보류로 변경
            row.querySelector(".status").textContent = "보류";

            // 처리완료 테이블로 이동
            doneTable.appendChild(row);

            // 관리 버튼을 수정요청으로 변경
            row.querySelector(".td-actions").innerHTML =
                '<button class="mini editRequest">수정요청</button>';
        }

    })

    // 클릭된 요소가 수정요청 버튼이면
     doneTable.addEventListener("click", function(){
         if (e.target.classList.contains("editRequest")) {
     
             // 수정요청 버튼이 있는 행 찾기
             const row = e.target.closest("tr");
     
             // 상태를 다시 대기중으로 변경
             row.querySelector(".status").textContent = "대기중";
     
             // 행을 다시 승인대기 테이블로 이동
             waitingtable.appendChild(row);
     
             // 관리 버튼을 원래대로 복구 (승인 / 거절 / 보류)
             row.querySelector(".td-actions").innerHTML =
                 '<button class="mini approve">승인</button>' +
                 '<button class="mini refuse">거절</button>' +
                 '<button class="mini pending">보류</button>';
         }

     })







    // for (let i = 0; i < approve.length; i++) {

    //     approve[i].addEventListener('click', function () {
    //         status[i].textContent = "승인";

    //         const row = approve[i].parentNode.parentNode; // 

    //         doneTable.appendChild(row);
    //         // 관리버튼 변경
    //         row.querySelector(".td-actions").innerHTML =  // approve 의 부모의 부모인 tr로 가서 class가 td-actions인것 
    //             '<button class="mini editRequest">수정요청</button>';



    //     });

    //     refuse[i].addEventListener('click', function () {
    //         status[i].textContent = "거절";
    //         const row = refuse[i].parentNode.parentNode;

    //         doneTable.appendChild(row);
    //         row.querySelector(".td-actions").innerHTML =  // approve 의 부모의 부모인 tr로 가서 class가 td-actions인것 
    //             '<button class="mini editRequest">수정요청</button>';
    //     });

    //     pending[i].addEventListener('click', function () {
    //         status[i].textContent = "보류";
    //         const row = pending[i].parentNode.parentNode;

    //         doneTable.appendChild(row);
    //         row.querySelector(".td-actions").innerHTML =  // approve 의 부모의 부모인 tr로 가서 class가 td-actions인것 
    //             '<button class="mini editRequest">수정요청</button>';

    //     });

    // }
    // doneTable.addEventListener("click", function (e) {

    //     if (e.target.classList.contains("editRequest")) {

    //         const td = e.target.parentElement;
    //         const row = td.parentElement;

    //         waitingtable.appendChild(row);

    //         const statusCell = row.querySelector(".status");
    //         statusCell.textContent = "대기중";

    //         row.querySelector(".td-actions").innerHTML =
    //             '<button class="mini approve">승인</button>' +
    //             '<button class="mini refuse">거절</button>' +
    //             '<button class="mini pending">보류</button>';

    //     }

    // });




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

    const rows = document.querySelectorAll("#waitingtable tbody tr");
    const showwaiting = document.querySelector("#showwaiting");

    let opened = false; // 현재 상태 (false = 2개만 보이는 상태)

    // 처음에 2개만 보이게
    for (let i = 2; i < rows.length; i++) {
        rows[i].style.display = "none";
    }

    // 전체보기 클릭
    showwaiting.addEventListener("click", function () {

        if (opened == false) {
            // 전체보기
            for (let i = 0; i < rows.length; i++) {
                rows[i].style.display = "table-row"; // <tr> 처럼 
            }
            showwaiting.textContent = "접기";
            opened = true

        } else {
            // 다시 2개만 보이게
            for (let i = 2; i < rows.length; i++) {
                rows[i].style.display = "none";
            }
            showwaiting.textContent = "전체보기";
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
            item[i].style.display = 'none'

        })
    }


    for (let i = 0; i < keep.length; i++) {
        keep[i].addEventListener('click', function () {
            alert('해당 리뷰 유지 되었습니다.')
        })
    }





}
/* ================================================
   [최종 통합] 쿠폰 관리 시스템 (생성·수정·검색·가시성)
================================================ */
window.addEventListener('load', function () {
    // 1. 요소 선택
    const couponList = document.getElementById("adminCouponList");
    const showAllBtn = document.getElementById("adminShowAllCoupons");
    const statusMsg = document.getElementById("couponStatusMsg"); // "전체보기 상태가 아닙니다" 문구
    const searchBtn = document.getElementById("adminSearchBtn");
    const resetBtn = document.getElementById("resetFilter");

    const dialog = document.getElementById("adminDialog");  // 생성 모달
    const dialog2 = document.getElementById("adminDialog2"); // 수정 모달

    let isExpanded = false;     // 전체보기 활성화 여부
    let currentEditItem = null; // 현재 수정 중인 쿠폰 아이템

    // 2. 가시성 제어 함수 (2개 제한 및 안내 문구)
    function updateCouponVisibility() {
        const items = couponList.querySelectorAll('.coupon-item');

        items.forEach((item, index) => {
            if (isExpanded) {
                item.style.display = "flex";
            } else {
                // 전체보기가 아닐 때는 상위 2개만 표시
                item.style.display = index < 2 ? "flex" : "none";
            }
        });

        // 안내 문구 표시 로직: 접혀있고 쿠폰이 2개보다 많을 때만 노출
        if (!isExpanded && items.length > 2) {
            if (statusMsg) {
                statusMsg.style.display = "block";
                statusMsg.innerText = "전체보기 상태가 아닙니다";
            }
        } else {
            if (statusMsg) statusMsg.style.display = "none";
        }

        if (showAllBtn) showAllBtn.textContent = isExpanded ? "접기" : "전체보기";
    }

    // 3. 쿠폰 생성 (모달 유지 로직)
    const makeBtn = document.getElementById("adminMakeCouponBtn");
    if (makeBtn) {
        makeBtn.addEventListener('click', function () {
            const name = document.getElementById("adminCouponName").value.trim();
            const dis = document.getElementById("adminCouponDiscount").value;
            const min = document.getElementById("adminMinDate").value;
            const max = document.getElementById("adminMaxDate").value;

            if (!name || !min || !max) return alert("내용을 입력해주세요.");

            const article = document.createElement("article");
            article.className = "coupon-item item item--warn";

            // 검색 및 수정을 위한 데이터 저장
            article.dataset.name = name;
            article.dataset.discount = dis;
            article.dataset.min = min;
            article.dataset.max = max;

            article.innerHTML = `
                <div class="item__left">
                    <div class="item__title coupon-item__name">쿠폰 이름: ${name}</div>
                    <div class="discount red coupon-item__discount">할인율: ${dis}</div>
                    <div class="item__meta muted coupon-item__meta">유효기간: ${min} ~ ${max}</div>
                </div>
                <div class="item__right">
                    <button class="mini adminCBtn2" type="button">수정</button>
                    <button class="mini mini--ok coupon-delete-btn" type="button">삭제</button>
                </div>`;

            couponList.prepend(article);

            // 입력 필드만 초기화하고 모달(dialog)은 닫지 않음
            document.getElementById("adminCouponName").value = "";
            alert("쿠폰이 생성되었습니다.");

            updateCouponVisibility();
        });
    }

    // 4. 쿠폰 수정 및 삭제 (이벤트 위임)
    couponList.addEventListener("click", (e) => {
        // [수정 버튼]
        if (e.target.classList.contains('adminCBtn2')) {
            currentEditItem = e.target.closest('.coupon-item');
            document.getElementById("adminCouponName2").value = currentEditItem.dataset.name;
            document.getElementById("adminCouponDiscount2").value = currentEditItem.dataset.discount;
            document.getElementById("adminMinDate2").value = currentEditItem.dataset.min;
            document.getElementById("adminMaxDate2").value = currentEditItem.dataset.max;
            dialog2.showModal();
        }
        // [삭제 버튼]
        if (e.target.classList.contains('coupon-delete-btn')) {
            if (confirm("정말로 삭제하시겠습니까?")) {
                e.target.closest('.coupon-item').remove();
                updateCouponVisibility();
            }
        }
    });

    // 5. 쿠폰 수정 완료 처리
    const saveEditBtn = document.getElementById("adminMakeCouponBtn2");
    if (saveEditBtn) {
        saveEditBtn.addEventListener('click', function () {
            if (!currentEditItem) return;

            const newName = document.getElementById("adminCouponName2").value.trim();
            const newDisc = document.getElementById("adminCouponDiscount2").value;
            const newMin = document.getElementById("adminMinDate2").value;
            const newMax = document.getElementById("adminMaxDate2").value;

            if (!newName || !newMin || !newMax) return alert("수정할 내용을 모두 입력해주세요.");

            // 데이터 갱신
            currentEditItem.dataset.name = newName;
            currentEditItem.dataset.discount = newDisc;
            currentEditItem.dataset.min = newMin;
            currentEditItem.dataset.max = newMax;

            // UI 갱신
            currentEditItem.querySelector('.coupon-item__name').innerText = `쿠폰 이름: ${newName}`;
            currentEditItem.querySelector('.coupon-item__discount').innerText = `할인율: ${newDisc}`;
            currentEditItem.querySelector('.coupon-item__meta').innerText = `유효기간: ${newMin} ~ ${newMax}`;

            dialog2.close();
            alert("쿠폰 수정이 완료됐습니다.");
            currentEditItem = null;
        });
    }

    // 6. 검색 필터 로직
    if (searchBtn) {
        searchBtn.addEventListener("click", function () {
            const nameQ = document.getElementById("filterCouponName").value.toLowerCase();
            const discQ = document.getElementById("filterDiscount").value;
            const minQ = document.getElementById("filterMinDate").value;
            const maxQ = document.getElementById("filterMaxDate").value;

            const items = couponList.querySelectorAll('.coupon-item');
            items.forEach(item => {
                const { name, discount, min, max } = item.dataset;
                let isMatch = true;

                // 이름 검색
                if (nameQ && !name.toLowerCase().includes(nameQ)) isMatch = false;
                // 할인율 검색
                if (discQ && discount !== discQ) isMatch = false;
                // 유효기간 범위 로직
                if (minQ && !maxQ) {
                    if (max < minQ) isMatch = false;
                } else if (!minQ && maxQ) {
                    if (min > maxQ) isMatch = false;
                } else if (minQ && maxQ) {
                    if (max < minQ || min > maxQ) isMatch = false;
                }

                item.style.display = isMatch ? "flex" : "none";
            });
        });
    }

    // 7. 기타 버튼 이벤트
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            // 모든 필터 입력창 초기화
            document.getElementById("filterCouponName").value = "";
            document.getElementById("filterDiscount").value = "";
            document.getElementById("filterMinDate").value = "";
            document.getElementById("filterMaxDate").value = "";
            isExpanded = false;
            updateCouponVisibility();
        });
    }

    if (showAllBtn) {
        showAllBtn.addEventListener("click", () => {
            isExpanded = !isExpanded;
            updateCouponVisibility();
        });
    }

    // 모달 열기/닫기 기본
    document.getElementById("adminOpenBtn").addEventListener("click", () => dialog.showModal());
    document.getElementById("adminCloseBtn").addEventListener("click", () => dialog.close());
    document.getElementById("adminCloseBtn2").addEventListener("click", () => dialog2.close());

    // 페이지 로드 시 초기 가시성 설정
    updateCouponVisibility();
});