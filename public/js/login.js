const errorDivs = document.querySelectorAll('.validation-error');
const form = document.getElementById('login-form'); 
form.addEventListener('submit', login);

async function login(e) {
    e.preventDefault();
    errorDivs[0].innerHTML = '';
    errorDivs[1].innerHTML = '';
    const email = form.email.value;
    const password = form.password.value;
    const remember = form.rememberMe.checked;
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
                remember
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
        
        const data = await response.json();
      
        if (data.errors) {
            if (data.errors.email) {
                errorDivs[0].innerHTML = `<p>${data.errors.email}</p>`;
            }
            if (data.errors.password) {
                errorDivs[1].innerHTML = `<p>${data.errors.password}</p>`;
            }
        } else if(response.ok){
                location.assign("/secret");   
        }
    } catch (error) {
        throw new Error('Login request failed.');
    }
}