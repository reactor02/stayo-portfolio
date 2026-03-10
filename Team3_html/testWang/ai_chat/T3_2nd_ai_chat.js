// =========================================
//  AI 상담사 위젯 전용 JS
//  파일명: T3_2nd_ai_chat.js
//
//  의존성: 없음 (단독 동작)
//  연동 HTML: T3_2nd_ai_chat.html 의 두 div 필요
//  연동 CSS : T3_2nd_ai_chat.css
// =========================================

document.addEventListener('DOMContentLoaded', function () {

    // ── Groq API 설정 ──
    const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
    const API_KEY = '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';
    const SYSTEM_INSTRUCTION = "당신은 'STAYO'의 친절한 숙박 예약 상담원입니다. 숙박, 여행, 예약 관련 질문에만 답하세요. 답변은 항상 친절하게 '~요'체로 끝내주세요.";

    // 멀티턴 히스토리 (system 메시지 포함)
    const chatHistory = [
        { role: 'system', content: SYSTEM_INSTRUCTION }
    ];

    // ── DOM 참조 ──
    const trigger        = document.querySelector('#ai-trigger');
    const chatContainer  = document.querySelector('#ai-chat-container');
    const closeBtn       = document.querySelector('#ai-close-btn');
    const chatBox        = document.querySelector('#ai-chat-box');
    const promptInput    = document.querySelector('#ai-prompt');
    const askBtn         = document.querySelector('#ai-ask-btn');

    // ── 창 열기 / 닫기 ──
    trigger.addEventListener('click', () => {
        chatContainer.style.display = 'flex';
        trigger.style.display = 'none';
    });

    closeBtn.addEventListener('click', () => {
        chatContainer.style.display = 'none';
        trigger.style.display = 'flex';
    });

    // ── 메시지 말풍선 추가 ──
    function appendMessage(role, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${role}`;
        msgDiv.innerHTML = `<div class="bubble">${text}</div>`;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // ── Groq API 통신 (멀티턴) ──
    async function handleChat() {
        const text = promptInput.value.trim();
        if (!text || askBtn.disabled) return;

        appendMessage('user', text);
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
                    model: 'llama-3.3-70b-versatile',
                    messages: chatHistory,
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

            if (data.choices && data.choices.length > 0) {
                const aiText = data.choices[0].message.content;
                appendMessage('assistant', aiText);
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

    // ── 전송 버튼 / Enter 키 ──
    askBtn.addEventListener('click', handleChat);

    promptInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        }
    });

});
