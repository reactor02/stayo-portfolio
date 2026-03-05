window.addEventListener('load', bind);

function bind() {
    // 주요 DOM 요소 선언
    const userNameEl = document.querySelector("#userName");
    // [수정] 쿠폰 버튼과 충돌을 피하기 위해 우측 요약창과 모바일 하단 결제 버튼만 타겟팅
    const paidBtns = document.querySelectorAll("#paid-btn, .pay-right .btn-main");
    const emailLocal = document.getElementById('emailLocal');
    const emailDomain = document.getElementById('emailDomain');
    const emailSelect = document.getElementById('emailSelect');
    const emailErr = document.getElementById('emailLocalError');
    const p1 = document.getElementById('phoneP1');
    const p2 = document.getElementById('phoneP2');
    const p3 = document.getElementById('phoneP3');
    const phoneErr = document.getElementById('userPhoneError');
    const agreeErr = document.getElementById('agreeError');

    // --- 1. 이름 검증 ---
    if (userNameEl) {
        let nameErrorEl = document.getElementById('userNameError');
        const korean = /^[가-힣]+$/;
        userNameEl.addEventListener('input', function() {
            const val = this.value.trim();
            if (nameErrorEl && val.length > 0 && korean.test(val)) {
                nameErrorEl.style.display = 'none';
            }
        });
        userNameEl.addEventListener('blur', function () {
            const val = this.value.trim();
            if (!nameErrorEl) return;
            if (val.length === 0) {
                nameErrorEl.textContent = '예약자 이름을 입력해주세요.';
                nameErrorEl.style.display = 'block';
            } else if (!korean.test(val)) {
                nameErrorEl.textContent = '이름은 한글만 됩니다.';
                nameErrorEl.style.display = 'block';
            }
        });
    }

    // --- 2. 연락처 검증 ---
    (function setupPhoneParts() {
        const phoneHidden = document.getElementById('userPhone');
        const parts = [p1, p2, p3];
        const maxLens = [3, 4, 4];
        if (!p1 || !p2 || !p3) return;
        parts.forEach((el, idx) => {
            el.addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '').slice(0, maxLens[idx]);
                if (phoneHidden) phoneHidden.value = [p1.value, p2.value, p3.value].join('-');
                if (phoneErr) {
                    const isComplete = p1.value === '010' && p2.value.length === 4 && p3.value.length === 4;
                    if (isComplete) { phoneErr.style.display = 'none'; }
                }
                if (this.value.length === maxLens[idx] && parts[idx + 1]) { parts[idx + 1].focus(); }
            });
            el.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && this.value.length === 0 && parts[idx - 1]) { parts[idx - 1].focus(); }
            });
        });
    })();

    // --- 3. 이메일 검증 ---
    if (emailLocal && emailDomain && emailErr) {
        const allowed = /^[a-zA-Z0-9._+\-%]*$/;
        const checkEmailStatus = () => {
            const lVal = emailLocal.value.trim();
            const dVal = emailDomain.value.trim();
            if (lVal && dVal && !/[가-힣]/.test(lVal) && allowed.test(lVal)) { emailErr.style.display = 'none'; }
        };
        emailLocal.addEventListener('input', function () {
            const v = this.value;
            if (/[가-힣]/.test(v)) {
                emailErr.textContent = '이메일에 한글은 입력할 수 없습니다.';
                emailErr.style.display = 'block';
            } else if (!allowed.test(v)) {
                emailErr.textContent = '사용할 수 없는 특수문자가 포함되어 있습니다.';
                emailErr.style.display = 'block';
            } else { checkEmailStatus(); }
        });
        emailDomain.addEventListener('input', checkEmailStatus);
        if (emailSelect) {
            emailSelect.addEventListener('change', function () {
                if (this.value === 'custom') {
                    emailDomain.disabled = false; emailDomain.value = ''; emailDomain.focus();
                } else {
                    emailDomain.value = this.value; emailDomain.disabled = true;
                }
                checkEmailStatus();
            });
        }
    }

    // --- 4. 포인트 및 최종 결제 업데이트 함수 ---
    const ROOM_PRICE  = 638000;
    const TAX_FEE     = 35000;
    const BASE_DISC   = 20000;
    const OWNED_POINT = 12000;
    let usedPoint = 0;
    let usedCoupon = 0;

    const updateFinalDisplay = () => {
        const total = ROOM_PRICE + TAX_FEE - BASE_DISC - usedPoint - usedCoupon;
        const fmt = (n) => '₩' + n.toLocaleString('ko-KR');
        
        document.getElementById('sumTotal').textContent = fmt(total);
        if(document.getElementById('sumBtnText')) document.getElementById('sumBtnText').textContent = fmt(total);
        if(document.getElementById('sumBtnTextMobile')) document.getElementById('sumBtnTextMobile').textContent = fmt(total);
    };

    (function setupPoint() {
        const pointInput = document.getElementById('pointInput');
        const pointUseBtn = document.getElementById('pointUseBtn');
        const pointUseAll = document.getElementById('pointUseAll');
        const ownedEl = document.getElementById('pointOwned');
        const usedAmtEl = document.getElementById('pointUsedAmt');
        const sumPointRow = document.getElementById('sumPointRow');
        const sumPointAmt = document.getElementById('sumPointAmt');

        if (!pointInput || !pointUseBtn) return;

        const applyPoint = (pts) => {
            const cap = Math.min(OWNED_POINT, ROOM_PRICE + TAX_FEE);
            usedPoint = Math.max(0, Math.min(pts, cap));

            if (ownedEl) ownedEl.textContent = '보유 포인트: ' + (OWNED_POINT - usedPoint).toLocaleString() + 'P';
            if (usedAmtEl) usedAmtEl.textContent = usedPoint.toLocaleString();

            if (usedPoint > 0) {
                if (sumPointRow) sumPointRow.style.display = 'flex';
                if (sumPointAmt) sumPointAmt.textContent = '-₩' + usedPoint.toLocaleString();
            } else {
                if (sumPointRow) sumPointRow.style.display = 'none';
            }
            updateFinalDisplay();
        };

        pointUseBtn.addEventListener('click', () => applyPoint(parseInt(pointInput.value, 10) || 0));
        pointUseAll.addEventListener('change', function() {
            applyPoint(this.checked ? OWNED_POINT : 0);
            pointInput.value = this.checked ? OWNED_POINT : '';
        });
    })();

    // --- 5. 쿠폰 로직 ---
    (function setupCoupon() {
        const couponModal = document.getElementById('couponModal');
        if (!couponModal) return;

        // 쿠폰 설명 텍스트 (정확한 셀렉터로 지정)
        const couponTextDesc = couponModal.previousElementSibling
            ? null
            : null;
        // discount__row 첫 번째 안의 .muted 텍스트를 직접 타겟
        const couponDescEl = document.querySelector('.discount .discount__row:first-child .muted');

        // 요약창 쿠폰 행: 없으면 동적 생성
        let sumCouponRow = document.getElementById('sumCouponRow');
        let sumCouponAmt = document.getElementById('sumCouponAmt');
        if (!sumCouponRow) {
            sumCouponRow = document.createElement('div');
            sumCouponRow.id = 'sumCouponRow';
            sumCouponRow.className = 'sum-row sum-row--discount';
            sumCouponRow.style.display = 'none';
            sumCouponRow.innerHTML = `<span class="muted">쿠폰 할인</span><b id="sumCouponAmt">-₩0</b>`;
            const sumLine = document.querySelector('.sum-line');
            if (sumLine) sumLine.parentNode.insertBefore(sumCouponRow, sumLine);
            sumCouponAmt = document.getElementById('sumCouponAmt');
        }

        // 쿠폰 적용 처리
        const applyBtn = document.getElementById('applyCouponBtn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                const checked = couponModal.querySelector('input[name="couponSelect"]:checked');
                if (!checked) {
                    couponModal.setAttribute('aria-hidden', 'true');
                    document.body.style.overflow = '';
                    return;
                }

                usedCoupon = parseInt(checked.value, 10) || 0;

                if (usedCoupon > 0) {
                    if (couponDescEl) {
                        couponDescEl.textContent = `${checked.dataset.name} (${usedCoupon.toLocaleString()}원 할인 적용됨)`;
                        couponDescEl.style.color = '#d32f2f';
                    }
                    sumCouponRow.style.display = 'flex';
                    if (sumCouponAmt) sumCouponAmt.textContent = `-₩${usedCoupon.toLocaleString()}`;
                } else {
                    if (couponDescEl) {
                        couponDescEl.textContent = '사용 가능한 쿠폰을 선택하세요';
                        couponDescEl.style.color = '';
                    }
                    sumCouponRow.style.display = 'none';
                }

                updateFinalDisplay();
                couponModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            });
        }

        // 모달 열기: 쿠폰 영역의 '쿠폰 선택' 버튼만 타겟
        const couponOpenBtn = document.querySelector('.discount .discount__row:first-child .btn-small');
        if (couponOpenBtn) {
            couponOpenBtn.addEventListener('click', () => {
                couponModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            });
        }

        // 모달 닫기
        couponModal.querySelectorAll('[data-action="close"]').forEach(btn => {
            btn.addEventListener('click', () => {
                couponModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            });
        });
    })();

    // --- 6. 결제 버튼 클릭 시 검증 ---
    if (paidBtns.length) {
        paidBtns.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                let firstErrorEl = null;

                const name = userNameEl ? userNameEl.value.trim() : '';
                const nameErrorEl = document.getElementById('userNameError');
                if (!name || !/^[가-힣]+$/.test(name)) {
                    if (nameErrorEl) {
                        nameErrorEl.textContent = name ? '이름은 한글만 됩니다.' : '예약자 이름을 입력해주세요.';
                        nameErrorEl.style.display = 'block';
                    }
                    if (!firstErrorEl) firstErrorEl = userNameEl;
                }

                if (p1 && p2 && p3) {
                    const isComplete = p1.value === '010' && p2.value.length === 4 && p3.value.length === 4;
                    if (!isComplete) {
                        if (phoneErr) {
                            phoneErr.textContent = '올바른 연락처(010-0000-0000)를 입력해주세요.';
                            phoneErr.style.display = 'block';
                        }
                        if (!firstErrorEl) firstErrorEl = p1;
                    }
                }

                if (emailLocal && emailDomain) {
                    const lVal = emailLocal.value.trim();
                    const dVal = emailDomain.value.trim();
                    let msg = !lVal ? '이메일 주소를 입력해주세요.' : (/[가-힣]/.test(lVal) ? '이메일에 한글은 불가합니다.' : (!dVal ? '도메인을 입력해주세요.' : ''));
                    if (msg) {
                        emailErr.textContent = msg; emailErr.style.display = 'block';
                        if (!firstErrorEl) firstErrorEl = lVal ? emailDomain : emailLocal;
                    }
                }

                const requiredNodes = document.querySelectorAll('.agree__list input[type="checkbox"][data-required="true"]');
                if (Array.from(requiredNodes).some(node => !node.checked)) {
                    if (agreeErr) { agreeErr.textContent = '필수 약관에 모두 동의해주세요.'; agreeErr.style.display = 'block'; }
                    if (!firstErrorEl) firstErrorEl = document.querySelector('.agree__all');
                }

                if (firstErrorEl) {
                    window.scrollTo({ top: firstErrorEl.getBoundingClientRect().top + window.pageYOffset - 150, behavior: 'smooth' });
                    firstErrorEl.focus();
                } else {
                    try {
                        alert('결제가 완료되었습니다.');
                        window.location.href = "T3_2nd_mapage.html";
                    } catch (err) {
                        alert('결제 도중에 예기치 못한 문제가 생겼습니다.');
                    }
                }
            });
        });
    }

    // --- 7. 약관 및 기타 UI (모달 등) ---
    (function setupAgreeSync() {
        const master = document.getElementById('agreeAll');
        const checks = [document.getElementById('agree_terms'), document.getElementById('agree_privacy'), document.getElementById('agree_marketing')].filter(el => el);
        if (master) {
            master.addEventListener('change', () => {
                checks.forEach(c => c.checked = master.checked);
                if (master.checked && agreeErr) agreeErr.style.display = 'none';
            });
            checks.forEach(c => {
                c.addEventListener('change', () => {
                    master.checked = checks.every(x => x.checked);
                    if (checks.filter(x => x.dataset.required === "true").every(x => x.checked) && agreeErr) agreeErr.style.display = 'none';
                });
            });
        }
    })();

    (function setupTermsModal() {
        const modal = document.getElementById('termsModal');
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