// Login Form
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;
    
    // Here you would typically send this data to your backend
    console.log('Login attempt with:', { email, password });
    
    // Simulate successful login
    alert('წარმატებით შეხვედით სისტემაში!');
    loginModal.style.display = 'none';
});

// Register Form
const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = registerForm.querySelector('input[type="text"]').value;
    const email = registerForm.querySelector('input[type="email"]').value;
    const phone = registerForm.querySelector('input[type="tel"]').value;
    const password = registerForm.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = registerForm.querySelectorAll('input[type="password"]')[1].value;
    
    if (password !== confirmPassword) {
        alert('პაროლები არ ემთხვევა!');
        return;
    }
    
    // Here you would typically send this data to your backend
    console.log('Registration attempt with:', { name, email, phone, password });
    
    // Simulate successful registration
    alert('რეგისტრაცია წარმატებით დასრულდა!');
    registerModal.style.display = 'none';
});
