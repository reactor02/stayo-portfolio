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
                if (name.length === 0) {
                    alert('예약자 이름을 입력해주세요.');
                    if (userNameEl) userNameEl.focus();
                    return;
                }

                if (!korean.test(name)) {
                    alert('이름은 한글만 됩니다.');
                    if (userNameEl) userNameEl.focus();
                    return;
                }

                // 검증 통과 시 출력
                console.log('이름 검증 통과:', name);
            });
        });
    }


    // 연락처(전화번호) 입력 제약: 숫자만, maxlength 11, 반드시 010으로 시작
    const phoneEl = document.querySelector('#userPhone');
    if (phoneEl) {
        // 에러 엘리먼트는 HTML에 미리 배치되어 있다고 가정
        let phoneErr = document.getElementById('userPhoneError');

        // 입력은 숫자만 허용
        phoneEl.addEventListener('input', function () {
            // \D는 숫자가 아닌 문자, g는 전체에서 모두 찾기. 입력값에서 숫자가 아닌 문자를 제거한 후 maxlength 11로 자르기
            const digits = this.value.replace(/\D/g, '');
            this.value = digits.slice(0, 11);
            // 입력 중 유효하면 에러 숨김
            // ^010 010으로 시작하는 {8}8자리 숫자를 허용하는 정규식
            // 조건 맞으면 에러 숨김
            if (phoneErr && /^010\d{8}$/.test(this.value)) {
                phoneErr.style.display = 'none';
                phoneErr.textContent = '';
            }
        });

        // blur 시 엄격 검증: 빈값, 형식 체크
        phoneEl.addEventListener('blur', function () {
            const val = this.value.trim();
            // 에러메시지 돔 존재시에는 여기서 종료
            if (!phoneErr) return;
            // 빈값 체크
            if (val.length == 0) {
                phoneErr.textContent = '연락처를 입력해주세요.';
                phoneErr.style.display = 'block';
                return;
            }
            // 형식 체크: 010으로 시작하는 11자리 숫자여야 함
            if (!/^010\d{8}$/.test(val)) {
                phoneErr.textContent = '전화번호는 010으로 시작하는 11자리 숫자여야 합니다.';
                phoneErr.style.display = 'block';
                return;
            }
            // 검증 통과 시 에러 메시지 숨김
            phoneErr.style.display = 'none';
            phoneErr.textContent = '';
        });
    }

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

    // 이메일 입력 규칙: 한글이 포함되면 한글만 허용(한글 입력 허용하되, 한글 사용 시에는 한글만 남김)
    (function setupEmailKoreanMode() {
        const keepKoreanOrTrim = (el) => {
            if (!el) return;
            el.addEventListener('input', function () {
                const v = this.value || '';
                if (/[가-힣]/.test(v)) {
                    // 한글이 하나라도 있으면 한글만 남김
                    this.value = v.replace(/[^가-힣]/g, '');
                } else {
                    // 한글이 없으면 공백만 제거(기본 이메일 문법 체크는 별도 처리)
                    this.value = v.replace(/\s+/g, '');
                }
            });
        };

        keepKoreanOrTrim(emailLocal);
        keepKoreanOrTrim(emailDomain);
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
                    alert('약관동의에 동의해주세요.');
                    return false;
                }
                // 통과 시 정상 흐름(현재는 UI 버튼이므로 추가 동작 없음)
            });
        }
    })();

    // ===== 약관 모달: 개별 링크에 따라 다른 내용 표시 =====
    (function setupTermsModal() {
        const modal = document.getElementById('termsModal');
        const contentEl = document.getElementById('termsModalContent');
        if (!modal || !contentEl) return;

        const templates = {
            terms: `
<h4>이용약관 (샘플)</h4>
<p>1. 본 서비스는 예약 및 결제를 지원합니다. 사용자는 정확한 정보 제공에 동의합니다.</p>
<p>2. 예약 취소 및 환불 정책은 숙소 정책에 따릅니다. 부정확한 정보로 인한 불이익은 사용자 책임입니다.</p>
<p>3. 서비스 이용 중 발생하는 분쟁은 관련 법령 및 회사 이용약관에 따릅니다.</p>
`,

            privacy: `
<h4>개인정보 처리방침 (샘플)</h4>
<p>당사는 이용자의 개인정보를 서비스 제공 목적 범위 내에서만 처리합니다.</p>
<p>수집 항목: 이름, 연락처, 이메일, 결제 정보 등. 보유기간 및 파기는 관련 법령에 따릅니다.</p>
<p>이용자는 개인정보 처리에 대한 권리를 행사할 수 있습니다. 자세한 내용은 고객센터로 문의해주세요.</p>
`,

            marketing: `
<h4>마케팅 수신동의 (샘플)</h4>
<p>이벤트, 프로모션, 추천 콘텐츠 등의 정보를 이메일/SMS로 발송할 수 있습니다.</p>
<p>선택 동의 항목으로, 동의하지 않아도 서비스 이용에 제한이 없습니다.</p>
`
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
                open(templates[type] || templates.terms);
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