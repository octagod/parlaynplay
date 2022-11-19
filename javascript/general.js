
function dom(ele) {
    return document.querySelector(ele); 
}

function domAll(ele) {
    return document.querySelectorAll(ele);
}

function create(ele) {
    return document.createElement(ele);
}

function toast(msg,duration) {

    M.toast({html: msg, displayLength: duration == null || duration == undefined ? 4000 : duration});
}

domAll('.logout').forEach(lg => {
    
    lg.onclick = () => {
        // fetch('https://parlaynplay.herokuapp.com/logout', {credentials: 'include'})
        // .then(res => res.json())
        // .then(data => data.success ? location.href = '/' : toast('An error occurred while attempting to logout'))
        // .catch(err => console.log(err));
            document.cookie = 'token' +'=; Path=/;';
            location.href = '/'
    }
})


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }


