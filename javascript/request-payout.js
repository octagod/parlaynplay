const amount_input = dom('#amount');
const amount_all = domAll('.available-balance');
const btn = dom('.request-payout');


// get avaialable balance
const available_bal = localStorage.getItem('available balance');

amount_all.forEach(elem => {
    elem.innerHTML =  (Math.round((available_bal) * 10)/10).toLocaleString()
});

btn.onclick = () => {
    if(amount_input.value !== '') {
        if(available_bal >= parseFloat(amount_input.value) ) {
            requestPayout(Math.round((parseFloat(amount_input.value)) * 10)/10)
        }else{
            toast('Amount can not exceed available balance', 8000);
        }
    }else{
        toast('Amount is empty');
    }
}


function requestPayout(amount) {
    // get user email
    const email = localStorage.getItem('email');
    btn.innerHTML = 'Please Wait...';
    
    fetch('https://parlaynplay.herokuapp.com/request-payout', {
        mode: 'cors',
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin':'http://localhost:5501;'},
        body: JSON.stringify({amount: amount, email: email, token: getCookie('token')})
    }).then(res => res.json())
    .then(data => {
        if(data.success) {
            btn.innerHTML = 'Request Payout';
            toast('Your Payout Request has been sent');
        }else{
            toast('An error occured from the server')
            btn.innerHTML = 'Request Payout';
            console.log(data.error);
        }
    })
    .catch(err => {
        console.log(err); 
        toast('An error occured')
        btn.innerHTML = 'Request Payout';
    })

}