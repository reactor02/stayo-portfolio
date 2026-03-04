window.addEventListener('load', bind)
function bind() {
    // 예약자 이름 DOM
    const userNameEl = document.querySelector("#userName");
    // 결제/확인 버튼 DOM
    const paidBtns = document.querySelectorAll("#paid-btn, .btn-main");


    // (디버그용 로그) 존재 확인 — 개발 완료 후 제거 가능
    console.log(userNameEl);
    console.log(userNameEl, "멀록", userNameEl ? userNameEl.parentNode : '## #userName not found');

    // 입력은 자유롭게 허용하고, 포커스 아웃(blur) 시 한글 전용 검증 메시지를 노출
    if (userNameEl) {
        // 에러 메시지 엘리먼트는 HTML에 미리 배치되어 있다고 가정
        let errorEl = document.getElementById('userNameError');

        // 한글만 허용하는 정규식
        // ^ 
        const korean = /^[가-힣]+$/;

        // 키보드 입력 정책: 처음 키다운(초회)에는 에러를 띄우지 않음.
        // 한글 입력 중에는 검사하지 않음. compositionend 시와 이후 keydown에서 검사.
        let flagA = false;

        // userNameEl에 키다운 발생 이벤트
        userNameEl.addEventListener('keydown', function () {
            //최초 플래그 false면 트루로 변경. 최초입력 시에는 에러 메시지 띄우지 않음. 이후부터는 입력할 때마다 검사하여 에러 메시지 노출 여부 결정.
            if (!flagA) { flagA = true; return; }
            //userNameEl의 value값만 가져옴
            const val = this.value;
            //에러메세지 돔 존재시에는 여기서 종료
            if (!errorEl) return;
            // 에러메시지가 없고. 입력값이 0보다 크고, korean 정규식에 맞지 않으면 에러메시지 노출. 그렇지 않으면 에러메시지 숨김.
            if (val.length > 0 && !korean.test(val)) {
                errorEl.textContent = '이름은 한글만 됩니다.';
                errorEl.style.display = 'block';
            } else {
                errorEl.style.display = 'none';
                errorEl.textContent = '';
            }
        });

        // 입력 중: 유효하면 에러 숨기기. 이미 에러가 보이는 상태라면 비한글 입력해도 유지.
        function handleInput() {
            //userNameEl.addEventListener('input', handleInput)이벤트의 콜백함수로 들어가 있어서 userNameEl.value값을 가져옴
            const val = this.value;
            // 만약 이미 에러메시지가 존재하는 상태라면 if식으로 내려감
            if (!errorEl) return;
            // 정규식 검사: 입력값이 0보다 크고, korean 정규식에 맞으면 에러메시지 삭제
            if (val.length > 0 && korean.test(val)) {
                errorEl.style.display = 'none';
                errorEl.textContent = '';
            }


        }
        // input 이벤트로 값이 바뀔 때마다 handleInput 함수 실행. 입력 중 에러 메시지 검사
        userNameEl.addEventListener('input', handleInput);

        // blur 시 엄격 검증: 빈값 또는 비한글이면 에러 표출
        userNameEl.addEventListener('blur', function () {
            //value값에서 앞뒤 공백 제거한 값만 가져옴
            const val = this.value.trim();
            // 에러메시지 돔 존재시에는 여기서 종료
            if (!errorEl) return;
            // 입력창에 아무것도 없다면
            if (val.length == 0) {
                errorEl.textContent = '예약자 이름을 입력해주세요.';
                errorEl.style.display = 'block';
                return;
            }
            // 정규식이 test(val)에서 false라면(한글이 아니라면) 메세지 출력
            if (!korean.test(val)) {
                errorEl.textContent = '이름은 한글만 됩니다.';
                errorEl.style.display = 'block';
                return;
            }
            //검증 통과시 에러 메시지 숨김
            errorEl.style.display = 'none';
            errorEl.textContent = '';
        });
    }

    // 결제/확인 버튼 클릭 시 한글 검증 (여러 버튼에 동일 핸들러 적용)
    if (paidBtns && paidBtns.length) {
        paidBtns.forEach(btn => {
            btn.addEventListener('click', function (e) {
                // 폼 제출 방지
                e.preventDefault();
                const name = (userNameEl && userNameEl.value) ? userNameEl.value.trim() : '';
                const korean = /^[가-힣]+$/;
                // 예약자 이름이 비어있으면 에러메세지 노출
                const nameErrorEl = document.getElementById('userNameError');
                if (name.length === 0) {
                    if (nameErrorEl) { nameErrorEl.textContent = '예약자 이름을 입력해주세요.'; nameErrorEl.style.display = 'block'; }
                    if (userNameEl) userNameEl.focus();
                    return;
                }

                if (!korean.test(name)) {
                    if (nameErrorEl) { nameErrorEl.textContent = '이름은 한글만 됩니다.'; nameErrorEl.style.display = 'block'; }
                    if (userNameEl) userNameEl.focus();
                    return;
                }

                // 검증 통과 시 출력
                console.log('이름 검증 통과:', name);
            });
        });
    }


    // 연락처 3분할 입력: phoneP1(3자리) / phoneP2(4자리) / phoneP3(4자리)
    // hidden input #userPhone에 하이픈 포함 전체 번호를 조합해 저장
    (function setupPhoneParts() {
        const p1 = document.getElementById('phoneP1');
        const p2 = document.getElementById('phoneP2');
        const p3 = document.getElementById('phoneP3');
        const phoneHidden = document.getElementById('userPhone');
        const phoneErr = document.getElementById('userPhoneError');
        const parts = [p1, p2, p3];
        const maxLens = [3, 4, 4]; // 각 칸의 최대 자릿수

        if (!p1 || !p2 || !p3) return;

        // hidden input에 조합된 전화번호(000-0000-0000) 갱신
        const updateHidden = () => {
            if (phoneHidden) phoneHidden.value = [p1.value, p2.value, p3.value].join('-');
        };

        // 에러 숨기기
        const clearErr = () => {
            if (phoneErr) { phoneErr.style.display = 'none'; phoneErr.textContent = ''; }
        };

        // 전체 번호 유효성 검사
        const validate = () => {
            if (!phoneErr) return true;
            const v1 = p1.value, v2 = p2.value, v3 = p3.value;
            // 세 칸 모두 비어있으면 빈값 에러
            if (!v1 && !v2 && !v3) {
                phoneErr.textContent = '연락처를 입력해주세요.';
                phoneErr.style.display = 'block';
                return false;
            }
            // p1이 010이 아닌 경우
            if (v1 !== '010') {
                phoneErr.textContent = '전화번호는 010으로 시작해야 합니다.';
                phoneErr.style.display = 'block';
                return false;
            }
            // p2가 4자리 미만
            if (v2.length < 4) {
                phoneErr.textContent = '전화번호 형식이 올바르지 않습니다.';
                phoneErr.style.display = 'block';
                return false;
            }
            // p3가 4자리 미만
            if (v3.length < 4) {
                phoneErr.textContent = '전화번호 형식이 올바르지 않습니다.';
                phoneErr.style.display = 'block';
                return false;
            }
            clearErr();
            return true;
        };

        parts.forEach(function(el, idx) {
            // input: 숫자만 허용, 최대 자릿수 제한, 다 채우면 다음 칸으로 이동
            el.addEventListener('input', function() {
                // 숫자 외 제거
                this.value = this.value.replace(/\D/g, '').slice(0, maxLens[idx]);
                updateHidden();
                // 현재 칸이 가득 차면 다음 칸으로 포커스 이동
                if (this.value.length === maxLens[idx]) {
                    const next = parts[idx + 1];
                    if (next) next.focus();
                }
                // 완성 상태면 에러 숨김
                if (p1.value === '010' && p2.value.length === 4 && p3.value.length === 4) clearErr();
            });

            // keydown: Backspace로 빈 칸에서 이전 칸으로 이동
            el.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && this.value.length === 0) {
                    const prev = parts[idx - 1];
                    if (prev) { prev.focus(); prev.selectionStart = prev.value.length; }
                }
            });

            // blur: 포커스가 phone-row 밖으로 나갈 때 전체 검증
            el.addEventListener('blur', function() {
                setTimeout(function() {
                    const focused = document.activeElement;
                    if (!parts.includes(focused)) validate();
                }, 100);
            });

            // paste: 전체 번호 붙여넣기 지원 — 숫자만 추출 후 3-4-4 분배
            el.addEventListener('paste', function(e) {
                e.preventDefault();
                const raw = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
                if (!raw) return;
                p1.value = raw.slice(0, 3);
                p2.value = raw.slice(3, 7);
                p3.value = raw.slice(7, 11);
                updateHidden();
                if (p3.value.length > 0) p3.focus();
                else if (p2.value.length > 0) p2.focus();
                else p1.focus();
            });
        });
    })();

    // ===== 포인트 로직 =====
    (function setupPoint() {
        // 금액 상수 (숙박요금 + 세금 및 수수료)
        const ROOM_PRICE  = 638000;
        const TAX_FEE     = 35000;
        const BASE_DISC   = 20000;   // 기존 할인 고정값
        const MAX_USABLE  = ROOM_PRICE + TAX_FEE; // 포인트 사용 상한
        const OWNED_POINT = 12000;   // 보유 포인트

        let usedPoint = 0; // 현재 적용된 포인트

        const pointInput   = document.getElementById('pointInput');
        const pointUseBtn  = document.getElementById('pointUseBtn');
        const pointUseAll  = document.getElementById('pointUseAll');
        const ownedEl      = document.getElementById('pointOwned');
        const usedDisplay  = document.getElementById('pointUsedDisplay');
        const usedAmtEl    = document.getElementById('pointUsedAmt');
        const sumPointRow  = document.getElementById('sumPointRow');
        const sumPointAmt  = document.getElementById('sumPointAmt');
        const sumTotal     = document.getElementById('sumTotal');
        const sumBtnText   = document.getElementById('sumBtnText');
        const sumBtnTextM  = document.getElementById('sumBtnTextMobile');

        if (!pointInput || !pointUseBtn) return;

        // 금액 포맷 (천단위 쉼표)
        const fmt = (n) => '₩' + n.toLocaleString('ko-KR');

        // 총 결제 금액 / 버튼 텍스트 갱신
        const updateTotal = () => {
            const total = ROOM_PRICE + TAX_FEE - BASE_DISC - usedPoint;
            const totalStr = fmt(total);
            if (sumTotal)    sumTotal.textContent    = totalStr;
            if (sumBtnText)  sumBtnText.textContent  = totalStr;
            if (sumBtnTextM) sumBtnTextM.textContent = totalStr;
        };

        // 포인트 적용 UI 갱신
        const applyPoint = (pts) => {
            // 범위 클램프: 0 ~ min(보유포인트, MAX_USABLE)
            const cap = Math.min(OWNED_POINT, MAX_USABLE);
            pts = Math.max(0, Math.min(pts, cap));
            usedPoint = pts;

            // 보유 포인트 잔액 표시
            const remain = OWNED_POINT - usedPoint;
            if (ownedEl) ownedEl.textContent = '보유 포인트: ' + remain.toLocaleString('ko-KR') + 'P';

            // 사용 포인트 표시 (항시 노출)
            if (usedAmtEl) usedAmtEl.textContent = usedPoint.toLocaleString('ko-KR');

            // summary 포인트 행 표시/숨김
            if (usedPoint > 0) {
                if (sumPointRow) sumPointRow.style.display = 'flex';
                if (sumPointAmt) sumPointAmt.textContent = '-' + fmt(usedPoint);
            } else {
                if (sumPointRow) sumPointRow.style.display = 'none';
            }

            // 총액 갱신
            updateTotal();

            // input 값 동기화
            if (pointInput) pointInput.value = usedPoint > 0 ? usedPoint : '';

            // 전액사용 체크박스 동기화
            if (pointUseAll) pointUseAll.checked = (usedPoint === Math.min(OWNED_POINT, MAX_USABLE));
        };

        // 사용 버튼 클릭
        pointUseBtn.addEventListener('click', function() {
            const val = parseInt(pointInput.value, 10) || 0;
            applyPoint(val);
        });

        // 전액사용 체크박스
        pointUseAll.addEventListener('change', function() {
            if (this.checked) {
                applyPoint(Math.min(OWNED_POINT, MAX_USABLE));
            } else {
                applyPoint(0);
            }
        });

        // input에서 직접 수정 시 전액사용 체크 해제
        pointInput.addEventListener('input', function() {
            if (pointUseAll) pointUseAll.checked = false;
        });
    })();

    // 이메일 3단 UI 동작: select 선택에 따라 도메인 입력 활성화/비활성화
    const emailLocal = document.getElementById('emailLocal');
    const emailSelect = document.getElementById('emailSelect');
    const emailDomain = document.getElementById('emailDomain');
    // emailSelect의 change 이벤트: 선택값이 'custom'이면 emailDomain 활성화, 그렇지 않으면 선택값으로 채우고 비활성화
    if (emailSelect && emailDomain) {
        emailSelect.addEventListener('change', function () {
            const v = this.value;
            if (v == 'custom' || v == '') {
                // 선택값이 'custom'이면 emailDomain 활성화, 포커스 이동, 값 초기화. 그렇지 않으면 선택값으로 채우고 비활성화
                emailDomain.disabled = (v != 'custom');
                if (v == 'custom') { emailDomain.disabled = false; emailDomain.focus(); emailDomain.value = ''; }
                else { emailDomain.disabled = true; emailDomain.value = ''; }
            } else {
                // 선택값이 도메인이라면 emailDomain에 선택된 option value값 채우고 비활성화
                emailDomain.value = v;
                emailDomain.disabled = true;
            }
        });

        // 폼 제출/검증 시 전체 이메일 조합을 검사 elsewhere if needed
        // 간단한 UI 보정: local 입력이 비었을 때 포커스 아웃 검증은 별도 처리 가능합니다.
    }

    // 이메일 로컬 파트 검증: 영문·숫자·이메일 허용 특수문자(._+-%)만 허용
    // 한글 또는 그 외 특수문자 입력 시 붉은 에러 메시지 노출
    (function setupEmailLocalValidation() {
        const el  = document.getElementById('emailLocal');
        const err = document.getElementById('emailLocalError');
        if (!el || !err) return;

        // 허용 문자: 영문 대소문자, 숫자, . _ + - %
        const allowed = /^[a-zA-Z0-9._+\-%]*$/;

        const showErr = (msg) => { err.textContent = msg; err.style.display = 'block'; };
        const hideErr = () => { err.textContent = ''; err.style.display = 'none'; };

        el.addEventListener('input', function () {
            const v = this.value;
            if (v.length === 0) { hideErr(); return; }
            if (/[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(v)) {
                showErr('이메일에 한글은 입력할 수 없습니다.');
            } else if (!allowed.test(v)) {
                showErr('사용할 수 없는 특수문자가 포함되어 있습니다.');
            } else {
                hideErr();
            }
        });

        el.addEventListener('blur', function () {
            const v = this.value.trim();
            if (v.length === 0) { hideErr(); return; }
            if (/[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(v)) {
                showErr('이메일에 한글은 입력할 수 없습니다.');
            } else if (!allowed.test(v)) {
                showErr('사용할 수 없는 특수문자가 포함되어 있습니다.');
            } else {
                hideErr();
            }
        });
    })();

    // 카드번호 4분할 입력: 숫자만 허용, 각 칸 maxlength=4, 채우면 다음 칸으로 자동 이동
    const cardParts = document.querySelectorAll('.card__part');
    const cardHidden = document.getElementById('cardNumberFull');
    if (cardParts.length) {
        const updateCardFull = () => {
            if (cardHidden) cardHidden.value = cardParts.map(p => p.value).join('');
        };

        cardParts.forEach((el, idx) => {
            el.addEventListener('input', function (e) {
                // 숫자 외 제거, 길이 제한
                this.value = this.value.replace(/\D/g, '').slice(0, 4);
                updateCardFull();
                if (this.value.length === 4) {
                    const next = cardParts[idx + 1];
                    if (next) next.focus();
                }
            });

            el.addEventListener('keydown', function (e) {
                if (e.key === 'Backspace' && this.value.length === 0) {
                    const prev = cardParts[idx - 1];
                    if (prev) { prev.focus(); prev.selectionStart = prev.value.length; }
                }
            });

            el.addEventListener('paste', function (e) {
                e.preventDefault();
                const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
                if (!paste) return;
                // 분배: 현재 칸부터 채운다
                let rest = paste;
                for (let i = idx; i < cardParts.length; i++) {
                    const take = rest.slice(0, 4);
                    cardParts[i].value = take;
                    rest = rest.slice(4);
                }
                // 만약 현재 칸 이전부터 채워야 할 경우(예: 전체 번호 붙여넣기 on first), 사용자가 붙여넣은 위치에 따라 덮어쓰기됨
                updateCardFull();
                // 포커스: 다음 비어있거나 마지막 칸으로
                let focusIdx = idx;
                const joinedLen = paste.length;
                focusIdx = Math.min(cardParts.length - 1, idx + Math.floor((joinedLen - 1) / 4) + 1);
                const focusEl = cardParts[focusIdx] || cardParts[cardParts.length - 1];
                if (focusEl) focusEl.focus();
            });
        });
    }

    // ===== 약관 관련: 전체 동의 마스터 동기화, 개별 체크박스 업데이트 =====
    (function setupAgreeBehavior() {
        const master = document.getElementById('agreeAll');
        const termCb = document.getElementById('agree_terms');
        const privacyCb = document.getElementById('agree_privacy');
        const marketingCb = document.getElementById('agree_marketing');
        // null이나 undefined가 아닌 체크박스만 리스트에 포함
        const allList = [termCb, privacyCb, marketingCb].filter(function (item) {
            return item !== null && item !== undefined;
        });
        // master 체크박스 이벤트: 전체 체크/해제
        master.addEventListener('change', function () {
            const checked = this.checked;
            // forEach로 하나씩 꺼내서 전부 체크
            allList.forEach(cb => cb.checked = checked);
        });

        allList.forEach(function (cb) {
            cb.addEventListener('change', function () {
                //every() 모든 체크박스가 체크되어 있으면 master도 체크, 하나라도 해제되어 있으면 master도 해제
                master.checked = allList.every(function (x) {
                    return x.checked;
                });
            });
        });

        // 결제 버튼: required 체크박스 확인
        const payBtns = document.querySelectorAll('.btn-main.btn-main--big');
        for (let i = 0; i < payBtns.length; i++) {
            const btn = payBtns[i];
            btn.addEventListener('click', function (e) {
                // 확인 대상: data-required="true" 를 가진 체크박스
                const requiredNodes = document.querySelectorAll('.agree__list input[type="checkbox"][data-required="true"]');
                let missing = false;
                for (let j = 0; j < requiredNodes.length; j++) {
                    if (!requiredNodes[j].checked) { missing = true; break; }
                }
                if (missing) {
                    e.preventDefault();
                    const agreeErr = document.getElementById('agreeError');
                    if (agreeErr) { agreeErr.textContent = '필수 약관에 동의해주세요.'; agreeErr.style.display = 'block'; }
                    return false;
                }
                // 통과 시 agreeError 숨김
                const agreeErr = document.getElementById('agreeError');
                if (agreeErr) { agreeErr.style.display = 'none'; agreeErr.textContent = ''; }
                // 통과 시 정상 흐름(현재는 UI 버튼이므로 추가 동작 없음)
            });
        }
    })();

    // ===== 약관 모달: 개별 링크에 따라 다른 내용 표시 =====
    (function setupTermsModal() {
        const modal = document.getElementById('termsModal');
        const contentEl = document.getElementById('termsModalContent');
        if (!modal || !contentEl) return;

        // HTML의 <template> 태그에서 약관 내용을 읽어옴
        const getTemplate = (type) => {
            const tmpl = document.getElementById('tmpl-' + type);
            return tmpl ? tmpl.innerHTML : '';
        };

        // 모달 엳기/닫기 함수
        const open = (html) => {
            contentEl.innerHTML = html;
            // 모달 열기: aria-hidden false, 스크롤 잠금, 포커스 이동
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            contentEl.focus();
        };
        const close = () => {
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        // link wiring
        const links = document.querySelectorAll('.agree__link');
        for (let i = 0; i < links.length; i++) {
            const a = links[i];
            a.addEventListener('click', function (e) {
                e.preventDefault();
                const type = this.dataset.type || 'terms';
                open(getTemplate(type) || getTemplate('terms'));
            });
        }

        // close controls
        modal.addEventListener('click', function (e) {
            if (e.target === modal.querySelector('.terms-modal__overlay')) close();
        });
        const closes = modal.querySelectorAll('[data-action="close"]');
        for (let i = 0; i < closes.length; i++) { closes[i].addEventListener('click', close); }
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    })();
}