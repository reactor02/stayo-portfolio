window.addEventListener('load', bind);

function bind() {
    // 주요 DOM 요소 선언
    const userNameEl = document.querySelector("#userName");
    const paidBtns   = document.querySelectorAll("#paid-btn, .pay-right .btn-main");
    const emailLocal  = document.getElementById('emailLocal');
    const emailDomain = document.getElementById('emailDomain');
    const emailSelect = document.getElementById('emailSelect');
    const emailErr    = document.getElementById('emailLocalError');
    const p1 = document.getElementById('phoneP1');
    const p2 = document.getElementById('phoneP2');
    const p3 = document.getElementById('phoneP3');
    const phoneErr = document.getElementById('userPhoneError');
    const agreeErr = document.getElementById('agreeError');

    // =============================================
    // 가격 상수 (여기서만 수정하면 전체 연동)
    // =============================================
    const PER_NIGHT   = 110000;               // 1박 요금
    const NIGHTS      = 2;                    // 숙박 박수
    const TAX_RATE    = 0.10;                 // 세금 및 수수료 10%
    const OWNED_POINT = 12000;                // 보유 포인트

    const ROOM_PRICE = PER_NIGHT * NIGHTS;               // 220,000
    const TAX_FEE    = Math.round(ROOM_PRICE * TAX_RATE); // 22,000

    let usedPoint  = 0;
    let usedCoupon = 0;

    // 예약 카드 칩 초기값 세팅
    const chipPerNight  = document.getElementById('chipPerNight');
    const chipTotalRoom = document.getElementById('chipTotalRoom');
    if (chipPerNight)  chipPerNight.textContent  = '₩' + PER_NIGHT.toLocaleString('ko-KR');
    if (chipTotalRoom) chipTotalRoom.textContent = '₩' + ROOM_PRICE.toLocaleString('ko-KR');

    // 결제 요약창 숙박 요금 / 세금 초기값 세팅
    const sumRoomPriceEl = document.getElementById('sumRoomPrice');
    const sumTaxFeeEl    = document.getElementById('sumTaxFee');
    const sumNightsLabel = document.getElementById('sumNightsLabel');
    if (sumRoomPriceEl) sumRoomPriceEl.textContent = '₩' + ROOM_PRICE.toLocaleString('ko-KR');
    if (sumTaxFeeEl)    sumTaxFeeEl.textContent    = '₩' + TAX_FEE.toLocaleString('ko-KR');
    if (sumNightsLabel) sumNightsLabel.textContent = '(' + NIGHTS + '박)';

    // =============================================
    // 총 결제금액 업데이트 (포인트·쿠폰 차감 후)
    // =============================================
    const updateFinalDisplay = () => {
        const total = ROOM_PRICE + TAX_FEE - usedPoint - usedCoupon;
        const fmt = (n) => '₩' + n.toLocaleString('ko-KR');
        const el   = document.getElementById('sumTotal');
        const btnD = document.getElementById('sumBtnText');
        const btnM = document.getElementById('sumBtnTextMobile');
        if (el)   el.textContent   = fmt(total);
        if (btnD) btnD.textContent = fmt(total);
        if (btnM) btnM.textContent = fmt(total);
    };

    updateFinalDisplay();

    // =============================================
    // 1. 이름 검증
    // =============================================
    if (userNameEl) {
        const nameErrorEl = document.getElementById('userNameError');
        const korean = /^[가-힣a-zA-Z]+$/;
        const letter = /^[ㄱ-ㅎㅏ-ㅣ]+$/;
        userNameEl.addEventListener('input', function () {
            if (nameErrorEl && this.value.trim().length > 0 && korean.test(this.value.trim()))
                nameErrorEl.style.display = 'none';
        });
        userNameEl.addEventListener('blur', function () {
            const val = this.value.trim();
            if (!nameErrorEl) return;
            if (!val) {
                nameErrorEl.textContent = '예약자 이름을 입력해주세요.';
                nameErrorEl.style.display = 'block';
            } else if (!korean.test(val) && !letter.test(val)) {
                nameErrorEl.textContent = '이름은 한글과 영어만 됩니다.';
                nameErrorEl.style.display = 'block';
            } else if(letter.test(val)){
                nameErrorEl.textContent = '올바른 형식이 아닙니다.';
                nameErrorEl.style.display = 'block';
            }
            else {
                nameErrorEl.style.display = 'none';
            }
        });
    }

    // =============================================
    // 2. 연락처 검증 (첫 칸 번호 자유 입력)
    // =============================================
    (function setupPhoneParts() {
        const phoneHidden = document.getElementById('userPhone');
        const parts   = [p1, p2, p3];
        const maxLens = [3, 4, 4];
        if (!p1 || !p2 || !p3) return;

        parts.forEach((el, idx) => {
            el.addEventListener('input', function () {
                this.value = this.value.replace(/\D/g, '').slice(0, maxLens[idx]);
                if (phoneHidden) phoneHidden.value = [p1.value, p2.value, p3.value].join('-');
                if (phoneErr) {
                    const ok = p1.value.length >= 3 && p2.value.length >= 3 && p3.value.length === 4;
                    if (ok) phoneErr.style.display = 'none';
                }
                if (this.value.length === maxLens[idx] && parts[idx + 1]) parts[idx + 1].focus();
            });
            el.addEventListener('keydown', function (e) {
                if (e.key === 'Backspace' && this.value.length === 0 && parts[idx - 1]) parts[idx - 1].focus();
            });
        });
    })();

    // =============================================
    // 3. 이메일 검증
    // =============================================
    if (emailLocal && emailDomain && emailErr) {
        const allowed = /^[a-zA-Z0-9._+\-%]*$/;
        const checkEmailStatus = () => {
            const lVal = emailLocal.value.trim();
            const dVal = emailDomain.value.trim();
            if (lVal && dVal && !/[가-힣]/.test(lVal) && allowed.test(lVal)) emailErr.style.display = 'none';
        };
        emailLocal.addEventListener('input', function () {
            if (/[가-힣]/.test(this.value)) {
                emailErr.textContent = '이메일에 한글은 입력할 수 없습니다.';
                emailErr.style.display = 'block';
            } else if (!allowed.test(this.value)) {
                emailErr.textContent = '사용할 수 없는 특수문자가 포함되어 있습니다.';
                emailErr.style.display = 'block';
            } else {
                checkEmailStatus();
            }
        });
        emailDomain.addEventListener('input', checkEmailStatus);
        if (emailSelect) {
            emailSelect.addEventListener('change', function () {
                if (this.value === 'custom') {
                    emailDomain.disabled = false;
                    emailDomain.value = '';
                    emailDomain.focus();
                } else {
                    emailDomain.value = this.value;
                    emailDomain.disabled = true;
                }
                checkEmailStatus();
            });
        }
    }

    // =============================================
    // 4. 포인트
    // =============================================
    (function setupPoint() {
        const pointInput  = document.getElementById('pointInput');
        const pointUseBtn = document.getElementById('pointUseBtn');
        const pointUseAll = document.getElementById('pointUseAll');
        const ownedEl     = document.getElementById('pointOwned');
        const usedAmtEl   = document.getElementById('pointUsedAmt');
        const sumPointRow = document.getElementById('sumPointRow');
        const sumPointAmt = document.getElementById('sumPointAmt');
        if (!pointInput || !pointUseBtn) return;

        const applyPoint = (pts) => {
            const cap = Math.min(OWNED_POINT, ROOM_PRICE + TAX_FEE);
            usedPoint = Math.max(0, Math.min(pts, cap));
            if (ownedEl)     ownedEl.textContent  = '보유 포인트: ' + (OWNED_POINT - usedPoint).toLocaleString() + 'P';
            if (usedAmtEl)   usedAmtEl.textContent = usedPoint.toLocaleString();
            if (sumPointRow) sumPointRow.style.display = usedPoint > 0 ? 'flex' : 'none';
            if (sumPointAmt) sumPointAmt.textContent   = '-₩' + usedPoint.toLocaleString();
            updateFinalDisplay();
        };

        const pointConfirm = () => {
            const ok = confirm('포인트는 회원만 이용 가능합니다.\n지금 가입하시면 12,000포인트를 드려요.\n회원가입하시겠습니까?');
            if (ok) {
                window.location.href = '../html/T3_2nd_signup.html';
            } else {
                alert('포인트 적용을 취소했습니다.');
            }
        };

        pointUseBtn.addEventListener('click', pointConfirm);

        if (pointUseAll) {
            pointUseAll.addEventListener('click', function (e) {
                e.preventDefault();
                this.checked = false;
                pointConfirm();
            });
        }
    })();

    // =============================================
    // 5. 쿠폰
    // =============================================
    (function setupCoupon() {
        const couponModal  = document.getElementById('couponModal');
        if (!couponModal) return;
        const couponDescEl = document.querySelector('.discount .discount__row:first-child .muted');

        let sumCouponRow = document.getElementById('sumCouponRow');
        let sumCouponAmt = document.getElementById('sumCouponAmt');
        if (!sumCouponRow) {
            sumCouponRow = document.createElement('div');
            sumCouponRow.id = 'sumCouponRow';
            sumCouponRow.className = 'sum-row sum-row--discount';
            sumCouponRow.style.display = 'none';
            sumCouponRow.innerHTML = '<span class="muted">쿠폰 할인</span><b id="sumCouponAmt">-₩0</b>';
            const sumLine = document.querySelector('.sum-line');
            if (sumLine) sumLine.parentNode.insertBefore(sumCouponRow, sumLine);
            sumCouponAmt = document.getElementById('sumCouponAmt');
        }

        function closeCouponModal() {
            couponModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        const applyBtn = document.getElementById('applyCouponBtn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                const checked = couponModal.querySelector('input[name="couponSelect"]:checked');
                if (!checked) { closeCouponModal(); return; }
                usedCoupon = parseInt(checked.value, 10) || 0;
                if (usedCoupon > 0) {
                    if (couponDescEl) {
                        couponDescEl.textContent = checked.dataset.name + ' (' + usedCoupon.toLocaleString() + '원 할인 적용됨)';
                        couponDescEl.style.color = '#d32f2f';
                    }
                    sumCouponRow.style.display = 'flex';
                    if (sumCouponAmt) sumCouponAmt.textContent = '-₩' + usedCoupon.toLocaleString();
                } else {
                    if (couponDescEl) { couponDescEl.textContent = '사용 가능한 쿠폰을 선택하세요'; couponDescEl.style.color = ''; }
                    sumCouponRow.style.display = 'none';
                }
                updateFinalDisplay();
                closeCouponModal();
            });
        }

        const couponOpenBtn = document.querySelector('.discount .discount__row:first-child .btn-small');
        if (couponOpenBtn) {
            couponOpenBtn.addEventListener('click', () => {
                const ok = confirm('쿠폰은 회원가입을 한 사람만 이용 가능합니다.\n회원가입하시겠습니까?');
                if (ok) {
                    window.location.href = '../html/T3_2nd_signup.html';
                } else {
                    alert('쿠폰 적용을 취소했습니다.');
                    closeCouponModal();
                }
            });
        }
        couponModal.querySelectorAll('[data-action="close"]').forEach(btn => {
            btn.addEventListener('click', closeCouponModal);
        });
    })();

    // =============================================
    // 6. 결제 버튼 클릭 시 유효성 검증
    // =============================================
    if (paidBtns.length) {
        paidBtns.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                let firstErrorEl = null;

                // 이름
                const name = userNameEl ? userNameEl.value.trim() : '';
                const nameErrorEl = document.getElementById('userNameError');
                if (!name || !/^[가-힣a-zA-Z]+$/.test(name)) {
                    if (nameErrorEl) {
                        nameErrorEl.textContent = name ? '이름은 한글과영어만 됩니다.' : '예약자 이름을 입력해주세요.';
                        nameErrorEl.style.display = 'block';
                    }
                    if (!firstErrorEl) firstErrorEl = userNameEl;
                }

                // 연락처
                if (p1 && p2 && p3) {
                    const ok = p1.value.length >= 3 && p2.value.length >= 3 && p3.value.length === 4;
                    if (!ok) {
                        if (phoneErr) { phoneErr.textContent = '올바른 연락처를 입력해주세요.'; phoneErr.style.display = 'block'; }
                        if (!firstErrorEl) firstErrorEl = p1;
                    }
                }

                // 이메일
                if (emailLocal && emailDomain) {
                    const lVal = emailLocal.value.trim();
                    const dVal = emailDomain.value.trim();
                    const msg = !lVal ? '이메일 주소를 입력해주세요.'
                        : /[가-힣]/.test(lVal) ? '이메일에 한글은 불가합니다.'
                        : !dVal ? '도메인을 입력해주세요.' : '';
                    if (msg) {
                        if (emailErr) { emailErr.textContent = msg; emailErr.style.display = 'block'; }
                        if (!firstErrorEl) firstErrorEl = lVal ? emailDomain : emailLocal;
                    }
                }

                // 필수 약관
                const requiredNodes = document.querySelectorAll('.agree__list input[type="checkbox"][data-required="true"]');
                let allRequired = true;
                for (let i = 0; i < requiredNodes.length; i++) {
                    if (!requiredNodes[i].checked) {
                        allRequired = false;
                        break;
                    }
                }
                if (!allRequired) {
                    if (agreeErr) { agreeErr.textContent = '필수 약관에 모두 동의해주세요.'; agreeErr.style.display = 'block'; }
                    if (!firstErrorEl) firstErrorEl = document.querySelector('.agree__list');
                }

                if (firstErrorEl) {
                    window.scrollTo({ top: firstErrorEl.getBoundingClientRect().top + window.pageYOffset - 150, behavior: 'smooth' });
                    firstErrorEl.focus();
                } else {
                    try {
                        alert('결제가 완료되었습니다.');
                        window.location.href = "T3_2nd_pay_complete_guest.html";
                    } catch (err) {
                        alert('결제 도중에 예기치 못한 문제가 생겼습니다.');
                    }
                }
            });
        });
    }

    // =============================================
    // 7. 약관 전체 동의 싱크
    // =============================================
    (function setupAgreeSync() {
        const master = document.getElementById('agreeAll');
        const checks = ['agree_terms', 'agree_privacy', 'agree_marketing']
            .map(id => document.getElementById(id)).filter(Boolean);
        if (!master) return;
        master.addEventListener('change', () => {
            checks.forEach(c => c.checked = master.checked);
            if (master.checked && agreeErr) agreeErr.style.display = 'none';
        });
        checks.forEach(c => {
            c.addEventListener('change', () => {
                master.checked = checks.every(x => x.checked);
                const requiredOk = checks.filter(x => x.dataset.required === 'true').every(x => x.checked);
                if (requiredOk && agreeErr) agreeErr.style.display = 'none';
            });
        });
    })();

    // =============================================
    // 8. 약관 모달
    // =============================================
    (function setupTermsModal() {
        const modal     = document.getElementById('termsModal');
        const contentEl = document.getElementById('termsModalContent');
        if (!modal || !contentEl) return;
        document.querySelectorAll('.agree__link').forEach(a => {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const tmpl = document.getElementById('tmpl-' + (a.dataset.type || 'terms'));
                contentEl.innerHTML = tmpl ? tmpl.innerHTML : '';
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            });
        });
        modal.querySelectorAll('[data-action="close"]').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            });
        });
    })();
}
