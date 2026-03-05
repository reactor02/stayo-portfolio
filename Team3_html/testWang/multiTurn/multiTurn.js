window.addEventListener('load', () => {
    // 🔑 API 키를 여기에 입력하세요 (Google AI Studio에서 새로 발급 권장)
    const API_KEY = 'AIzaSyDxsVRN2J_od8jbxNzdWeb_z7vXXQV8I5g'.trim();

    const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
    const MODEL = 'gemini-3-flash-preview';  // ✅ preview 모델 (무료 할당량 제한 없음)
    const FINAL_URL = `${BASE_URL}/models/${MODEL}:generateContent`;

    // ✅ system instruction (contents 밖으로 분리)
    const SYSTEM_INSTRUCTION = "당신은 '친절한 숙박 예약 사이트 전문 상담원'입니다. 숙박 예약 관련 질문에만 상세히 답하고, 그 외의 질문에는 '죄송하지만 숙박 예약 관련 문의만 답변 가능합니다.'라고 정중히 거절하세요. 모든 답변은 '~요'체로 끝내주세요.";

    const chatHistory = [];
    const chatBox = document.querySelector('#chat-box');
    const promptInput = document.querySelector('#prompt');
    const askBtn = document.querySelector('#ask-btn');

    function appendMessage(role, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${role}`;
        msgDiv.innerHTML = `<div class="bubble">${text}</div>`;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function handleChat() {
        const text = promptInput.value.trim();
        if (!text) return;

        appendMessage('user', text);

        // ✅ 멀티턴: 사용자 메시지를 history에 추가
        chatHistory.push({
            "role": "user",
            "parts": [{ "text": text }]
        });

        promptInput.value = '';
        askBtn.disabled = true;

        try {
            const response = await fetch(FINAL_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': API_KEY  // ✅ 헤더 방식으로 API 키 전달
                },
                body: JSON.stringify({
                    // ✅ system_instruction을 contents 밖에 별도로 지정
                    "system_instruction": {
                        "parts": [{ "text": SYSTEM_INSTRUCTION }]
                    },
                    // ✅ 전체 대화 히스토리를 매번 전송 (멀티턴 핵심)
                    "contents": chatHistory,
                    "generationConfig": {
                        "temperature": 0.7,
                        "maxOutputTokens": 1024
                    }
                })
            });

            const data = await response.json();

            if (response.ok && data.candidates && data.candidates.length > 0) {
                const aiText = data.candidates[0].content.parts[0].text;
                appendMessage('model', aiText);

                // ✅ AI 응답도 history에 추가 (멀티턴 유지)
                chatHistory.push({
                    "role": "model",
                    "parts": [{ "text": aiText }]
                });
            } else {
                console.error("API 에러 상세:", JSON.stringify(data, null, 2));
                const errorMsg = data.error ? data.error.message : `상태 코드: ${response.status}`;
                appendMessage('model', `오류가 발생했습니다: ${errorMsg}`);
            }
        } catch (error) {
            console.error("네트워크 에러:", error);
            appendMessage('model', "서버 연결에 실패했습니다. 네트워크 상태를 확인해주세요.");
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

    

});