document.getElementById("login").addEventListener('submit', async function (event) {
    event.preventDefault();
    console.log("submitted form");
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    console.log("username: " + username);
    console.log("password: " + password);
    
    const res = await fetch('/create-account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    if (res.ok) {
        window.location.href = '/to-do-items.html';
    } else {
        alert("Username has been taken");
    }
});