
function dom(ele) {
    return document.querySelector(ele); 
}

function domAll(ele) {
    return document.querySelectorAll(ele);
}

function create(ele) {
    return document.createElement(ele);
}

function toast(msg) {
    M.toast({html: msg});
}

dom('.logout').onclick = () => {
    // fetch('https://parlaynplay.herokuapp.com/logout', {credentials: 'include'})
    // .then(res => res.json())
    // .then(data => data.success ? location.href = '/admin/' : toast('An error occurred while attempting to logout'))
    // .catch(err => console.log(err));
    document.cookie = 'token' +'=; Path=/;';
    location.href = '/admin/'
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }