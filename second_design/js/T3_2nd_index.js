window.addEventListener('load', bind);

function bind() {

    // ──────────────────────────────────────────────
    // 팝업창 기능 구현
    // ──────────────────────────────────────────────
    const pNumber = document.getElementById("pNumber");
    const realNumber = document.getElementById("realNumber");
    const popup = document.getElementById("popup");
    const minusBtn = document.getElementById("minusBtn");
    const pCount = document.getElementById("pCount");
    const plusBtn = document.getElementById("plusBtn");
    const confirmBtn = document.getElementById("confirmBtn");
    const hearts = document.querySelectorAll("svg.heart");

    // heart 색변경 및 찜버튼에 정보전달
    hearts.forEach(heart => {
        heart.addEventListener("click", function (e) {
            e.stopPropagation();
            this.classList.toggle("active");
        });
    });

    let count = 0;

    pNumber.addEventListener("click", (e) => {
        e.stopPropagation();
        popup.style.display = "block";
    });

    popup.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    document.addEventListener("click", () => {
        popup.style.display = "none";
    });

    minusBtn.addEventListener("click", () => {
        if (Number(pCount.textContent) <= 0) {
            pCount.textContent = 0;
        } else {
            pCount.textContent = Number(pCount.textContent) - 1;
            count = Number(pCount.textContent);
        }
    });

    plusBtn.addEventListener("click", () => {
        pCount.textContent = Number(pCount.textContent) + 1;
        count = Number(pCount.textContent);
    });

    confirmBtn.addEventListener("click", () => {
        pNumber.value = `성인 ${count}명`;
        realNumber.value = count;
        popup.style.display = "none";
    });

    // ──────────────────────────────────────────────
    // 날짜 선택
    // ──────────────────────────────────────────────
    const date1 = document.getElementById('date1');
    const date2 = document.getElementById('date2');
    const text1 = document.getElementById('text1');
    const text2 = document.getElementById('text2');

    const today = new Date().toISOString().split('T')[0];
    date1.min = today;
    date2.min = today;

    date1.addEventListener('change', function () {
        const val = this.value;
        if (!val) return;

        text1.style.display = 'none';
        this.style.color = '#111';

        const next = new Date(val);
        next.setDate(next.getDate() + 1);
        date2.min = next.toISOString().split('T')[0];

        if (date2.value && date2.value <= val) {
            date2.value = '';
            text2.style.display = '';
            date2.style.color = 'transparent';
        }
    });

    date2.addEventListener('change', function () {
        if (!this.value) return;
        text2.style.display = 'none';
        this.style.color = '#111';
    });

    // ──────────────────────────────────────────────
    // AI 챗봇 (멀티턴)
    // ⚠️ DOMContentLoaded 제거 → load 콜백 안에서 바로 실행
    // ──────────────────────────────────────────────
    const API_KEY = 'AIzaSyDDh6S0C3xUBccRyslV-QsxGgN4H11wLDk'; // .trim()은 생략해도 무방합니다.
    const FINAL_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    const SYSTEM_INSTRUCTION = "당신은 'STAYO'의 친절한 숙박 예약 상담원입니다. 숙박, 여행, 예약 관련 질문에만 답하세요. 답변은 항상 친절하게 '~요'체로 끝내주세요.";

    const chatHistory = [];
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

    // AI 통신 (멀티턴)
    async function handleChat() {
        const text = promptInput.value.trim();
        if (!text || askBtn.disabled) return;

        // 사용자 메시지 UI 추가 및 히스토리 저장
        appendMessage('user', text);
        chatHistory.push({ role: 'user', parts: [{ text }] });

        promptInput.value = '';
        askBtn.disabled = true;

        try {
            const response = await fetch(`${FINAL_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
                    contents: chatHistory
                })
            });

            const data = await response.json();

            // ✅ HTTP 상태 코드 확인 (400, 429 에러 대응)
            if (!response.ok) {
                console.error('API 상세 에러:', data);

                if (response.status === 429) {
                    appendMessage('model', '현재 대화 요청이 너무 많아요. 1분만 기다렸다가 다시 말을 걸어주세요!');
                } else if (response.status === 400) {
                    appendMessage('model', '메시지 형식이 잘못되었거나 API 설정에 문제가 있어요.');
                } else {
                    appendMessage('model', `오류가 발생했어요. (코드: ${response.status})`);
                }
                return; // 에러 발생 시 이후 로직 중단
            }

            // ✅ 정상 응답 처리
            if (data.candidates && data.candidates.length > 0) {
                const aiText = data.candidates[0].content.parts[0].text;
                appendMessage('model', aiText);

                // AI 답변을 히스토리에 추가하여 문맥 유지
                chatHistory.push({ role: 'model', parts: [{ text: aiText }] });
            } else {
                appendMessage('model', '답변을 생성하지 못했습니다. 다시 한 번 말씀해 주시겠어요?');
            }

        } catch (error) {
            console.error('네트워크 또는 시스템 오류:', error);
            appendMessage('model', '연결이 원활하지 않습니다. 인터넷 상태를 확인해 주세요.');
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
// 카테고리 버튼 활성화
// ──────────────────────────────────────────────
    const categoryBtns = document.querySelectorAll('.category-btn');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function () {

            // 모든 버튼에서 active 제거
            categoryBtns.forEach(el => el.classList.remove('active'));

            // 클릭한 버튼에만 active 추가
            this.classList.add('active');
        });
    });
}