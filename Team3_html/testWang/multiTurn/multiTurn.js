window.addEventListener('load', bind)
function bind(){
const API_KEY = 'AIzaSyDxsVRN2J_od8jbxNzdWeb_z7vXXQV8I5g'; // 실제 키 사용
const URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const chatHistory = { "contents": [] }; // 대화 데이터 누적용

const chatBox = document.querySelector('#chat-box');
const promptInput = document.querySelector('#prompt');
const askBtn = document.querySelector('#ask-btn');

// 화면에 메시지 말풍선을 추가하는 함수
function appendMessage(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;
    msgDiv.innerHTML = `<div class="bubble">${text}</div>`;
    chatBox.appendChild(msgDiv);
    
    // 자동 스크롤: 새 메시지가 추가되면 최하단으로 이동
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function handleChat() {
    const text = promptInput.value.trim();
    if (!text) return;

    // 1. 사용자 화면 반영 및 데이터 저장
    appendMessage('user', text);
    chatHistory.contents.push({ "role": "user", "parts": [{ "text": text }] });
    
    promptInput.value = '';
    askBtn.disabled = true;

    try {
        const response = await fetch(`${URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(chatHistory)
        });

        const data = await response.json();

        if (response.ok) {
            const aiText = data.candidates[0].content.parts[0].text;
            
            // 2. AI 화면 반영 및 데이터 저장 (멀티턴)
            appendMessage('model', aiText);
            chatHistory.contents.push({ "role": "model", "parts": [{ "text": aiText }] });
        } else {
            appendMessage('model', "죄송합니다. 오류가 발생했습니다.");
        }
    } catch (error) {
        appendMessage('model', "서버와 연결이 원활하지 않습니다.");
    } finally {
        askBtn.disabled = false;
    }
}

// 이벤트 연결
askBtn.addEventListener('click', handleChat);
promptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleChat();
    }
});
}


