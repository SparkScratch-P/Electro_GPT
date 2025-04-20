 const askButton = document.getElementById('ask-btn');
        const questionInput = document.getElementById('question');
        const chatHistory = document.getElementById('chat-history');

        const API_KEY = 'YOUR_API_KEY';
        const MODEL = 'openrouter/electronics';

        function appendMessage(content, sender = 'bot') {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', sender);

            if (sender === 'bot') {
                const markdownContent = marked.parse(content);
                messageDiv.innerHTML = `<div class="markdown-content">${markdownContent}</div>`;
            } else {
                messageDiv.textContent = content;
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
                        max_tokens: 200,
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

        askButton.addEventListener('click', handleAsk);

        questionInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                handleAsk();
            }
        });
        // Disable right-click
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });

        // Disable certain key combinations (e.g., F12, Ctrl+Shift+I, Ctrl+U)
        document.addEventListener('keydown', function(e) {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) || 
                (e.ctrlKey && e.key === 'U')) {
                e.preventDefault();
            }
        });
