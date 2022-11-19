
const email = dom('#email');
const password = dom('#password');
const btn = dom('.login-btn');


btn.onclick = () => {
    if(email.value !== '' && password.value !== '') {
        btn.innerHTML = 'Authenticating...';
        fetch('https://parlaynplay.herokuapp.com/admin-login', {
            mode: "cors",
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin': 'http://localhost:5501'},
            body: JSON.stringify({
                email: email.value, password: password.value
            })
        }).then(res => res.json())
        .then(data => {
            if(data.success) {
                setCookie('token', data.token, 1);
                btn.innerHTML = 'Sign In';
                location.href = '/admin/dashboard.html';
            }else{
                btn.innerHTML = 'Sign In';
                console.log(data.error);
                M.toast({html: data.error});
            }
        }).catch(err => {
            console.log(err);
            M.toast({html: 'An error occured, try again'});
            btn.innerHTML = 'Sign In';
        })
    }else {
        M.toast({html: 'All fields are important'});
    }
}


function dom(ele) {
    return document.querySelector(ele); 
}

function domAll(ele) {
    return document.querySelectorAll(ele);
}

function create(ele) {
    return document.createElement(ele);
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }