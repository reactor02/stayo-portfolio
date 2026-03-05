window.addEventListener('load', bind)

function bind() {

    function updateCommentCount() {
        const list = document.querySelector(".comment-list");
        const btn = document.querySelector(".js-toggle-comments");
        const totalText = document.querySelector(".comments-title .muted"); // "총 3개"

        if (!list) return;

        const count = list.querySelectorAll(".comment-item").length;

        // 버튼: 댓글 보기(3)
        if (btn) btn.textContent = `댓글 보기(${count})`;

        // 제목 옆: 총 3개
        if (totalText) totalText.textContent = `총 ${count}개`;
    }



    document.addEventListener("DOMContentLoaded", () => {
        const modal = document.querySelector("[data-modal]");
        const openBtn = document.querySelector("[data-open-modal]");
        const closeBtns = document.querySelectorAll("[data-close-modal]");

        if (!modal || !openBtn) return;

        const open = () => {

            modal.hidden = false;
            modal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
        };

        const close = () => {
            modal.hidden = true;
            modal.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";
        };

        openBtn.addEventListener("click", open);
        closeBtns.forEach(b => b.addEventListener("click", close));

        // ESC로 닫기
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && !modal.hidden) close();
        });
    });
    // ===== 리뷰 작성 모달 열기/닫기 =====
    const modal = document.querySelector('[data-modal]');
    const openBtn = document.querySelector('[data-open-modal]');
    const closeBtns = document.querySelectorAll('[data-close-modal]');





    if (modal && openBtn) {
        const open = () => {
            syncTagsToModalChecks();
            modal.hidden = false;
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

        };

        const close = () => {
            modal.hidden = true;
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        openBtn.addEventListener('click', open);
        closeBtns.forEach(btn => btn.addEventListener('click', close));

        // ESC로 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.hidden) close();
        });
    }

    // document.querySelectorAll(".js-toggle-comments").forEach(btn => {
    //     btn.addEventListener("click", () => {
    //         const card = btn.closest(".review-card");
    //         const comments = card.querySelector(".comments");
    //         const open = card.classList.toggle("open");

    //         btn.setAttribute("aria-expanded", open ? "true" : "false");
    //         btn.querySelector(".chev").textContent = open ? "▴" : "▾";
    //     });
    // });
    // document.querySelectorAll(".js-toggle-comments").forEach(btn => {
    //     btn.addEventListener("click", () => {

    //         const comments = document.querySelector(".comments");

    //         comments.classList.toggle("open");

    //     });
    // });

    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".js-toggle-comments");
        if (!btn) return;
        const card = btn.closest(".rev-card");
        if (!card) return;
        card.classList.toggle("open");
        const isOpen = card.classList.contains("open");
        btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    // (선택) 글자수 카운트
    document.querySelectorAll(".comment-input").forEach(ta => {
        const limitEl = ta.closest(".input-wrap").querySelector(".limit");
        ta.addEventListener("input", () => {
            const v = ta.value.slice(0, 200);
            if (v !== ta.value) ta.value = v;
            limitEl.textContent = `${ta.value.length} / 200`;
        });
    });


    // ===== 답글(대댓글) 기능 =====
    document.addEventListener("click", (e) => {
        // 답글창 열기/닫기
        const openBtn = e.target.closest("[data-reply-open]");
        if (openBtn) {
            const item = openBtn.closest(".comment-item");
            const box = item.querySelector(".reply-box");
            const willOpen = box.hidden;           // 열릴지 닫힐지
            box.hidden = !willOpen;
            openBtn.textContent = willOpen ? "답글 닫기" : "답글";
            if (willOpen) item.querySelector(".reply-input")?.focus();
            return;
        }

        // 답글 등록
        const submitBtn = e.target.closest("[data-reply-submit]");
        if (submitBtn) {
            const item = submitBtn.closest(".comment-item");
            const input = item.querySelector(".reply-input");
            const list = item.querySelector(".reply-list");
            const text = input.value.trim();
            if (!text) return;

            const now = new Date();
            const date = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;

            list.insertAdjacentHTML("beforeend", `
      <li class="reply-item">
        <div class="reply-head">
          <div class="reply-user">
            <span class="avatar sm">ME</span>
            <span class="name">나</span>
          </div>
          <time class="date">${date}</time>
        </div>
        <p class="reply-text"></p>
      </li>
    `);

            // XSS 방지: innerHTML 대신 textContent로 넣기
            list.lastElementChild.querySelector(".reply-text").textContent = text;

            input.value = "";
            const limitEl = item.querySelector(".reply-limit");
            if (limitEl) limitEl.textContent = "0 / 200";
            return;
        }
    });

    // 답글 글자수 카운트(200자 제한)
    document.addEventListener("input", (e) => {
        const ta = e.target.closest(".reply-input");
        if (!ta) return;
        const item = ta.closest(".comment-item");
        const limitEl = item.querySelector(".reply-limit");
        const v = ta.value.slice(0, 200);
        if (v !== ta.value) ta.value = v;
        if (limitEl) limitEl.textContent = `${ta.value.length} / 200`;
    });

    const btn_comment = document.querySelector('.btn-comment')
    const comment_input = document.querySelector('.comment-input')
    const comment_list = document.querySelector('.comment-list')


    btn_comment.addEventListener('click', () => {

        const text = comment_input.value.trim();
        if (!text) return;

        comment_list.innerHTML += `
        <li class="comment-item">
                  <div class="comment-head">
                    <div class="comment-user">
                      <span class="avatar sm">ME</span>
                      <span class="name">나</span>
                    </div>
                    <time class="date">2026.03.05</time>
                  </div>
                  <p class="comment-text">
                    ${comment_input.value}
                  </p>
                  <div class="comment-actions">
                    <button type="button" class="btn-reply" data-reply-open>답글</button>
                  </div>
                  <div class="reply-box" hidden>
                    <ul class="reply-list"></ul>

                    <div class="reply-form">
                      <textarea class="reply-input" placeholder="답글을 입력하세요 (최대 200자)"></textarea>
                      <div class="reply-bottom">
                        <span class="reply-limit muted">0 / 200</span>
                        <button type="button" class="btn btn-solid" data-reply-submit>등록</button>
                      </div>
                    </div>
                  </div>
                </li>
        `
        comment_input.value = '';
        document.querySelector('.limit').textContent = '0 / 200';  // ✅ 추가
        updateCommentCount();
    })

    const btn_modal = document.querySelector('.btn-modal')

    btn_modal.addEventListener('click', () => {
        // alert('리뷰 수정기능은 준비중입니다')
        rev_title.textContent = field__textarea_title.value
        rev_text.innerText = field__textarea_text.value
        // alert('리뷰가 수정되었습니다')
        const tagsWrap = document.querySelector(".tags");
        const checked = [...document.querySelectorAll('[data-modal] .checks input[type="checkbox"]:checked')]
            .map(chk => chk.value.trim());

        // 기존 태그 지우고 다시 만들기
        tagsWrap.innerHTML = "";

        checked.forEach(word => {
            const span = document.createElement("span");
            span.className = "tag";          // 스타일은 기본 .tag 적용됨 (CSS에 있음) :contentReference[oaicite:3]{index=3}
            span.textContent = word;
            tagsWrap.appendChild(span);
        });
    })
    // btn_modal.addEventListener('click',close)

    const field__textarea_text = document.querySelector('.field__textarea_text')
    const field__textarea_title = document.querySelector('.field__textarea_title')
    const rev_title = document.querySelector('.rev-title');
    const rev_text = document.querySelector('.rev-text')


    document.addEventListener("input", (e) => {
        const ta = e.target.closest(".field__textarea_text");
        if (!ta) return;
        const item = ta.closest(".field");
        const limitEl = item.querySelector(".reply-limit");
        const v = field__textarea_text.value.slice(0, 1000);
        if (v !== field__textarea_text.value) field__textarea_text.value = v;
        if (limitEl) limitEl.textContent = `${field__textarea_text.value.length} / 1000`;


    });
    field__textarea_title.value = rev_title.textContent
    field__textarea_text.value = rev_text.innerText

    function syncTagsToModalChecks() {
        // 리뷰 상세의 태그 텍스트들(청결/친절/가성비...)
        const tags = [...document.querySelectorAll(".tags .tag")]
            .map(el => el.textContent.trim());

        // 모달 체크박스들
        const checks = document.querySelectorAll('[data-modal] .checks input[type="checkbox"]');

        // 초기화 후, 태그에 있는 것만 체크
        checks.forEach(chk => {
            chk.checked = tags.includes(chk.value);
        });
    }


    const act = document.querySelector('.act')


    act.addEventListener('click', () => {
        const spl = act.textContent.split(' ')
        spl[1]++;
        act.textContent = `${spl[0]} ${spl[1]}`
    })


    updateCommentCount();

}