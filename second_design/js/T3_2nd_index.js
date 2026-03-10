window.addEventListener('load', bind);

async function bind() {

    // ──────────────────────────────────────────────
    // 1. 팝업창 기능 구현
    // ──────────────────────────────────────────────
    const pNumber = document.getElementById("pNumber");
    const realNumber = document.getElementById("realNumber");
    const popup = document.getElementById("popup");
    const minusBtn = document.getElementById("minusBtn");
    const pCount = document.getElementById("pCount");
    const plusBtn = document.getElementById("plusBtn");
    const confirmBtn = document.getElementById("confirmBtn");
    const hearts = document.querySelectorAll("svg.heart");

    // 정적 하트(HTML에 직접 작성된 요소)용 이벤트
    hearts.forEach(heart => {
        heart.addEventListener("click", function (e) {
            e.stopPropagation();
            this.classList.toggle("active");
        });
    });

    let count = 2;
    pCount.textContent = count;

    // 팝업 열기/닫기 (class 방식)
    pNumber.addEventListener("click", (e) => {
        e.stopPropagation();
        popup.classList.toggle("open");
    });

    popup.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    document.addEventListener("click", () => {
        popup.classList.remove("open");
    });

    minusBtn.addEventListener("click", () => {
        if (count > 1) {
            count--;
            pCount.textContent = count;
        }
    });

    plusBtn.addEventListener("click", () => {
        count++;
        pCount.textContent = count;
    });

    confirmBtn.addEventListener("click", () => {
        pNumber.value = `성인 ${count}명`;
        realNumber.value = count;
        popup.classList.remove("open");
    });

    // ──────────────────────────────────────────────
    // 2. 날짜 선택
    // ──────────────────────────────────────────────
    const date1 = document.getElementById('date1');
    const date2 = document.getElementById('date2');
    const box1 = document.getElementById('box1');
    const box2 = document.getElementById('box2');
    const dv1 = document.getElementById('dv1');
    const dv2 = document.getElementById('dv2');

    const today = new Date().toISOString().split('T')[0];
    date1.min = today;
    date2.min = today;

    // 날짜를 "2025.06.15" 형식으로 포맷
    function formatDate(val) {
        const [y, m, d] = val.split('-');
        return `${y}.${m}.${d}`;
    }

    // 박스 클릭 → 달력 열기
    box1.addEventListener('click', () => date1.showPicker?.());
    box2.addEventListener('click', () => date2.showPicker?.());

    // 체크인 날짜 확정
    date1.addEventListener('change', function () {
        const val = this.value;
        if (!val) return;

        dv1.textContent = formatDate(val);
        box1.classList.add('has-value');

        const next = new Date(val);
        next.setDate(next.getDate() + 1);
        date2.min = next.toISOString().split('T')[0];

        if (date2.value && date2.value <= val) {
            date2.value = '';
            dv2.textContent = '';
            box2.classList.remove('has-value');
        }

        setTimeout(() => date2.showPicker?.(), 50);
    });

    // 체크아웃 날짜 확정
    date2.addEventListener('change', function () {
        const val = this.value;
        if (!val) return;
        dv2.textContent = formatDate(val);
        box2.classList.add('has-value');
    });

    // ──────────────────────────────────────────────
    // 3. AI 챗봇 (멀티턴) - Groq API (무료)
    // ──────────────────────────────────────────────
    const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
    const API_KEY = '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';  // 🔑 https://console.groq.com 에서 무료 발급
    const SYSTEM_INSTRUCTION = "당신은 'STAYO'의 친절한 숙박 예약 상담원입니다. 숙박, 여행, 예약 관련 질문에만 답하세요. 답변은 항상 친절하게 '~요'체로 끝내주세요.";

    // ✅ Groq는 system 메시지를 history 맨 앞에 포함시키는 방식
    const chatHistory = [
        { role: 'system', content: SYSTEM_INSTRUCTION }
    ];

    const trigger = document.querySelector('#ai-trigger');
    const chatContainer = document.querySelector('#ai-chat-container');
    const closeBtn = document.querySelector('#ai-close-btn');
    const chatBox = document.querySelector('#ai-chat-box');
    const promptInput = document.querySelector('#ai-prompt');
    const askBtn = document.querySelector('#ai-ask-btn');

    // 창 열기 / 닫기
    trigger.addEventListener('click', () => {
        chatContainer.style.display = 'flex';
        trigger.style.display = 'none';
    });

    closeBtn.addEventListener('click', () => {
        chatContainer.style.display = 'none';
        trigger.style.display = 'flex';
    });

    // 메시지 추가
    function appendMessage(role, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${role}`;
        msgDiv.innerHTML = `<div class="bubble">${text}</div>`;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // AI 통신 (멀티턴) - Groq API
    async function handleChat() {
        const text = promptInput.value.trim();
        if (!text || askBtn.disabled) return;

        appendMessage('user', text);
        // ✅ OpenAI 호환 형식: { role, content }
        chatHistory.push({ role: 'user', content: text });

        promptInput.value = '';
        askBtn.disabled = true;

        try {
            const response = await fetch(GROQ_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',  // ✅ Groq 무료 모델
                    messages: chatHistory,              // ✅ 전체 히스토리 전송 (멀티턴 핵심)
                    max_tokens: 1024,
                    temperature: 0.7
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('API 상세 에러:', data);
                if (response.status === 429) {
                    appendMessage('assistant', '현재 요청이 너무 많아요. 잠시 후 다시 말을 걸어주세요!');
                } else {
                    appendMessage('assistant', `오류가 발생했어요. (코드: ${response.status})`);
                }
                return;
            }

            // ✅ Groq 응답 구조: data.choices[0].message.content
            if (data.choices && data.choices.length > 0) {
                const aiText = data.choices[0].message.content;
                appendMessage('assistant', aiText);
                // ✅ AI 응답도 history에 추가 (멀티턴 유지)
                chatHistory.push({ role: 'assistant', content: aiText });
            } else {
                appendMessage('assistant', '답변을 생성하지 못했습니다. 다시 한 번 말씀해 주시겠어요?');
            }

        } catch (error) {
            console.error('네트워크 또는 시스템 오류:', error);
            appendMessage('assistant', '연결이 원활하지 않습니다. 인터넷 상태를 확인해 주세요.');
        } finally {
            askBtn.disabled = false;
            promptInput.focus();
        }
    }

    askBtn.addEventListener('click', handleChat);

    promptInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        }
    });

    // ──────────────────────────────────────────────
    // 4 & 5. 카테고리 버튼 활성화 + 인기 숙소 카드 출력
    // ──────────────────────────────────────────────
    const categoryBtns = document.querySelectorAll('.category-btn');

    // ── 호텔 탭 전용 하드코딩 카드 (내용은 직접 채워주세요) ──
    const HARDCODED_HOTEL_CARD = `
        <a href="./T3_2nd_detail.html">
            <article class="card">
                <div class="card__media">
                    <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80
" alt="서울 중구 호텔 센트럴" />
                    <span class="badge badge--dark">할인 중</span>
                    <button class="wish" type="button" aria-label="찜하기">
                        <svg viewBox="0 0 24 24" class="heart" aria-hidden="true">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                            2 6 4 4 6.5 4
                            8.04 4 9.54 4.81 10.4 6.09
                            11.26 4.81 12.76 4 14.3 4
                            16.8 4 18.8 6 18.8 8.5
                            c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </button>
                </div>
                <div class="card__body">
                    <div class="card__title">서울 중구 호텔 센트럴</div>
                    <div class="card__meta">서울 · 중구</div>
                    <div class="card__row">
                        <div class="card__rating">
                            <span class="star">★</span> 4.8
                            <span class="count">10</span>
                        </div>
                        <div class="card__price">
                            ₩110,000 <span>/ 1박</span>
                        </div>
                    </div>
                    <div class="card__tags">
                        <span class="tag">기타 편의시설</span>
                    </div>
                </div>
            </article>
        </a>
    `;

    // 카드 HTML을 생성하는 헬퍼 함수
    function createCardHTML(item) {
        return `
            <a href="./T3_2nd_detail.html">
                <article class="card">
                    <div class="card__media">
                        <img src="${item.thumbnail}" alt="${item.name}" />
                        <span class="badge badge--dark">할인 중</span>
                        <button class="wish" type="button" aria-label="찜하기">
                            <svg viewBox="0 0 24 24" class="heart" aria-hidden="true">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                                2 6 4 4 6.5 4
                                8.04 4 9.54 4.81 10.4 6.09
                                11.26 4.81 12.76 4 14.3 4
                                16.8 4 18.8 6 18.8 8.5
                                c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </button>
                    </div>
                    <div class="card__body">
                        <div class="card__title">${item.name}</div>
                        <div class="card__meta">${item.city} · ${item.district}</div>
                        <div class="card__row">
                            <div class="card__rating">
                                <span class="star">★</span> ${item.rating}
                                <span class="count">${item.reviewCount}</span>
                            </div>
                            <div class="card__price">
                                ₩${item.priceFrom.toLocaleString()} <span>/ 1박</span>
                            </div>
                        </div>
                        <div class="card__tags">
                            <span class="tag">기타 편의시설</span>
                        </div>
                    </div>
                </article>
            </a>
        `;
    }

    // 숙소 리스트를 그리는 함수
    async function loadLodgings(type = '호텔') {
        try {
            const isHotel = type === '호텔';

            // 호텔이면 하드코딩 1개 자리를 빼고 API에서 5개만 요청
            const apiPageSize = isHotel ? 5 : 6;

            const listRes = await API.V1.TB.Lodging.properties({
                q: type,
                page: 2,
                pageSize: apiPageSize
            });

            const result_grid = document.querySelector('.result-grid');

            // 기존 카드 전부 제거
            result_grid.innerHTML = '';

            // 데이터가 없을 경우 처리
            if (!listRes.items || listRes.items.length === 0) {
                result_grid.innerHTML = '<p>조회된 숙소가 없습니다.</p>';
                return;
            }

            // 호텔 탭: 하드코딩 카드를 맨 앞에 삽입 후 API 카드 5개 추가 → 총 6개
            if (isHotel) {
                result_grid.innerHTML = HARDCODED_HOTEL_CARD;
            }

            // API에서 받아온 카드 추가
            listRes.items.forEach((item) => {
                result_grid.innerHTML += createCardHTML(item);
            });

        } catch (error) {
            console.error('숙소 로딩 실패:', error);
            document.querySelector('.result-grid').innerHTML = '<p>데이터를 불러오는 중 오류가 발생했습니다.</p>';
        }
    }

    // 카테고리 버튼 클릭 이벤트 연결 (4번 섹션 수정)
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // UI 활성화 변경
            categoryBtns.forEach(el => el.classList.remove('active'));
            this.classList.add('active');

            // 버튼 텍스트 가져오기 (예: "호텔", "펜션")
            const selectedType = this.querySelector('.category__label').textContent.trim();

            // 해당 타입으로 데이터 다시 불러오기
            loadLodgings(selectedType);
        });
    });

    // 초기 페이지 로딩 시 '호텔' 데이터 출력
    loadLodgings('호텔');

    // 동적 생성 카드의 하트 이벤트 위임
    const resultGrid = document.querySelector('.result-grid');
    resultGrid.addEventListener('click', function (e) {
        const wishBtn = e.target.closest('.wish');
        if (!wishBtn) return;
        e.preventDefault();
        e.stopPropagation();
        const heart = wishBtn.querySelector('.heart');
        if (heart) heart.classList.toggle('active');
    });

    // ──────────────────────────────────────────────
    // 6. 인기 여행지 캐러셀 (무한 루프)
    // 구조: [가짜3] [진짜1] [진짜2] [진짜3] [가짜1]
    //  인덱스:  0       1       2       3       4
    // ──────────────────────────────────────────────
    const destTrack = document.querySelector('.dest-carousel__track');
    const destSlides = document.querySelectorAll('.dest-carousel__slide');
    // 진짜 슬라이드 수 = 전체 - 2 (앞뒤 가짜 각 1개)
    const DEST_REAL_COUNT = destSlides.length - 2; // 3

    const destPrev = document.querySelector('.dest-carousel__btn--prev');
    const destNext = document.querySelector('.dest-carousel__btn--next');
    const destDots = document.querySelectorAll('.dest-dot');
    const destIndicatorBox = document.querySelector('.dest-carousel__indicator');

    // 시작 인덱스: 진짜 슬라이드 1번(index=1)에서 시작
    let destIndex = 1;

    // 초기 위치 설정 (transition 없이 바로 이동)
    destTrack.style.transition = 'none';
    destTrack.style.transform = 'translateX(-' + (100 * destIndex) + '%)';

    // 인디케이터 업데이트
    function destUpdateIndicator(dotIndex) {
        destDots.forEach(function (dot) {
            dot.classList.remove('dest-dot--active');
        });
        if (destDots[dotIndex]) {
            destDots[dotIndex].classList.add('dest-dot--active');
        }
    }

    // 현재 destIndex → 점 인덱스 계산 (가짜 슬라이드 보정)
    function destGetDotIndex() {
        if (destIndex === 0) return DEST_REAL_COUNT - 1;              // 가짜 앞 → 마지막 점
        if (destIndex === destSlides.length - 1) return 0;            // 가짜 뒤 → 첫 번째 점
        return destIndex - 1;                                          // 진짜: 0-based
    }

    // 초기 인디케이터
    destUpdateIndicator(destGetDotIndex());

    // ── 다음 슬라이드 ──
    function destMove() {
        destIndex++;

        destTrack.style.transition = '0.5s';
        destTrack.style.transform = 'translateX(-' + (100 * destIndex) + '%)';

        // 가짜 뒤(슬라이드1 복사)에 도달 → 진짜 슬라이드1로 순간 점프
        if (destIndex === destSlides.length - 1) {
            setTimeout(function () {
                destTrack.style.transition = 'none';
                destIndex = 1;
                destTrack.style.transform = 'translateX(-100%)';
                destUpdateIndicator(0);
            }, 500);
        } else {
            destUpdateIndicator(destGetDotIndex());
        }
    }

    // 자동 재생
    let destAuto = setInterval(destMove, 3000);

    // ── 다음 버튼 ──
    destNext.addEventListener('click', function () {
        clearInterval(destAuto);
        destMove();
        destAuto = setInterval(destMove, 3000);
    });

    // ── 이전 버튼 ──
    destPrev.addEventListener('click', function () {
        clearInterval(destAuto);

        destIndex--;

        destTrack.style.transition = '0.5s';
        destTrack.style.transform = 'translateX(-' + (100 * destIndex) + '%)';

        // 가짜 앞(슬라이드3 복사)에 도달 → 진짜 슬라이드3으로 순간 점프
        if (destIndex === 0) {
            setTimeout(function () {
                destTrack.style.transition = 'none';
                destIndex = DEST_REAL_COUNT; // 진짜 마지막(index = 3)
                destTrack.style.transform = 'translateX(-' + (100 * destIndex) + '%)';
                destUpdateIndicator(DEST_REAL_COUNT - 1);
            }, 500);
        } else {
            destUpdateIndicator(destGetDotIndex());
        }

        destAuto = setInterval(destMove, 3000);
    });

    // ── 인디케이터 클릭 ──
    destIndicatorBox.addEventListener('click', function (e) {
        const dot = e.target.closest('.dest-dot');
        if (!dot) return;

        const dotIdx = Array.from(destDots).indexOf(dot);
        if (dotIdx === -1) return;

        clearInterval(destAuto);

        destIndex = dotIdx + 1; // 가짜 앞 보정

        destTrack.style.transition = 'none';
        destTrack.style.transform = 'translateX(-' + (100 * destIndex) + '%)';

        destUpdateIndicator(dotIdx);

        destAuto = setInterval(destMove, 3000);
    });

}
