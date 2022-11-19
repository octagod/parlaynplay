const ticketId = dom('#ticketID');
const email = dom('#email');
const popup = dom('.popup');
const ticketBtn = dom('.view-ticket-btn');


ticketBtn.onclick = () => {
    if(ticketId.value !== '' && email.value !== '') {
        ticketBtn.innerHTML = 'Fetching Ticket...';
        fetch('https://parlaynplay.herokuapp.com/auth/get-ticket',{
            mode: 'cors',
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin': 'http://localhost:5501'},
            body: JSON.stringify({ticketID: ticketId.value, email: email.value, token: getCookie('token')})
        }).then(res => res.json())
        .then(data => {
            if(data.success) {
                ticketBtn.innerHTML = 'Get Ticket';
                showTicket(data.ticket, data.type)
            }else {
                console.log(data.error);
                toast(data.error)
                ticketBtn.innerHTML = 'Get Ticket';
            }
        }).catch(err => {
            console.log(err);
            toast(err);
            ticketBtn.innerHTML = 'Get Ticket';
        })
    }else{
        toast('enter a valid ticket ID/email');
    }
}

const tbody = dom('tbody');
const button = dom('.button')

function showTicket(ticket, type) {
    if(type == 'straight') {
        // clear tbody & buttonHolder
        tbody.innerHTML = '';
        button.innerHTML = '';
        // straight
        renderStraight(ticket);
        popup.classList.remove('hide');
    }else {
        // clear tbody & buttonHolder
        tbody.innerHTML = '';
        button.innerHTML = '';
        // parley
        renderParley(ticket);
        popup.classList.remove('hide');
    }
}


function renderStraight(ticket) {
    const row = create('tr');
    const id = create('td');
    const date = create('td');
    const game = create('td');
    const settle = create('a')

    settle.classList.add('btn', 'brand-color', 'white-text', 'fullwidth');

    // add value
    id.innerHTML = 1;
    date.innerHTML = ticket.date;
    game.innerHTML = ticket.game;
    settle.innerHTML = 'Settle Bet';
    dom('.potential-win').innerHTML = `<b>Potential Win:</b> $${ticket['amount to win']} | <b>Stake:</b> $${ticket['amount without tax']} | <b>Payout:</b> $${ticket['amount without tax'] + ticket['amount to win']}`;
    dom('.ticket-id').innerHTML = `${ticket.id}`

    // append element
    row.appendChild(id)
    row.appendChild(date)
    row.appendChild(game)
    tbody.appendChild(row);
    button.appendChild(settle);

    // close bet
    settle.onclick = () => {
        settle.innerHTML = 'Settling Bet...';
        fetch('https://parlaynplay.herokuapp.com/auth/settle-bet', {
            mode: 'cors',
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin': 'http://localhost:5501'},
            body: JSON.stringify({ticketID: ticket.id, type: 'straight', email: email.value, token: getCookie('token')})
        }).then(res => res.json())
        .then(data => {
            if(data.success) {
                settle.innerHTML = 'Settle Bet';
                toast('Bet Closed Successfully');
                toast('You can proceed to either fund the user account or cash app user');
                popup.classList.add('hide');
            }else {
                console.log(data.error);
                toast(data.error)
                settle.innerHTML = 'Settle Bet';
            }
        }).catch(err => {
            console.log(err);
            toast(err);
            settle.innerHTML = 'Settle Bet';
        })
    }

}


function renderParley(ticket) {
    const settle = create('a')

    settle.classList.add('btn', 'brand-color', 'white-text', 'fullwidth');

    for(let x in ticket.games) {
        const row = create('tr');
        const id = create('td');
        const date = create('td');
        const game = create('td');

        let index = x;

        id.innerHTML = parseInt(index)+1;
        date.innerHTML = ticket.games[x].date;
        game.innerHTML = ticket.games[x].game;

        row.appendChild(id)
        row.appendChild(date)
        row.appendChild(game)
        tbody.appendChild(row);
    }

    settle.innerHTML = 'Settle Bet';
    dom('.potential-win').innerHTML = `<b>Potential Win:</b> $${ticket['amount to win']} | <b>Stake:</b> $${ticket['amount without tax']} | <b>Payout:</b> $${ticket['amount without tax'] + ticket['amount to win']}`;
    dom('.ticket-id').innerHTML = `${ticket['ticket Id']}`;


    button.appendChild(settle);

    settle.onclick = () => {
        settle.innerHTML = 'Settling Bet...';
        fetch('https://parlaynplay.herokuapp.com/auth/settle-bet', {
            mode: 'cors',
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin': 'http://localhost:5501'},
            body: JSON.stringify({ticketID: ticket['ticket Id'], type: 'parley', email: email.value, token: getCookie('token')})
        }).then(res => res.json())
        .then(data => {
            if(data.success) {
                settle.innerHTML = 'Settle Bet';
                toast('Bet Closed Successfully');
                toast('You can proceed to either fund the user account or cash app user');
                popup.classList.add('hide');
            }else {
                console.log(data.error);
                toast(data.error)
                settle.innerHTML = 'Settle Bet';
            }
        }).catch(err => {
            console.log(err);
            toast(err);
            settle.innerHTML = 'Settle Bet';
        })
    }

}

dom('.cancel-btn').onclick = () => {
    popup.classList.add('hide');
}

