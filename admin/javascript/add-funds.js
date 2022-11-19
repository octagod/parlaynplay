const UrlParams = new URLSearchParams(window.location.search);
const uid = UrlParams.get('id');


fetch('https://parlaynplay.herokuapp.com/get-user', {
    mode: 'cors',
    method: 'POST',
    credentials: 'include',
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin': 'http://localhost:5501'},
    body: JSON.stringify({uid: uid, token: getCookie('token')})
}).then( res => res.json())
.then(data => {
    if(data.success) {
        renderData(data.data);
    }else{
        console.log(data.error);
        toast('an error occured from the server');
    }
}).catch(err => {
    toast(err);
})


function renderData(data) {

    domAll('.firstname').forEach(ele => {
        ele.innerHTML = data.firstname;
    });
}

const btn = dom('.fund-btn');
const amount = dom('#amount');

btn.onclick = () => {

    if(amount.value !== '') {
        btn.innerHTML = 'Funding Account...'
        
        fetch('https://parlaynplay.herokuapp.com/admin/add-fund', {
            mode: 'cors',
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin': 'http://localhost:5501'},
            body: JSON.stringify({uid: uid, amount: amount.value, token: getCookie('token')})
        }).then( res => res.json())
        .then(data => {
            if(data.success) {
                toast('Account Funded Successfully');
                amount.value = '';
                btn.innerHTML = 'Fund Account'
            }else{
                console.log(data.error);
                toast('an error occured from the server');
                btn.innerHTML = 'Fund Account'
            }
        }).catch(err => {
            toast(err);
            btn.innerHTML = 'Fund Account'
        })

    }else {
        toast('Enter an amount to fund account');
    }
}