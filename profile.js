document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const chats = JSON.parse(localStorage.getItem('chats')) || [];
    
    if (!currentUser) {
        alert('გთხოვთ გაიაროთ ავტორიზაცია');
        window.location.href = 'index.html';
        return;
    }
    
    // DOM ელემენტები
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const profilePhone = document.getElementById('profile-phone');
    const userProductsContainer = document.getElementById('user-products-container');
    const userChatsContainer = document.getElementById('user-chats-container');
    const addProductBtn = document.getElementById('add-product-btn');
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const editProfileModal = document.getElementById('edit-profile-modal');
    const editProfileForm = document.getElementById('edit-profile-form');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // ინიციალიზაცია
    initProfile();
    
    function initProfile() {
        // მომხმარებლის ინფორმაციის დაყენება
        profileName.textContent = currentUser.name;
        profileEmail.textContent = currentUser.email;
        profilePhone.textContent = currentUser.phone;
        
        // პროდუქტების ჩატვირთვა
        loadUserProducts();
        
        // ჩეთების ჩატვირთვა
        loadUserChats();
        
        // მოვლენების დამატება
        setupEventListeners();
    }
    
    function loadUserProducts() {
        userProductsContainer.innerHTML = '';
        
        const userProducts = products.filter(p => p.sellerId === currentUser.id);
        
        if (userProducts.length === 0) {
            userProductsContainer.innerHTML = '<p class="no-products">თქვენ არ გაქვთ გამოქვეყნებული პროდუქტები</p>';
            return;
        }
        
        userProducts.forEach(product => {
            const productCard = createUserProductCard(product);
            userProductsContainer.appendChild(productCard);
        });
    }
    
    function createUserProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <img src="${product.images[0] || 'https://via.placeholder.com/300'}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">${product.price} ₾</p>
                <p class="product-description">${product.description}</p>
                <div class="product-actions">
                    <button class="edit-product-btn" data-product-id="${product.id}"><i class="fas fa-edit"></i> რედაქტირება</button>
                    <button class="delete-product-btn" data-product-id="${product.id}"><i class="fas fa-trash"></i> წაშლა</button>
                </div>
            </div>
        `;
        
        return card;
    }
    
    function loadUserChats() {
        userChatsContainer.innerHTML = '';
        
        const userChats = chats.filter(c => 
            c.buyerId === currentUser.id || c.sellerId === currentUser.id
        ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        
        if (userChats.length === 0) {
            userChatsContainer.innerHTML = '<p class="no-chats">თქვენ არ გაქვთ ჩეთები</p>';
            return;
        }
        
        userChats.forEach(chat => {
            const chatItem = createChatItem(chat);
            userChatsContainer.appendChild(chatItem);
        });
    }
    
    function createChatItem(chat) {
        const isSeller = chat.sellerId === currentUser.id;
        const otherPartyName = isSeller ? chat.buyerName : chat.sellerName;
        const lastMessage = chat.messages[chat.messages.length - 1];
        
        const item = document.createElement('div');
        item.className = 'chat-item';
        
        item.innerHTML = `
            <img src="${chat.productImage || 'https://via.placeholder.com/60'}" alt="პროდუქტი" class="chat-product-image">
            <div class="chat-info">
                <h4>${chat.productTitle}</h4>
                <p>${isSeller ? 'მყიდველი: ' : 'გამყიდველი: '}${otherPartyName}</p>
                <p class="last-message">${lastMessage ? lastMessage.text : 'შეტყობინებები არ არის'}</p>
                <p class="chat-time">${formatDate(chat.updatedAt)}</p>
            </div>
        `;
        
        item.addEventListener('click', () => {
            window.location.href = `chat.html?productId=${chat.productId}`;
        });
        
        return item;
    }
    
    function formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('ka-GE', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    function setupEventListeners() {
        // ჩანართების გადართვა
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(`${btn.dataset.tab}-tab`).classList.add('active');
            });
        });
        
        // პროდუქტის დამატება
        addProductBtn.addEventListener('click', () => {
            document.getElementById('add-product-modal').classList.add('active');
        });
        
        // პროფილის რედაქტირება
        editProfileBtn.addEventListener('click', () => {
            document.getElementById('edit-name').value = currentUser.name;
            document.getElementById('edit-email').value = currentUser.email;
            document.getElementById('edit-phone').value = currentUser.phone;
            editProfileModal.classList.add('active');
        });
        
        // მოდალური ფანჯრების დახურვა
        closeModalButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                editProfileModal.classList.remove('active');
            });
        });
        
        // პროფილის განახლება
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('edit-name').value;
            const email = document.getElementById('edit-email').value;
            const phone = document.getElementById('edit-phone').value;
            const password = document.getElementById('edit-password').value;
            const confirmPassword = document.getElementById('edit-confirm-password').value;
            
            // ვალიდაცია
            if (!name || !email || !phone) {
                alert('გთხოვთ შეავსოთ ყველა სავალდებულო ველი');
                return;
            }
            
            if (password && password !== confirmPassword) {
                alert('პაროლები არ ემთხვევა');
                return;
            }
            
            // მომხმარებლის განახლება
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            
            if (userIndex !== -1) {
                users[userIndex].name = name;
                users[userIndex].email = email;
                users[userIndex].phone = phone;
                
                if (password) {
                    users[userIndex].password = password;
                }
                
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
                
                // UI განახლება
                profileName.textContent = name;
                profileEmail.textContent = email;
                profilePhone.textContent = phone;
                
                // მოდალური ფანჯრის დახურვა
                editProfileModal.classList.remove('active');
                
                alert('პროფილი წარმატებით განახლდა!');
            }
        });
        
        // პროდუქტების წაშლა/რედაქტირება (დელეგირებული მოვლენები)
        userProductsContainer.addEventListener('click', function(e) {
            const productId = e.target.closest('button')?.dataset.productId;
            
            if (!productId) return;
            
            if (e.target.closest('.delete-product-btn')) {
                // პროდუქტის წაშლა
                if (confirm('დარწმუნებული ხართ, რომ გსურთ პროდუქტის წაშლა?')) {
                    const updatedProducts = products.filter(p => p.id !== productId);
                    localStorage.setItem('products', JSON.stringify(updatedProducts));
                    loadUserProducts();
                }
            } else if (e.target.closest('.edit-product-btn')) {
                // პროდუქტის რედაქტირება
                window.location.href = `edit-product.html?id=${productId}`;
            }
        });
    }
});
