window.addEventListener('load', () => App.bind());

const App = {
    // 자주 사용할 DOM 요소들을 저장할 객체
    el: {},

    // 시작 함수
    // 필요한 요소를 찾고, 이벤트를 연결하고, 초기값을 세팅함
    bind() {
        this.cacheDom();
        this.bindEvents();
        this.initValues();
        this.updateCommentCount();
        // this.delComment();
    },

    // 필요한 DOM 요소를 한 번만 찾아서 저장
    cacheDom() {
        // 리뷰 수정 모달 관련 요소
        this.el.modal = document.querySelector('[data-modal]');
        this.el.openBtn = document.querySelector('[data-open-modal]');
        this.el.closeBtns = document.querySelectorAll('[data-close-modal]');

        // 댓글 작성 관련 요소
        this.el.btn_comment = document.querySelector('.btn-comment');
        this.el.comment_input = document.querySelector('.comment-input');
        this.el.comment_list = document.querySelector('.comment-list');

        // 리뷰 수정 저장 버튼
        this.el.btn_modal = document.querySelector('.btn-modal');

        // 리뷰 수정 폼과 리뷰 본문 표시 영역
        this.el.field__textarea_text = document.querySelector('.field__textarea_text');
        this.el.field__textarea_title = document.querySelector('.field__textarea_title');
        this.el.rev_title = document.querySelector('.rev-title');
        this.el.rev_text = document.querySelector('.rev-text');

        // 도움돼요 버튼
        this.el.act = document.querySelector('.act');

        // 공유 버튼
        this.el.share = document.querySelector('.share');

        // 삭제 버튼
        this.el.del = document.querySelectorAll('.btn-del')

        // 삭제 할 돔
        this.el.delDom = document.querySelectorAll('.comment-item');
    },

    // 이벤트를 한 곳에서 연결
    bindEvents() {
        // 모달 열기/닫기 이벤트 연결
        if (this.el.modal && this.el.openBtn) {
            this.el.openBtn.addEventListener('click', () => {
                // this.openModal();
                alert('관리자 아이디입니다');
            });

            this.el.closeBtns.forEach((btn) => {
                btn.addEventListener('click', () => {
                    // this.closeModal();
                    alert('관리자 아이디입니다');
                });
            });
        }

        // ESC 키를 누르면 모달 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.el.modal && !this.el.modal.hidden) {
                this.closeModal();
            }
        });

        // 문서 전체 클릭 이벤트를 이용해 댓글 토글, 답글 열기/등록 처리
        document.addEventListener('click', (e) => {
            this.handleCommentToggle(e);
            this.handleReplyActions(e);
        });

        // 입력 이벤트를 이용해 댓글, 답글, 리뷰 글자 수 제한 및 카운트 처리
        document.addEventListener('input', (e) => {
            this.handleCommentInputCount(e);
            this.handleReplyInputCount(e);
            this.handleReviewTextCount(e);
        });

        // 댓글 등록 버튼 클릭 시 댓글 추가
        if (this.el.btn_comment) {
            this.el.btn_comment.addEventListener('click', () => {
                this.addComment();
                // alert('로그인 해주세요');
            });
        }

        // 리뷰 수정 저장 버튼 클릭 시 제목/본문/태그 반영
        if (this.el.btn_modal) {
            this.el.btn_modal.addEventListener('click', () => {
                this.applyReviewEdit();
            });
        }

        // 도움돼요 버튼 클릭 시 숫자 증가
        if (this.el.act) {
            this.el.act.addEventListener('click', () => {
                // this.increaseLike();
                alert('관리자는 이용할 수 없습니다');
            });
        }

        if (this.el.share) {
            this.el.share.addEventListener('click', () => {
                alert(`주소가 복사되었습니다\n${window.document.location.href}`)
            })
        }

        if (this.el.del[0]) {
            this.el.del[0].addEventListener('click', () => {
                this.el.delDom[0].innerHTML = '<b>삭제되었습니다</b>';
            })
        }

        if (this.el.del[1]) {
            this.el.del[1].addEventListener('click', () => {
                this.el.delDom[1].innerHTML = '<b>삭제되었습니다</b>';
            })
        }

        if (this.el.del[2]) {
            this.el.del[2].addEventListener('click', () => {
                this.el.delDom[2].innerHTML = '<b>삭제되었습니다</b>';
            })
        }


    },

    // 현재 화면에 보이는 리뷰 제목/본문을 모달 입력창 기본값으로 넣음
    initValues() {
        if (this.el.field__textarea_title && this.el.rev_title) {
            this.el.field__textarea_title.value = this.el.rev_title.textContent;
        }

        if (this.el.field__textarea_text && this.el.rev_text) {
            this.el.field__textarea_text.value = this.el.rev_text.innerText;
        }
    },

    // 리뷰 수정 모달 열기
    // 현재 화면의 태그 상태를 체크박스에 동기화한 뒤 모달 표시
    openModal() {
        this.syncTagsToModalChecks();
        this.el.modal.hidden = false;
        this.el.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    },

    // 리뷰 수정 모달 닫기
    closeModal() {
        this.el.modal.hidden = true;
        this.el.modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    },

    // 댓글 개수를 세어서 버튼과 제목에 반영
    updateCommentCount() {
        const list = document.querySelector('.comment-list');
        const btn = document.querySelector('.js-toggle-comments');
        const totalText = document.querySelector('.comments-title .muted');

        if (!list) return;

        const count = list.querySelectorAll('.comment-item').length;

        // 댓글 접기/펼치기 버튼 문구 변경
        if (btn) btn.textContent = `댓글 보기(${count})`;

        // 댓글 영역 제목 옆 개수 변경
        if (totalText) totalText.textContent = `총 ${count}개`;
    },

    // 댓글 보기 버튼 클릭 시 댓글 영역 열고 닫기
    handleCommentToggle(e) {
        const btn = e.target.closest('.js-toggle-comments');
        if (!btn) return;

        const card = btn.closest('.rev-card');
        if (!card) return;

        card.classList.toggle('open');

        const isOpen = card.classList.contains('open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    },

    // 댓글 입력창 글자 수 제한 및 카운트 표시
    handleCommentInputCount(e) {
        const ta = e.target.closest('.comment-input');
        if (!ta) return;

        const wrap = ta.closest('.input-wrap');
        if (!wrap) return;

        const limitEl = wrap.querySelector('.limit');

        // 댓글은 최대 200자까지만 허용
        const v = ta.value.slice(0, 200);

        if (v !== ta.value) ta.value = v;
        if (limitEl) limitEl.textContent = `${ta.value.length} / 200`;
    },

    // 답글 열기/닫기와 답글 등록 처리
    handleReplyActions(e) {
        const openBtn = e.target.closest('[data-reply-open]');
        if (openBtn) {
            const item = openBtn.closest('.comment-item');
            const box = item.querySelector('.reply-box');
            const willOpen = box.hidden;

            // 답글 입력창 열고 닫기
            box.hidden = !willOpen;
            openBtn.textContent = willOpen ? '답글 닫기' : '답글';

            // 열릴 때 입력창으로 포커스 이동
            if (willOpen) {
                const input = item.querySelector('.reply-input');
                if (input) input.focus();
            }
            return;
        }

        const submitBtn = e.target.closest('[data-reply-submit]');
        if (submitBtn) {
            const item = submitBtn.closest('.comment-item');
            const input = item.querySelector('.reply-input');
            const list = item.querySelector('.reply-list');
            const text = input.value.trim();
            alert('로그인 해주세요');
        }
    },

    // 답글 입력창 글자 수 제한 및 카운트 표시
    handleReplyInputCount(e) {
        const ta = e.target.closest('.reply-input');
        if (!ta) return;

        const item = ta.closest('.comment-item');
        const limitEl = item.querySelector('.reply-limit');

        // 답글은 최대 200자까지만 허용
        const v = ta.value.slice(0, 200);

        if (v !== ta.value) ta.value = v;
        if (limitEl) limitEl.textContent = `${ta.value.length} / 200`;
    },

    // 답글 열기/닫기와 답글 등록 처리
    handleReplyActions(e) {
        const openBtn = e.target.closest('[data-reply-open]');
        if (openBtn) {
            const item = openBtn.closest('.comment-item');
            const box = item.querySelector('.reply-box');
            const willOpen = box.hidden;

            // 답글 입력창 열고 닫기
            box.hidden = !willOpen;
            openBtn.textContent = willOpen ? '답글 닫기' : '답글';

            // 열릴 때 입력창으로 포커스 이동
            if (willOpen) {
                const input = item.querySelector('.reply-input');
                if (input) input.focus();
            }
            return;
        }

        const submitBtn = e.target.closest('[data-reply-submit]');
        if (submitBtn) {
            const item = submitBtn.closest('.comment-item');
            const input = item.querySelector('.reply-input');
            const list = item.querySelector('.reply-list');
            const text = input.value.trim();

            // 공백만 입력된 경우 등록하지 않음
            if (!text) return;

            // 현재 날짜를 yyyy.mm.dd 형식으로 생성
            const now = new Date();
            const date = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;

            // 답글 구조 추가
            list.insertAdjacentHTML('beforeend', `
                <li class="reply-item">
                    <div class="reply-head">
                        <div class="reply-user">
                            <span class="avatar sm">AD</span>
                            <span class="name">관리자</span>
                        </div>
                        <time class="date">${date}</time>
                    </div>
                    <p class="reply-text"></p>
                    <button type="button" class="btn-reply btn-del">삭제</button>
                </li>
            `);

            // 입력한 답글 텍스트 삽입
            // textContent를 사용해 HTML이 그대로 실행되지 않도록 처리
            list.lastElementChild.querySelector('.reply-text').textContent = text;

            // 입력창 초기화
            input.value = '';

            // 글자 수 표시도 초기화
            const limitEl = item.querySelector('.reply-limit');
            if (limitEl) limitEl.textContent = '0 / 200';
        }
    },

    // 답글 입력창 글자 수 제한 및 카운트 표시
    handleReplyInputCount(e) {
        const ta = e.target.closest('.reply-input');
        if (!ta) return;

        const item = ta.closest('.comment-item');
        const limitEl = item.querySelector('.reply-limit');

        // 답글은 최대 200자까지만 허용
        const v = ta.value.slice(0, 200);

        if (v !== ta.value) ta.value = v;
        if (limitEl) limitEl.textContent = `${ta.value.length} / 200`;
    },



    // 댓글 등록
    addComment() {
        const text = this.el.comment_input.value.trim();
        if (!text) return;

        // 현재 날짜 생성
        const now = new Date();
        const date = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;

        // 댓글 구조 추가
        this.el.comment_list.insertAdjacentHTML('beforeend', `
            <li class="comment-item">
                <div class="comment-head">
                    <div class="comment-user">
                        <span class="avatar sm">AD</span>
                        <span class="name">관리자</span>
                    </div>
                    <time class="date">${date}</time>
                </div>
                <p class="comment-text"></p>
                <div class="comment-actions">
                    <button type="button" class="btn-reply" data-reply-open>답글</button><b> /</b>
                    <button type="button" class="btn-reply btn-del">삭제</button>
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
        `);

        // 마지막에 추가된 댓글의 본문에 사용자 입력값 삽입
        this.el.comment_list.lastElementChild.querySelector('.comment-text').textContent = text;

        // 댓글 입력창 초기화
        this.el.comment_input.value = '';

        // 댓글 글자 수 표시 초기화
        const limit = document.querySelector('.limit');
        if (limit) limit.textContent = '0 / 200';

        // 댓글 수 다시 계산
        this.updateCommentCount();
    },

    // 리뷰 수정 모달에서 입력한 제목, 본문, 태그를 실제 리뷰 화면에 반영
    applyReviewEdit() {
        this.el.rev_title.textContent = this.el.field__textarea_title.value;
        this.el.rev_text.innerText = this.el.field__textarea_text.value;

        const tagsWrap = document.querySelector('.tags');

        // 모달에서 체크된 체크박스 값만 배열로 수집
        const checked = [...document.querySelectorAll('[data-modal] .checks input[type="checkbox"]:checked')]
            .map((chk) => chk.value.trim());

        // 기존 태그 비우기
        tagsWrap.innerHTML = '';

        // 체크된 값으로 태그 다시 생성
        checked.forEach((word) => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = word;
            tagsWrap.appendChild(span);
        });
    },

    // 리뷰 본문 textarea 글자 수 제한 및 카운트 표시
    handleReviewTextCount(e) {
        const ta = e.target.closest('.field__textarea_text');
        if (!ta) return;

        const field = ta.closest('.field');
        const limitEl = field.querySelector('.reply-limit');

        // 리뷰 본문은 최대 1000자까지만 허용
        const v = ta.value.slice(0, 1000);

        if (v !== ta.value) ta.value = v;
        if (limitEl) limitEl.textContent = `${ta.value.length} / 1000`;
    },

    // 현재 리뷰에 표시된 태그를 읽어서 모달 체크박스 상태와 맞춤
    syncTagsToModalChecks() {
        const tags = [...document.querySelectorAll('.tags .tag')]
            .map((el) => el.textContent.trim());

        const checks = document.querySelectorAll('[data-modal] .checks input[type="checkbox"]');

        checks.forEach((chk) => {
            chk.checked = tags.includes(chk.value);
        });
    },

    // 도움돼요 숫자 1 증가
    increaseLike() {
        const spl = this.el.act.textContent.split(' ');
        spl[1]++;
        this.el.act.textContent = `${spl[0]} ${spl[1]}`;
    }
};