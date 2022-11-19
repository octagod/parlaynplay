const payoutAmount = dom('.payout-amount');
const wagerAmount = dom('.wager-amount');

fetch('https://parlaynplay.herokuapp.com/auth/variables', {
    mode: 'cors',
    method: 'POST',
    credentials: 'include',
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin':'http://localhost:5501;'},
    body: JSON.stringify({token: getCookie('token')})
})
.then(res => res.json())
.then(data => {
    if(data.success) {
        wagerAmount.innerHTML = `$${data.data.stake}`;
        payoutAmount.innerHTML = `$${data.data.payout}`;
    }else{
        console.log(data.error);
        toast('an error occured from the server');

    }
}).catch(err => {
    console.log(err);
    toast('an error occured');
})


const btn = dom('.confirm-btn');
const payout = dom('#payout');
const wager = dom('#stake');

btn.onclick = () => {
    if(payout.value !== '' && wager.value !== '') {
        btn.innerHTML = 'Please wait...'
        fetch('https://parlaynplay.herokuapp.com/auth/set-variables', {
            mode: 'cors',
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin': 'http://localhost:5501'},
            body: JSON.stringify({
                payout: payout.value,
                wager: wager.value,
                token: getCookie('token')
            })
        }).then(res => res.json())
        .then(data => {
            if(data.success) {
                toast('Variables updated successfully');
                btn.innerHTML = 'SET NEW VALUES...'
                setTimeout(() => {
                    location.reload()
                }, 4000);
            }else{
                btn.innerHTML = 'SET NEW VALUES...'
                console.log(data.error);
                toast('an error occured from the server');
                
            }
        }).catch(err => {
            console.log(err);
            toast('an error occured');
            btn.innerHTML = 'SET NEW VALUES...'
        })
    }else{
        toast('Enter valid amounts')
    }
}