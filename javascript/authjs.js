// check if user is authenticated
userAuthState();

// get user details
getUserDetails();

function userAuthState() {
    fetch('https://parlaynplay.herokuapp.com/isAuthenticated', {
        mode: 'cors',
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin':'http://localhost:5501;'},
        body: JSON.stringify({token: getCookie('token')})
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            //do nothing
        }else{
            M.toast({html: 'Unauthorised User'});
            setTimeout(() => {
                location.href = '/';
            }, 4000);
        }
    })
    .catch(err => {
        // log error
        console.log(err);
    })
}

const username = domAll('.account-name');
const available_balance = domAll('.available-balance');
const amount_at_risk = domAll('.amount-at-risk');

function getUserDetails() {
    fetch('https://parlaynplay.herokuapp.com/userDetails',{
        mode: 'cors',
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin':'http://localhost:5501;'},
        body: JSON.stringify({token: getCookie('token')})
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            let doc = data.data;
            if(doc.suspended){
                // navigate to suspended page
                location.href = '/suspended.html';
            }else{
                username.forEach(ele => {
                    ele.innerHTML = doc.email;
                })
                available_balance.forEach(element => {
                    element.innerHTML = `$${(Math.round((doc['available balance']) * 10)/10).toLocaleString()}`;
                });
                amount_at_risk.forEach(ele => {
                    ele.innerHTML = `$${(Math.round((doc['amount at risk']) * 10)/10).toLocaleString()}`;
                })
                localStorage.setItem('available balance', doc['available balance']);
                localStorage.setItem('email', doc.email);
            }
        }else{
            M.toast({html: 'An error from the server occured'});
            console.log(data.error);
        }
    })
    .catch (err => {
        console.log(err);
        M.toast({html: 'An error occured'});
    });
}
