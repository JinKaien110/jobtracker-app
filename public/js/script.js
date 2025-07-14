document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const greetings = document.getElementById('greetings');
    
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const status = document.getElementById('status'); 

        const formData = new FormData(loginForm);
        const logins = Object.fromEntries(formData.entries());

        const res = await fetch('/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(logins)
        });

        if(res.ok) {
            const data = await res.json();
            status.textContent = data.message;
            console.log('Redirecting to dashboard...');
            
            loginForm.reset();
            window.location.href = '/views/dashboard.html';


        } else {
            const errorData = await res.json().catch(() => ({}));
            return status.textContent = errorData.textContent || `Invalid Login`;
        }
    });

    registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const status = document.getElementById('status'); 

        const formData = new FormData(registerForm);
        const registers = Object.fromEntries(formData);

        const res = await fetch('/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(registers)
        });

        if(res.ok) {
            const data = await res.json();
            status.textContent = data.message;
            registerForm.reset();
        } else {
            const errorData = await res.json().catch(() => ({}));
            return status.textContent = errorData.textContent;
        }
    });
});