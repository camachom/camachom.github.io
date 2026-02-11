(function() {
  let conversationHistory = [];
  const API_URL = window.CHATBOT_API_URL;

  const toggle = document.getElementById('chatbot-toggle');
  const container = document.getElementById('chatbot-container');
  const close = document.getElementById('chatbot-close');
  const form = document.getElementById('chatbot-form');
  const input = document.getElementById('chatbot-input');
  const messages = document.getElementById('chatbot-messages');

  if (!toggle || !container) return;

  toggle.addEventListener('click', function() {
    container.classList.remove('chatbot-hidden');
    toggle.classList.add('chatbot-hidden');
    input.focus();
  });

  close.addEventListener('click', function() {
    container.classList.add('chatbot-hidden');
    toggle.classList.remove('chatbot-hidden');
  });

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const message = input.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    input.value = '';
    input.disabled = true;

    const loading = addMessage('...', 'bot');

    try {
      conversationHistory.push({
        role: "user",
        content: message
      })
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      const data = await response.json();

      if (response.ok && data && data[0] && data[0].text) {
        loading.textContent = data[0].text;
        conversationHistory.push({
          role: "assistant",
          content: data[0].text
        })
        
      } else if (data.error) {
        loading.textContent = 'Sorry, ' + data.error.toLowerCase();
      } else {
        loading.textContent = response.ok ? 'Sorry, I couldn\'t understand the response.' : 'Sorry, something went wrong.';
      }
    } catch (err) {
      loading.textContent = 'Sorry, something went wrong. Please try again.';
    }

    input.disabled = false;
    input.focus();
  });

  function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = 'chatbot-message chatbot-' + type;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }
})();
