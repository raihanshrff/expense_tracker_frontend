const registerForm = document.getElementById('register-form');

const message = document.getElementById('message');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const userdata ={
        username,
        email,
        password
    };

    try {
        const response = await fetch(
            'http://127.0.0.1:8000/api/register/',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(userdata)
            }
        );

        const data = await response.json();

        if (response.ok){
            message.textContent = 'Registration successful!';
            message.style.color = 'green';
            setTimeout(() => {
                window.location.href = 'index.html';

            },1500);
        }
        else {
            message.textContent = 'Registration failed. please try again.';
            message.style.color = 'red';

        }
    }
    catch (error) {
        message.style.color = 'red';
        message.textContent = 'An error occurred.Please try again.';
    }
});