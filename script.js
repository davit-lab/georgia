// მთავარი აპლიკაციის ლოგიკა
document.addEventListener('DOMContentLoaded', function() {
    // მომხმარებლის სესიის მენეჯმენტი
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let chats = JSON.parse(localStorage.getItem('chats')) || [];
    
    // DOM ელემენტები
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const sellNowBtn = document.getElementById('sell-now-btn');
    const userDropdown = document.querySelector('.user-dropdown');
    const authButtons = document.querySelector('.auth-buttons');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const productsContainer = document.getElementById('products-container');
    
    // მოდალური ფანჯრები
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const otpModal = document.getElementById('otp-modal');
    const addProductModal = document.getElementById('add-product-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    
    // ფორმები
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const otpForm = document.getElementById('otp-form');
    const addProductForm = document.getElementById('add-product-form');
    
    // ინიციალიზაცია
    init();
    
    function init() {
        // შემოწმება არის თუ არა მომხმარებელი ავტორიზებული
        checkAuthStatus();
        
        // პროდუქტების ჩატვირთვა
        loadProducts();
        
        // მოვლენების დამატება
        setupEventListeners();
    }
    
    function checkAuthStatus() {
        if (currentUser) {
            // დამალვა ავტორიზაციის ღილაკები და ჩვენება მომხმარებლის მენიუ
            authButtons.style.display = 'none';
            userDropdown.classList.remove('hidden');
            
            // მომხმარებლის სახელის დაყენება
            document.querySelector('.username').textContent = currentUser.name;
        } else {
            authButtons.style.display = 'flex';
            userDropdown.classList.add('hidden');
        }
    }
    
    function loadProducts() {
        // გასუფთავება კონტეინერი
        productsContainer.innerHTML = '';
        
        // პროდუქტების დამატება
        products.forEach(product => {
            const productCard = createProductCard(product);
            productsContainer.appendChild(productCard);
        });
        
        // თუ პროდუქტები არ არის, დამატება შეტყობინება
        if (products.length === 0) {
            productsContainer.innerHTML = '<p class="no-products">პროდუქტები არ მოიძებნა. იყავი პირველი ვინც დაამატებს პროდუქტს!</p>';
        }
    }
    
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <img src="${product.images[0] || 'https://via.placeholder.com/300'}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">${product.price} ₾</p>
                <p class="product-description">${product.description}</p>
                <div class="product-seller">
                    <img src="https://via.placeholder.com/30" alt="გამყიდველი" class="seller-avatar">
                    <span class="seller-name">${product.seller}</span>
                </div>
                <button class="message-btn" data-product-id="${product.id}">მესიჯი გამყიდველს</button>
            </div>
        `;
        
        return card;
    }
    
    function setupEventListeners() {
        // მობილური მენიუს ღილაკი
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // ავტორიზაციის ღილაკები
        loginBtn.addEventListener('click', () => loginModal.classList.add('active'));
        registerBtn.addEventListener('click', () => registerModal.classList.add('active'));
        
        // მოდალური ფანჯრების დახურვა
        closeModalButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                loginModal.classList.remove('active');
                registerModal.classList.remove('active');
                otpModal.classList.remove('active');
                addProductModal.classList.remove('active');
            });
        });
        
        // მოდალური ფანჯრების გადართვა
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.remove('active');
            registerModal.classList.add('active');
        });
        
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            registerModal.classList.remove('active');
            loginModal.classList.add('active');
        });
        
        // გამოსვლა
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
        
        // პროდუქტის დამატება
        if (sellNowBtn) {
            sellNowBtn.addEventListener('click', () => {
                if (currentUser) {
                    addProductModal.classList.add('active');
                } else {
                    loginModal.classList.add('active');
                }
            });
        }
        
        // ფორმების დამუშავება
        loginForm.addEventListener('submit', handleLogin);
        registerForm.addEventListener('submit', handleRegister);
        otpForm.addEventListener('submit', handleOtpVerification);
        addProductForm.addEventListener('submit', handleAddProduct);
        
        // სურათების ატვირთვა
        const imageUpload = document.getElementById('product-images');
        const imagePreview = document.getElementById('image-preview');
        
        imageUpload.addEventListener('change', function() {
            imagePreview.innerHTML = '';
            const files = this.files;
            
            if (files.length > 5) {
                alert('მაქსიმუმ 5 სურათის ატვირთვა შეგიძლიათ');
                this.value = '';
                return;
            }
            
            for (let i = 0; i < Math.min(files.length, 5); i++) {
                const file = files[i];
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const previewDiv = document.createElement('div');
                    previewDiv.style.position = 'relative';
                    previewDiv.style.display = 'inline-block';
                    
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'preview-image';
                    
                    const removeBtn = document.createElement('span');
                    removeBtn.className = 'remove-image';
                    removeBtn.innerHTML = '&times;';
                    removeBtn.addEventListener('click', () => {
                        previewDiv.remove();
                        // აქ უნდა დავამატოთ ლოგიკა ფაილის წაშლისთვის
                    });
                    
                    previewDiv.appendChild(img);
                    previewDiv.appendChild(removeBtn);
                    imagePreview.appendChild(previewDiv);
                }
                
                reader.readAsDataURL(file);
            }
        });
        
        // პროდუქტის ბარათებზე მესიჯის ღილაკები
        productsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('message-btn')) {
                const productId = e.target.getAttribute('data-product-id');
                if (currentUser) {
                    // გადამისამართება ჩეთის გვერდზე
                    window.location.href = `chat.html?productId=${productId}`;
                } else {
                    loginModal.classList.add('active');
                }
            }
        });
    }
    
    function handleLogin(e) {
        e.preventDefault();
        
        const emailOrPhone = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // მარტივი ვალიდაცია
        if (!emailOrPhone || !password) {
            alert('გთხოვთ შეავსოთ ყველა ველი');
            return;
        }
        
        // მოდელირებული ავტორიზაცია
        setTimeout(() => {
            // აქ რეალურ აპლიკაციაში იქნება API მოთხოვნა
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => 
                (u.email === emailOrPhone || u.phone === emailOrPhone) && 
                u.password === password
            );
            
            if (user) {
                // წარმატებული ავტორიზაცია
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // OTP ვერიფიკაციის სიმულაცია
                simulateOtpVerification(user);
            } else {
                alert('არასწორი ელ.ფოსტა/ტელეფონი ან პაროლი');
            }
        }, 1000);
    }
    
    function simulateOtpVerification(user) {
        // გენერირება შემთხვევითი OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        
        // შენახვა localStorage-ში (რეალურ აპლიკაციაში ეს არ უნდა იყოს კლიენტის მხარეს)
        localStorage.setItem('otp', otp.toString());
        localStorage.setItem('otpUser', JSON.stringify(user));
        
        // ჩვენება OTP ფორმა
        loginModal.classList.remove('active');
        otpModal.classList.add('active');
        
        // სიმულაცია OTP გაგზავნის
        console.log(`OTP გაგზავნილია ${user.email} ან ${user.phone}: ${otp}`);
    }
    
    function handleOtpVerification(e) {
        e.preventDefault();
        
        const otpCode = document.getElementById('otp-code').value;
        const storedOtp = localStorage.getItem('otp');
        const storedUser = JSON.parse(localStorage.getItem('otpUser'));
        
        if (otpCode === storedOtp) {
            // წარმატებული ვერიფიკაცია
            currentUser = storedUser;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // გასუფთავება
            localStorage.removeItem('otp');
            localStorage.removeItem('otpUser');
            
            // UI განახლება
            otpModal.classList.remove('active');
            checkAuthStatus();
            
            // შეტყობინება
            alert('თქვენ წარმატებით გაიარეთ ავტორიზაცია!');
        } else {
            alert('არასწორი ვერიფიკაციის კოდი');
        }
    }
    
    function handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const phone = document.getElementById('reg-phone').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        
        // ვალიდაცია
        if (!name || !email || !phone || !password || !confirmPassword) {
            alert('გთხოვთ შეავსოთ ყველა ველი');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('პაროლები არ ემთხვევა');
            return;
        }
        
        if (password.length < 6) {
            alert('პაროლი უნდა შედგებოდეს მინიმუმ 6 სიმბოლოსგან');
            return;
        }
        
        // შემოწმება არის თუ არა მომხმარებელი უკვე რეგისტრირებული
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(u => u.email === email || u.phone === phone);
        
        if (userExists) {
            alert('მომხმარებელი ამ ელ.ფოსტით ან ტელეფონის ნომრით უკვე არსებობს');
            return;
        }
        
        // ახალი მომხმარებლის შექმნა
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            phone,
            password,
            createdAt: new Date().toISOString()
        };
        
        // მომხმარებლის დამატება
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // OTP ვერიფიკაცია
        simulateOtpVerification(newUser);
    }
    
    function handleLogout() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        checkAuthStatus();
        window.location.reload();
    }
    
    function handleAddProduct(e) {
        e.preventDefault();
        
        if (!currentUser) {
            alert('გთხოვთ გაიაროთ ავტორიზაცია');
            loginModal.classList.add('active');
            return;
        }
        
        const title = document.getElementById('product-title').value;
        const category = document.getElementById('product-category').value;
        const price = document.getElementById('product-price').value;
        const description = document.getElementById('product-description').value;
        const location = document.getElementById('product-location').value;
        
        // ვალიდაცია
        if (!title || !category || !price || !description || !location) {
            alert('გთხოვთ შეავსოთ ყველა სავალდებულო ველი');
            return;
        }
        
        // სურათების მოპოვება (ამ მაგალითში ვიყენებთ მოდელირებულ URL-ებს)
        const imageFiles = document.getElementById('product-images').files;
        const images = [];
        
        for (let i = 0; i < Math.min(imageFiles.length, 5); i++) {
            images.push(URL.createObjectURL(imageFiles[i]));
        }
        
        // ახალი პროდუქტის შექმნა
        const newProduct = {
            id: Date.now().toString(),
            title,
            category,
            price: parseFloat(price),
            description,
            location,
            images,
            seller: currentUser.name,
            sellerId: currentUser.id,
            createdAt: new Date().toISOString()
        };
        
        // პროდუქტის დამატება
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        
        // ფორმის გასუფთავება
        addProductForm.reset();
        document.getElementById('image-preview').innerHTML = '';
        
        // მოდალური ფანჯრის დახურვა
        addProductModal.classList.remove('active');
        
        // პროდუქტების განახლება
        loadProducts();
        
        alert('პროდუქტი წარმატებით დაემატა!');
    }
    
    // Google Maps ინიციალიზაცია
    function initMap() {
        const locationInput = document.getElementById('product-location');
        const map = document.getElementById('location-map');
        
        if (locationInput && map) {
            map.style.display = 'block';
            
            const autocomplete = new google.maps.places.Autocomplete(locationInput);
            const mapInstance = new google.maps.Map(map, {
                center: {lat: 41.6938, lng: 44.8015}, // თბილისის კოორდინატები
                zoom: 12
            });
            
            autocomplete.bindTo('bounds', mapInstance);
            
            const marker = new google.maps.Marker({
                map: mapInstance,
                anchorPoint: new google.maps.Point(0, -29)
            });
            
            autocomplete.addListener('place_changed', function() {
                const place = autocomplete.getPlace();
                if (!place.geometry) {
                    return;
                }
                
                // მარკერის განახლება
                if (place.geometry.viewport) {
                    mapInstance.fitBounds(place.geometry.viewport);
                } else {
                    mapInstance.setCenter(place.geometry.location);
                    mapInstance.setZoom(17);
                }
                
                marker.setPosition(place.geometry.location);
                marker.setVisible(true);
            });
        }
    }
    
    // გლობალურ ფუნქციად დაყენება Google Maps-ისთვის
    window.initMap = initMap;
});
