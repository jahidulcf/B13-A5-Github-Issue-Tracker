
const loginFrom = document.getElementById('login-form');

loginFrom.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    login(username, password);
});

const login = (username, password) => {
    if (username === 'admin' && password === 'admin123') {
        window.location.href = 'dashboard.html';
    } else {
        window.location.href = 'login.html';
    }
}