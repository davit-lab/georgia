// DOM Elements
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('nav');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const closeButtons = document.querySelectorAll('.close');

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Modal Show/Hide
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
});

registerBtn.addEventListener('click', () => {
    registerModal.style.display = 'block';
});

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (e.target === registerModal) {
        registerModal.style.display = 'none';
    }
});

// Load Categories
const categoryGrid = document.querySelector('.category-grid');
const categories = [
    { name: 'უძრავი ქონება', icon: 'home' },
    { name: 'ტრანსპორტი', icon: 'car' },
    { name: 'სამუშაო', icon: 'briefcase' },
    { name: 'ელექტრონიკა', icon: 'laptop' },
    { name: 'სახლი და ბაღი', icon: 'couch' },
    { name: 'მოდა', icon: 'tshirt' },
    { name: 'სპორტი', icon: 'futbol' },
    { name: 'ცხოველები', icon: 'paw' }
];

categories.forEach(category => {
    const categoryItem = document.createElement('div');
    categoryItem.className = 'category-item';
    categoryItem.innerHTML = `
        <i class="fas fa-${category.icon}"></i>
        <p>${category.name}</p>
    `;
    categoryGrid.appendChild(categoryItem);
});

// Load Listings
const listingGrid = document.querySelector('.listing-grid');
const listings = [
    { 
        title: '2 ოთახიანი ბინა ვაკეში', 
        location: 'თბილისი, ვაკე', 
        price: '120,000$', 
        rooms: '2', 
        area: '65მ²', 
        img: 'https://via.placeholder.com/300x200?text=Apartment' 
    },
    { 
        title: 'Toyota Camry 2018', 
        location: 'თბილისი, ვარკეთილი', 
        price: '25,000$', 
        mileage: '45,000კმ', 
        img: 'https://via.placeholder.com/300x200?text=Toyota+Camry' 
    },
    { 
        title: 'პროგრამისტის სამუშაო', 
        location: 'თბილისი, მარჯანიშვილი', 
        price: '3,500₾', 
        type: 'სრული განაკვეთი', 
        img: 'https://via.placeholder.com/300x200?text=Job' 
    },
    { 
        title: 'iPhone 13 Pro', 
        location: 'ბათუმი', 
        price: '2,800₾', 
        condition: 'ახალი', 
        img: 'https://via.placeholder.com/300x200?text=iPhone' 
    }
];

listings.forEach(listing => {
    const listingItem = document.createElement('div');
    listingItem.className = 'listing-item';
    
    let metaItems = [];
    if (listing.rooms) metaItems.push(`${listing.rooms} ოთახი`);
    if (listing.area) metaItems.push(listing.area);
    if (listing.mileage) metaItems.push(listing.mileage);
    if (listing.type) metaItems.push(listing.type);
    if (listing.condition) metaItems.push(listing.condition);
    
    listingItem.innerHTML = `
        <div class="listing-img">
            <img src="${listing.img}" alt="${listing.title}">
            <div class="listing-price">${listing.price}</div>
        </div>
        <div class="listing-details">
            <h4 class="listing-title">${listing.title}</h4>
            <p class="listing-location">${listing.location}</p>
            <div class="listing-meta">
                <span>${metaItems.join(' • ')}</span>
            </div>
        </div>
    `;
    
    listingGrid.appendChild(listingItem);
});
