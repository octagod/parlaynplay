
const tbody = dom('tbody');


fetch('https://parlaynplay.herokuapp.com/get-users', {
    mode: 'cors',
    method: 'POST',
    credentials: 'include',
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin':'http://localhost:5501;'},
    body: JSON.stringify({token: getCookie('token')})
})
.then(res => res.json())
.then(data => {
    if(data.success) {
        const docs = data.data;
        console.log(docs);
        docs.forEach( (doc,index) => {
            renderUser(doc, index+1);
        }) 
    }else {
        console.log(data.error);
        toast('An error occured from the server')
    }
}).catch(err => {
    console.log(err);
    toast(err);
})


function renderUser(doc, index) {
    let row = create('tr');
    let id = create('td')
    let firstname = create('td');
    let email = create('td');
    let amount = create('td');
    let fund_column = create('td');
    let suspend_column = create('td');
    let unsuspend_column = create('td');
    let bets_column = create('td');

    let fund_btn = create('a');
    let suspend_btn = create('a');
    let unsuspend_btn = create('a');
    let bets_btn = create('a');

    fund_btn.classList.add('btn', 'green', 'fullwidth')
    suspend_btn.classList.add('btn', 'brand-color', 'fullwidth')
    unsuspend_btn.classList.add('btn', 'blue', 'fullwidth')
    bets_btn.classList.add('btn', 'purple', 'fullwidth')


    index%2 == 1 ? row.classList.add('grey', 'lighten-2') : '';
    if(doc.suspended){ 
        row.classList.remove('grey', 'lighten-2'); 
        row.classList.add('red', 'white-text', 'lighten-3')
    }


    // set values
    id.innerHTML = index;
    firstname.innerHTML = doc.firstname;
    email.innerHTML = doc.email;
    amount.innerHTML = `$${(doc['available balance']).toLocaleString()}`;
    fund_btn.innerHTML = `<i class="material-icons white-text">attach_money</i>`
    suspend_btn.innerHTML = `<i class="material-icons white-text">cancel</i>`
    unsuspend_btn.innerHTML = `<i class="material-icons white-text">check_circle</i>`
    bets_btn.innerHTML = `<i class="material-icons white-text">confirmation_number</i>`


    fund_column.appendChild(fund_btn)
    suspend_column.appendChild(suspend_btn)
    unsuspend_column.appendChild(unsuspend_btn)
    bets_column.appendChild(bets_btn)


    row.appendChild(id)
    row.appendChild(firstname)
    row.appendChild(email)
    row.appendChild(amount)
    row.appendChild(fund_column)
    row.appendChild(suspend_column)
    row.appendChild(unsuspend_column)
    row.appendChild(bets_column)
    tbody.appendChild(row);

    fund_btn.onclick = () => {
        location.href = '/admin/add-funds.html?id='+doc.id;
    }

    bets_btn.onclick = () => {
        location.href = `/admin/user-bets.html?id=${doc.id}&name=${doc.firstname}&amount=${doc['available balance']}&email=${doc.email}`
    }

    suspend_btn.onclick = () => {
        let text = `Are you sure you want to suspend ${doc.firstname} ?`;
        if(confirm(text)) {
            fetch('https://parlaynplay.herokuapp.com/suspend-user', {
                credentials: 'include',
                mode: 'cors',
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin': 'http://localhost:5501'},
                body: JSON.stringify({uid: doc.id, token: getCookie('token')})
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    toast(`${doc.firstname}'s has been suspend`);
                    setTimeout(() => {
                        location.reload();
                    }, 4000);
                }else {
                    console.log(data.error);
                    toast('An error occured from the server')
                }
            }).catch(err => {
                console.log(err);
                toast(err);
            })
        }
    }

    unsuspend_btn.onclick = () => {
        let text = `Are you sure you want to unsuspend ${doc.firstname} ?`;
        if(confirm(text)) {
            fetch('https://parlaynplay.herokuapp.com/unsuspend-user', {
                credentials: 'include',
                mode: 'cors',
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin': 'http://localhost:5501'},
                body: JSON.stringify({uid: doc.id, token: getCookie('token')})
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    toast(`${doc.firstname}'s has been unsuspend`);
                    setTimeout(() => {
                        location.reload();
                    }, 4000);
                }else {
                    console.log(data.error);
                    toast('An error occured from the server')
                }
            }).catch(err => {
                console.log(err);
                toast(err);
            })
        }
    }

    
}



function setAttributes(ele, attrs) {
    for(var key in attrs) {
        ele.setAttribute(key, attrs[key]);
    }
}