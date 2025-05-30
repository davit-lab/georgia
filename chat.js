// Chat Widget
const chatIcon = document.querySelector('.chat-icon');
const chatWidget = document.querySelector('.chat-widget');
const closeChat = document.querySelector('.close-chat');
const chatMessages = document.querySelector('.chat-messages');
const chatInput = document.querySelector('.chat-input input');
const chatSendBtn = document.querySelector('.chat-input button');

let chatOpen = false;

// Toggle Chat
chatIcon.addEventListener('click', () => {
    chatOpen = !chatOpen;
    chatWidget.style.display = chatOpen ? 'flex' : 'none';
});

closeChat.addEventListener('click', () => {
    chatOpen = false;
    chatWidget.style.display = 'none';
});

// Send Message
function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        // Add user message
        addMessage('თქვენ', message, 'user');
        
        // Simulate bot response after a delay
        setTimeout(() => {
            addMessage('ოპერატორი', 'გამარჯობა! როგორ შემიძლია დაგეხმაროთ?', 'bot');
        }, 1000);
        
        chatInput.value = '';
    }
}

chatSendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Add Message to Chat
function addMessage(sender, text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <strong>${sender}:</strong> ${text}
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Initial bot greeting
setTimeout(() => {
    addMessage('ოპერატორი', 'გამარჯობა! როგორ შემიძლია დაგეხმაროთ?', 'bot');
}, 1500);
