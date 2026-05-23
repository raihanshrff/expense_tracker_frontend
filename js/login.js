const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const loginData = {
        username,
        password
    };
    try {
        const response =await fetch(
            'https://raihanshrff.pythonanywhere.com/api/login/',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
                }
            );
            const data = await response.json();
            if (response.ok){
                localStorage.setItem('access', data.access);
                localStorage.setItem('refresh', data.refresh);
                message.textContent = 'Login successful!';
                message.style.color = 'green';
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                },1500);
            }
            else{
                message.textContent = 'Invalid credentials.';
                message.style.color = 'red';
            }
            

    }
    catch (error) {
        message.textContent = 'Something went wrong.';
        message.style.color = 'red';
    }
});