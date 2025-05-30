document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    const products = JSON.parse(localStorage.getItem('products')) || [];
    let chats = JSON.parse(localStorage.getItem('chats')) || [];
    
    // URL პარამეტრებიდან პროდუქტის ID-ის მოპოვება
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');
    
    // პროდუქტის მოძებნა
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        alert('პროდუქტი არ მოიძებნა');
        window.location.href = 'index.html';
        return;
    }
    
    // DOM ელემენტები
    const productImage = document.getElementById('chat-product-image');
    const productTitle = document.getElementById('chat-product-title');
    const productPrice = document.getElementById('chat-product-price');
    const sellerAvatar = document.getElementById('seller-avatar');
    const sellerName = document.getElementById('seller-name');
    const messagesContainer = document.getElementById('messages-container');
    const messageInput = document.getElementById('message-input');
    const sendMessageBtn = document.getElementById('send-message-btn');
    
    // ინიციალიზაცია
    initChat();
    
    function initChat() {
        if (!currentUser) {
            alert('გთხოვთ გაიაროთ ავტორიზაცია');
            window.location.href = 'index.html';
            return;
        }
        
        // პროდუქტის ინფორმაციის დაყენება
        productImage.src = product.images[0] || 'https://via.placeholder.com/60';
        productTitle.textContent = product.title;
        productPrice.textContent = `${product.price} ₾`;
        sellerName.textContent = product.seller;
        
        // ჩეთის მოძებნა ან ახლის შექმნა
        let chat = chats.find(c => 
            c.productId === productId && 
            (c.buyerId === currentUser.id || c.sellerId === currentUser.id)
        );
        
        if (!chat) {
            // ახალი ჩეთის შექმნა
            chat = {
                id: Date.now().toString(),
                productId,
                productTitle: product.title,
                productImage: product.images[0],
                sellerId: product.sellerId,
                sellerName: product.seller,
                buyerId: currentUser.id,
                buyerName: currentUser.name,
                messages: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            chats.push(chat);
            localStorage.setItem('chats', JSON.stringify(chats));
            
            // ელფოსტის გაგზავნის სიმულაცია
            simulateEmailNotification(chat);
        }
        
        // ჩეთის ჩატვირთვა
        loadChat(chat);
        
        // მესიჯის გაგზავნა
        sendMessageBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    function loadChat(chat) {
        // გასუფთავება
        messagesContainer.innerHTML = '';
        
        // შეტყობინებების დამატება
        chat.messages.forEach(message => {
            addMessageToChat(message, message.senderId === currentUser.id);
        });
        
        // სქროლირება ბოლოში
        scrollToBottom();
    }
    
    function addMessageToChat(message, isCurrentUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isCurrentUser ? 'sent' : 'received'}`;
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${message.text}</p>
                <span class="message-time">${formatTime(message.timestamp)}</span>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
    }
    
    function sendMessage() {
        const text = messageInput.value.trim();
        
        if (!text) return;
        
        // ახალი შეტყობინების შექმნა
        const newMessage = {
            id: Date.now().toString(),
            text,
            senderId: currentUser.id,
            senderName: currentUser.name,
            timestamp: new Date().toISOString()
        };
        
        // ჩეთის მოძებნა
        const chatIndex = chats.findIndex(c => 
            c.productId === productId && 
            (c.buyerId === currentUser.id || c.sellerId === currentUser.id)
        );
        
        if (chatIndex !== -1) {
            // შეტყობინების დამატება
            chats[chatIndex].messages.push(newMessage);
            chats[chatIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('chats', JSON.stringify(chats));
            
            // UI-ზე დამატება
            addMessageToChat(newMessage, true);
            
            // ინფუთის გასუფთავება
            messageInput.value = '';
            
            // ელფოსტის გაგზავნის სიმულაცია (თუ მიმდინარე მომხმარებელი არის მყიდველი)
            if (currentUser.id === chats[chatIndex].buyerId) {
                simulateEmailNotification(chats[chatIndex]);
            }
        }
    }
    
    function simulateEmailNotification(chat) {
        // რეალურ აპლიკაციაში ეს იქნება API მოთხოვნა
        console.log(`ელფოსტა გაგზავნილია ${chat.sellerName}-ს (${chat.sellerId}) პროდუქტისთვის "${chat.productTitle}"`);
    }
    
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
});
