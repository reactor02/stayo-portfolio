/**
 * T3_2nd_mypage.js  ─  마이페이지 + 로그인 페이지 통합 스크립트
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  ┌─ HTML 연결 방법 ──────────────────────────────────────────────────────┐
 *  │  T3_2nd_mapage.html  → 주석 해제:                                    │
 *  │    <script src="../js/T3_2nd_mypage.js"></script>                     │
 *  │                                                                       │
 *  │  T3_2nd_login.html   → </body> 직전에 추가:                          │
 *  │    <script src="../js/T3_2nd_mypage.js"></script>                     │
 *  └───────────────────────────────────────────────────────────────────────┘
 *
 *  ┌─ 동작 규칙 ───────────────────────────────────────────────────────────┐
 *  │                                                                       │
 *  │  [비로그인 - 마이페이지 진입]                                         │
 *  │    → 예약·찜·쿠폰 요약 카드, 프로필 카드,                            │
 *  │      사이드 탭 메뉴 4개(예약 내역/찜 목록/쿠폰·포인트/프로필 관리),   │
 *  │      탭 콘텐츠 4개, 나의 문의 내역 블록 → 전부 숨김                  │
 *  │    → 고객센터 탭 메뉴 항목만 표시 (클릭 유도)                        │
 *  │    → 탭 콘텐츠 영역(#sec-support)도 숨긴 채 대기                     │
 *  │    → 로그인 유도 배너 표시                                            │
 *  │                                                                       │
 *  │  [비로그인 - 고객센터 탭 클릭]                                        │
 *  │    → 로그인 유도 배너 제거                                            │
 *  │    → #sec-support 섹션만 표시 (나머지 숨김 유지)                      │
 *  │    → 고객센터 탭 active, 나의 문의 내역은 계속 숨김                   │
 *  │                                                                       │
 *  │  [로그인 성공 후 마이페이지 복귀]                                     │
 *  │    → 숨겨진 모든 요소 복원                                            │
 *  │    → 예약 내역 탭 활성화                                              │
 *  │    → ✅ 토스트 메시지 1회 표시                                        │
 *  │                                                                       │
 *  │  [로그아웃 클릭]                                                      │
 *  │    → sessionStorage 초기화                                            │
 *  │    → 마이페이지이면 즉시 비로그인 상태로 전환                         │
 *  └───────────────────────────────────────────────────────────────────────┘
 *
 *  ┌─ 데모 계정 (실서버 연동 시 handleLogin 내 검증 로직 교체) ───────────┐
 *  │  아이디 : minho@stayo.com   /   비밀번호 : 1234                      │
 *  └───────────────────────────────────────────────────────────────────────┘
 */

