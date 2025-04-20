const askButton = document.getElementById('ask-btn');
const questionInput = document.getElementById('question');
const chatHistory = document.getElementById('chat-history');
const saveButton = document.getElementById('save-btn');
const loadButton = document.getElementById('load-btn');
const voiceButton = document.getElementById('voice-btn');

const API_KEY = 'API';
const MODEL = 'anthropic/claude-3-sonnet';

// Initialize speech recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.continuous = false;
recognition.interimResults = false;

recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    questionInput.value = transcript;
};

recognition.onerror = function(event) {
    console.error('Speech recognition error:', event.error);
};

function appendMessage(content, sender = 'bot') {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);

    if (sender === 'bot') {
        const markdownContent = marked.parse(content);
        messageDiv.innerHTML = `<div class="markdown-content">${markdownContent}</div>`;
    } else {
        messageDiv.textContent = content;
    }

    if (sender === 'user') {
        messageDiv.style.textAlign = 'right';
        messageDiv.style.marginLeft = 'auto';
    } else {
        messageDiv.style.textAlign = 'left';
        messageDiv.style.marginRight = 'auto';
    }

    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

async function handleAsk() {
    const question = questionInput.value.trim();
    if (!question) return;

    appendMessage(question, 'user');
    questionInput.value = '';

    try {
        const response = await fetch('https://openrouter.ai/api/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: MODEL,
                prompt: question,
                max_tokens: 500,
            }),
        });

        const data = await response.json();

        if (data.choices && data.choices[0].text) {
            appendMessage(data.choices[0].text.trim(), 'bot');
        } else {
            appendMessage('Error: No response from the model.', 'bot');
        }
    } catch (error) {
        appendMessage('Error: Unable to fetch response. Please try again.', 'bot');
    }
}

function saveChat() {
    // Logic to save chat
}

function loadChat() {
    // Logic to load chat
}

voiceButton.addEventListener('click', function() {
    recognition.start();
});

askButton.addEventListener('click', handleAsk);
saveButton.addEventListener('click', saveChat);
loadButton.addEventListener('click', loadChat);

// Trigger askButton functionality by pressing Enter
questionInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        handleAsk(); // Trigger the askButton functionality
        event.preventDefault(); // Prevent default behavior (new line)
    }
});

// Disable right-click context menu
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

// Disable F12, Ctrl+Shift+I, and Ctrl+U
document.addEventListener('keydown', function(event) {
    if (event.key === 'F12' || 
        (event.ctrlKey && event.shiftKey && event.key === 'I') || 
        (event.ctrlKey && event.key === 'u')) {
        event.preventDefault();
    }
});