(function () {
  'use strict';

  /* =========================================================================
   * 공통 상수
   * ========================================================================= */
  var DEMO_ID     = 'minho@stayo.com';
  var DEMO_PW     = '1234';
  var BANNER_ID   = 'mypage-login-banner';
  var HIDDEN_ATTR = 'data-mp-hidden';

  /* =========================================================================
   * 공통 유틸 ─ 요소 숨기기 / 복원
   * ========================================================================= */
  function hide(el) {
    if (!el || el.hasAttribute(HIDDEN_ATTR)) return;
    var computed = window.getComputedStyle(el).display;
    el.setAttribute(HIDDEN_ATTR, computed === 'none' ? '' : computed);
    el.style.display = 'none';
  }

  function show(el) {
    if (!el || !el.hasAttribute(HIDDEN_ATTR)) return;
    var orig = el.getAttribute(HIDDEN_ATTR);
    el.style.display = orig || '';
    el.removeAttribute(HIDDEN_ATTR);
  }

  function hideAll(list) { list.forEach(hide); }
  function showAll(list) { list.forEach(show); }

  /* =========================================================================
   * 공통 유틸 ─ 로그인 상태 판단
   * ========================================================================= */
  function isLoggedIn() {
    return sessionStorage.getItem('isLoggedIn') === 'true';
  }

  /* =========================================================================
   * ███████████████████  SECTION A : 마이페이지  ████████████████████████████
   * ========================================================================= */

  /* ── A-1. 대상 요소 수집 ───────────────────────────────────────────────── */
  function getTargets() {
    // 고객센터를 제외한 사이드 탭 메뉴 항목 4개
    var menuItems = Array.from(
      document.querySelectorAll('.tab-menu__item')
    ).filter(function (a) {
      return !(a.getAttribute('href') || '').includes('sec-support');
    });

    // 고객센터 > 나의 문의 내역 블록
    var inquiryBlock = null;
    document.querySelectorAll('.support__title').forEach(function (h) {
      if (h.textContent.trim() === '나의 문의 내역') {
        inquiryBlock = h.closest('.support__block');
      }
    });

    return {
      profileCard   : document.querySelector('.profile-card'),
      summaryCards  : document.querySelector('.summary-cards'),
      menuItems     : menuItems,
      sections      : [
        document.getElementById('sec-reservation'),
        document.getElementById('sec-wish'),
        document.getElementById('sec-coupon'),
        document.getElementById('sec-profile'),
      ],
      secSupport    : document.getElementById('sec-support'),   // 고객센터 섹션
      inquiryBlock  : inquiryBlock,
      headerGuest   : document.querySelector('.header-guest'),
      headerUser    : document.querySelector('.header-user'),
    };
  }

  /* ── A-2. 활성 탭 전환 ─────────────────────────────────────────────────── */
  function setActiveTab(targetHref) {
    document.querySelectorAll('.tab-menu__item').forEach(function (el) {
      el.classList.toggle(
        'tab-menu__item--active',
        (el.getAttribute('href') || '') === targetHref
      );
    });
  }

  /* ── A-3. 로그인 유도 배너 생성 / 제거 ─────────────────────────────────── */
  function createBanner() {
    if (document.getElementById(BANNER_ID)) return;

    var banner = document.createElement('div');
    banner.id  = BANNER_ID;
    banner.setAttribute('role', 'alert');
    banner.style.cssText = [
      'margin:32px auto',
      'max-width:520px',
      'padding:40px 32px',
      'background:#fff',
      'border:1.5px solid #e5e7eb',
      'border-radius:16px',
      'text-align:center',
      'box-shadow:0 4px 24px rgba(0,0,0,.08)',
      'font-family:inherit',
    ].join(';');

    banner.innerHTML = [
      '<div style="font-size:52px;margin-bottom:18px;">🔒</div>',
      '<p style="font-size:19px;font-weight:700;color:#111;margin:0 0 10px;">',
        '로그인이 필요한 서비스입니다',
      '</p>',
      '<p style="font-size:14px;color:#6b7280;margin:0 0 28px;line-height:1.75;">',
        '예약 내역, 찜 목록, 쿠폰·포인트 등 다양한 혜택을<br>',
        '로그인 후 이용하실 수 있습니다.',
      '</p>',
      '<div style="display:flex;gap:12px;justify-content:center;">',
        '<button id="mypage-login-btn" type="button"',
          ' style="padding:12px 32px;background:#2563eb;color:#fff;border:none;',
                  'border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;">',
          '로그인',
        '</button>',
        '<a href="./T3_2nd_signup.html"',
          ' style="display:inline-flex;align-items:center;padding:12px 32px;',
                  'background:#f3f4f6;color:#374151;border-radius:8px;',
                  'font-size:14px;font-weight:700;text-decoration:none;">',
          '회원가입',
        '</a>',
      '</div>',
    ].join('');

    // 탭 콘텐츠 영역(.tab-content) 안 첫 번째 자리에 삽입
    var tabContent = document.querySelector('.tab-content');
    var gridEl     = document.querySelector('.my-grid');

    if (tabContent) {
      tabContent.insertBefore(banner, tabContent.firstChild);
    } else if (gridEl) {
      gridEl.appendChild(banner);
    }

    // [로그인] 클릭 → 복귀 URL 저장 후 로그인 페이지로 이동
    var btn = document.getElementById('mypage-login-btn');
    if (btn) {
      btn.addEventListener('click', function () {
        sessionStorage.setItem('loginReturnUrl', location.href);
        location.href = './T3_2nd_login.html';
      });
    }
  }

  function removeBanner() {
    var el = document.getElementById(BANNER_ID);
    if (el) el.parentNode.removeChild(el);
  }

  /* ── A-4. 로그인 직후 복귀 토스트 (1회) ───────────────────────────────── */
  function showToastIfNeeded() {
    if (sessionStorage.getItem('justLoggedIn') !== 'true') return;
    sessionStorage.removeItem('justLoggedIn');

    var toast = document.createElement('div');
    toast.setAttribute('role', 'status');
    toast.style.cssText = [
      'position:fixed',
      'top:84px',
      'left:50%',
      'transform:translateX(-50%) translateY(-12px)',
      'background:#111827',
      'color:#fff',
      'padding:13px 28px',
      'border-radius:40px',
      'font-size:14px',
      'font-weight:600',
      'box-shadow:0 8px 28px rgba(0,0,0,.22)',
      'z-index:99999',
      'opacity:0',
      'transition:opacity .3s ease, transform .3s ease',
      'white-space:nowrap',
      'pointer-events:none',
    ].join(';');
    toast.textContent = '✅ 로그인되었습니다. 마이페이지 기능을 이용하실 수 있습니다.';
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.style.opacity   = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(function () {
      toast.style.opacity   = '0';
      toast.style.transform = 'translateX(-50%) translateY(-10px)';
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 320);
    }, 3000);
  }

  /* ── A-5. [비로그인] 마이페이지 진입 시 UI ─────────────────────────────── *
   *  · 프로필 카드 / 요약 카드 / 탭 메뉴 4개 / 탭 콘텐츠 4개               *
   *    / 고객센터 섹션(#sec-support) / 나의 문의 내역 → 모두 숨김           *
   *  · 고객센터 탭 메뉴 항목만 표시 (클릭 유도)                             *
   *  · 로그인 유도 배너 표시                                                 *
   * ========================================================================= */
  function applyGuestUI() {
    var t = getTargets();

    // 프로필 카드 / 요약 카드 / 나의 문의 내역 숨김
    hide(t.profileCard);
    hide(t.summaryCards);
    hide(t.inquiryBlock);

    // 고객센터를 제외한 사이드 탭 메뉴 항목 숨김
    hideAll(t.menuItems);

    // 탭 콘텐츠 섹션 4개 숨김 (예약/찜/쿠폰/프로필)
    hideAll(t.sections);

    // 고객센터 섹션도 숨김 (배너 표시 중에는 콘텐츠 안 보임)
    hide(t.secSupport);

    // 헤더: 비로그인 상태
    show(t.headerGuest);
    hide(t.headerUser);

    // 고객센터 탭만 active
    setActiveTab('#sec-support');

    // 로그인 유도 배너 표시
    createBanner();
  }

  /* ── A-6. [비로그인] 고객센터 탭 클릭 시 UI ────────────────────────────── *
   *  · 배너 제거 후 #sec-support 섹션만 표시                                *
   *  · 프로필·요약·메뉴 4개·섹션 4개·나의 문의 내역은 숨김 유지            *
   * ========================================================================= */
  function applyGuestSupportUI() {
    var t = getTargets();

    // 배너 제거
    removeBanner();

    // 고객센터 섹션만 표시
    show(t.secSupport);

    // 나머지는 계속 숨김 유지
    hide(t.profileCard);
    hide(t.summaryCards);
    hide(t.inquiryBlock);
    hideAll(t.menuItems);
    hideAll(t.sections);

    // 헤더: 비로그인 상태
    show(t.headerGuest);
    hide(t.headerUser);

    // 고객센터 탭 active 유지
    setActiveTab('#sec-support');
  }

  /* ── A-7. [로그인] 전체 UI 복원 ────────────────────────────────────────── */
  function applyUserUI() {
    var t = getTargets();

    // 배너 제거
    removeBanner();

    // 모든 영역 복원
    show(t.profileCard);
    show(t.summaryCards);
    show(t.inquiryBlock);
    showAll(t.menuItems);
    showAll(t.sections);
    show(t.secSupport);

    // 헤더: 로그인 상태
    show(t.headerUser);
    hide(t.headerGuest);

    // 예약 내역 탭 활성화
    setActiveTab('#sec-reservation');

    // 로그인 직후이면 토스트 표시
    showToastIfNeeded();
  }

  /* ── A-8. [로그아웃] 후 비로그인 상태 전환 ─────────────────────────────── */
  function applyLogoutUI() {
    applyGuestUI();
  }

  /* ── A-9. 고객센터 탭 클릭 이벤트 바인딩 ───────────────────────────────── */
  function bindSupportTabClick() {
    var supportTab = document.querySelector('.tab-menu__item[href="#sec-support"]');
    if (!supportTab) return;

    supportTab.addEventListener('click', function (e) {
      if (!isLoggedIn()) {
        e.preventDefault();
        // 배너를 닫고 고객센터 콘텐츠만 표시
        applyGuestSupportUI();
      }
      // 로그인 상태이면 기본 탭 이동 동작 그대로
    });
  }

  /* ── A-10. 로그아웃 버튼 바인딩 ────────────────────────────────────────── */
  function bindLogout() {
    document.querySelectorAll('.logout').forEach(function (btn) {
      if (btn.dataset.logoutBound) return;
      btn.dataset.logoutBound = 'true';

      btn.addEventListener('click', function () {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('justLoggedIn');
        sessionStorage.removeItem('loginReturnUrl');

        // 마이페이지이면 페이지 이동 없이 즉시 비로그인 상태로 전환
        var path = location.pathname;
        if (path.includes('mapage') || path.includes('mypage')) {
          applyLogoutUI();
        } else {
          location.href = './T3_2nd_index.html';
        }
      });
    });
  }

  /* ── A-11. 마이페이지 초기화 ────────────────────────────────────────────── */
  function initMypage() {
    if (isLoggedIn()) {
      applyUserUI();
    } else {
      applyGuestUI();
    }

    // 고객센터 탭 클릭 감시
    bindSupportTabClick();

    // 로그아웃 버튼 바인딩
    bindLogout();
  }

  /* =========================================================================
   * ███████████████████  SECTION B : 로그인 페이지  █████████████████████████
   * ========================================================================= */

  /* ── B-1. 폼 / 입력 요소 탐색 ──────────────────────────────────────────── */
  function getForm() {
    return document.getElementById('login-form') ||
           document.querySelector('form');
  }

  function getIdInput() {
    return document.getElementById('login-id')           ||
           document.querySelector('[name="userId"]')     ||
           document.querySelector('[name="email"]')      ||
           document.querySelector('input[type="email"]') ||
           document.querySelector('input[type="text"]');
  }

  function getPwInput() {
    return document.getElementById('login-pw')              ||
           document.querySelector('[name="password"]')      ||
           document.querySelector('[name="pw"]')            ||
           document.querySelector('input[type="password"]');
  }

  /* ── B-2. 에러 메시지 영역 ─────────────────────────────────────────────── */
  function getOrCreateErrorEl(form) {
    var el = document.getElementById('login-error');
    if (el) return el;

    el = document.createElement('p');
    el.id = 'login-error';
    el.setAttribute('role', 'alert');
    el.setAttribute('aria-live', 'assertive');
    el.style.cssText = [
      'color:#ef4444',
      'font-size:13px',
      'font-weight:500',
      'margin:10px 0 0',
      'display:none',
    ].join(';');

    var submitBtn = form.querySelector('[type="submit"], button:not([type])');
    submitBtn ? form.insertBefore(el, submitBtn) : form.appendChild(el);
    return el;
  }

  function showError(el, msg) {
    el.textContent     = msg;
    el.style.display   = 'block';
    el.style.animation = 'none';
    void el.offsetWidth; // reflow
    el.style.animation = 'mp-shake .32s ease';
  }

  function clearError(el) {
    el.textContent   = '';
    el.style.display = 'none';
  }

  /* ── B-3. 흔들림 keyframe CSS (1회 주입) ───────────────────────────────── */
  function injectShakeCSS() {
    if (document.getElementById('mp-shake-css')) return;
    var s = document.createElement('style');
    s.id = 'mp-shake-css';
    s.textContent =
      '@keyframes mp-shake{' +
        '0%,100%{transform:translateX(0)}' +
        '20%,60%{transform:translateX(-6px)}' +
        '40%,80%{transform:translateX(6px)}' +
      '}';
    document.head.appendChild(s);
  }

  /* ── B-4. 로그인 성공 처리 ──────────────────────────────────────────────── */
  function onLoginSuccess() {
    sessionStorage.setItem('isLoggedIn',   'true');
    sessionStorage.setItem('justLoggedIn', 'true'); // 마이페이지 토스트 트리거

    var returnUrl = sessionStorage.getItem('loginReturnUrl');
    if (returnUrl) {
      sessionStorage.removeItem('loginReturnUrl');
      location.href = returnUrl; // ← 마이페이지(또는 원래 페이지)로 복귀
    } else {
      location.href = './T3_2nd_index.html';
    }
  }

  /* ── B-5. 로그인 검증 ───────────────────────────────────────────────────── *
   *  실서버 연동 시 아래 함수 내부를 fetch 호출로 교체하세요.               *
   *                                                                           *
   *  fetch('/api/login', {                                                    *
   *    method : 'POST',                                                       *
   *    headers: { 'Content-Type': 'application/json' },                      *
   *    body   : JSON.stringify({ email: idVal, password: pwVal })             *
   *  })                                                                       *
   *  .then(function (r) { return r.json(); })                                 *
   *  .then(function (data) {                                                  *
   *    if (data.success) onLoginSuccess();                                    *
   *    else showError(errorEl, data.message || '로그인에 실패했습니다.');     *
   *  })                                                                       *
   *  .catch(function () {                                                     *
   *    showError(errorEl, '서버 오류가 발생했습니다.');                       *
   *  });                                                                      *
   * ========================================================================= */
  function handleLogin(idVal, pwVal, errorEl) {
    if (!idVal) { showError(errorEl, '아이디(이메일)를 입력해 주세요.'); return; }
    if (!pwVal) { showError(errorEl, '비밀번호를 입력해 주세요.');       return; }

    if (idVal === DEMO_ID && pwVal === DEMO_PW) {
      clearError(errorEl);
      onLoginSuccess();
    } else {
      showError(errorEl, '아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  }

  /* ── B-6. 이미 로그인 상태이면 즉시 복귀 ───────────────────────────────── */
  function redirectIfAlreadyLoggedIn() {
    if (!isLoggedIn()) return;
    var url = sessionStorage.getItem('loginReturnUrl');
    if (url) { sessionStorage.removeItem('loginReturnUrl'); location.replace(url); }
    else      { location.replace('./T3_2nd_index.html'); }
  }

  /* ── B-7. 로그인 페이지 초기화 ─────────────────────────────────────────── */
  function initLogin() {
    redirectIfAlreadyLoggedIn();
    injectShakeCSS();

    var form    = getForm();
    var idInput = getIdInput();
    var pwInput = getPwInput();

    if (!form) {
      console.warn('[T3_2nd_mypage.js] 로그인 폼을 찾을 수 없습니다.');
      return;
    }

    var errorEl = getOrCreateErrorEl(form);

    [idInput, pwInput].forEach(function (input) {
      if (!input) return;
      input.addEventListener('input', function () { clearError(errorEl); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      handleLogin(
        idInput ? idInput.value.trim() : '',
        pwInput ? pwInput.value        : '',
        errorEl
      );
    });
  }

  /* =========================================================================
   * ███████████████  SECTION C : 진입점 ─ 현재 페이지 자동 감지  ████████████
   *
   *  파일명에 'login' 포함  →  로그인 페이지 모드
   *  그 외                  →  마이페이지 모드
   * ========================================================================= */
  document.addEventListener('DOMContentLoaded', function () {
    var isLoginPage =
      location.pathname.toLowerCase().includes('login') ||
      !!document.getElementById('login-form')           ||
      !!document.querySelector('input[type="password"]');

    if (isLoginPage) {
      initLogin();
    } else {
      initMypage();
    }
  });

})();



