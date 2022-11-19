const straight = dom('.straight');
const parley = dom('.parley');
const popup = dom('.popup')
const options_popup = dom('.options-popup')

parley.onclick = () => {
    location.href = '/sports/?type=parley';
}
straight.onclick = () => {
    location.href = '/sports/?type=straight';
}

fetch('https://parlaynplay.herokuapp.com/get-straight-bets', {
    mode: 'cors',
    method: 'POST',
    credentials: 'include',
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin':'http://localhost:5501;'},
    body: JSON.stringify({token: getCookie('token')})
})
.then(res => res.json())
.then(data => {
    if(data.success) {
        data.docs.length > 0 ?
        data.docs.forEach(doc => {
            renderStraightBets(doc);
        }) : straight_tbody.innerHTML = '<td colspan="4">You have no open Straight Bets</td>'
    }else{
        console.log(data.error);
        toast('An error occured from the server');
    }
}).catch(err => {
    console.log(err);
    toast('An error occured');
});

fetch('https://parlaynplay.herokuapp.com/get-parley-bets', {
    mode: 'cors',
    method: 'POST',
    credentials: 'include',
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin':'http://localhost:5501;'},
    body: JSON.stringify({token: getCookie('token')})
})
.then(res => res.json())
.then(data => {
    if(data.success) {
        dom('.loading').classList.add('hide')

        data.docs.length > 0 ?
        data.docs.forEach(doc => {
            renderParleyBets(doc);
        }) : parley_tbody.innerHTML = '<td colspan="5">You have no open Parlay Bets</td>'
    }else{
        console.log(data.error);
        toast('An error occured from the server');
    }
}).catch(err => {
    console.log(err);
    toast('An error occured');
});


const straight_tbody = dom('div.straight tbody')
const parley_tbody = dom('div.parley tbody')

function renderStraightBets(doc) {

    const row = create('tr')
    const ticketID = create('td')
    const date = create('td')
    const game = create('td')
    const potentialWIn = create('td')
    const options = create('td');
    const options_btn = create('a');


    options_btn.classList.add('blue', 'btn', 'white-text', 'fullwidth' );


    // add values
    ticketID.innerHTML = `${doc.id}`;
    date.innerHTML = doc.date;
    game.innerHTML = doc.game;
    potentialWIn.innerHTML = `$${doc['amount to win']}`
    options_btn.innerHTML = 'Options';

    // append elements
    options.appendChild(options_btn);
    row.appendChild(ticketID);
    row.appendChild(date)
    row.appendChild(game)
    row.appendChild(potentialWIn)
    // row.appendChild(options)
    straight_tbody.appendChild(row);

    options_btn.onclick = () => {
       options_popup.classList.remove('hide');

    //    copy bet btn
        dom('.copy-bet').onclick = () => {
            navigator.clipboard.writeText(doc.id);
            toast('Bet ID copied to clipboard')
        }

        // // close bet btn
        // dom('.close-bet').onclick = () => {
        //     closeBet(doc.id, 'straight');
        // }

        // request payout
        dom('.request-payout').onclick = () => {
            requestPayout(doc.id, doc['amount to win']);
        }
    }


}

function renderParleyBets(doc) {

    const row = create('tr')
    const ticketID = create('td')
    const date = create('td')
    const gameCount = create('td')
    const potentialWIn = create('td')
    const viewTicket = create('td');
    const viewTicketBtn = create('a');
    const options = create('td');
    const options_btn = create('a');


    
    
    // class naming
    viewTicketBtn.classList.add('brand-color', 'btn', 'white-text', 'fullwidth' );
    options_btn.classList.add('blue', 'btn', 'white-text', 'fullwidth' );


    // add values
    ticketID.innerHTML = doc['ticket Id'];
    date.innerHTML = convertToDate(doc.timestamp);
    gameCount.innerHTML = doc.games.length;
    potentialWIn.innerHTML = `$${doc['amount to win']}`;
    options_btn.innerHTML = 'Options';
    viewTicketBtn.innerHTML = 'View Ticket';

    // append element
    options.appendChild(options_btn);
    viewTicket.appendChild(viewTicketBtn)
    row.appendChild(ticketID);
    row.appendChild(date);
    row.appendChild(gameCount);
    row.appendChild(potentialWIn);
    row.appendChild(viewTicket);
    // row.appendChild(options);
    parley_tbody.appendChild(row);

    viewTicketBtn.onclick = () => {
        popup.classList.remove('hide')
        domAll('.ticket-id').forEach(ele => {
            ele.innerHTML = doc['ticket Id'];
        })
        const gamesHolder = dom('.games')
        doc.games.forEach((game, index) => {
            const row_ = create('tr');
            const id_ = create('td');
            const date_ = create('td');
            const game_ = create('td');

            id_.innerHTML = index+1;
            date_.innerHTML = `${game.date}`;
            game_.innerHTML = `${game.game}`;
            
            row_.appendChild(id_)
            row_.appendChild(date_)
            row_.appendChild(game_)
            dom('.games-table tbody').appendChild(row_);
        })
        const win = create('h5');
        win.innerHTML = `Potential Win: $${doc['amount to win']}`
        gamesHolder.appendChild(win)
    }
    
    options_btn.onclick = () => {
        options_popup.classList.remove('hide');
 
     //    copy bet btn
         dom('.copy-bet').onclick = () => {
             navigator.clipboard.writeText(doc.id);
             toast('Bet ID copied to clipboard')
         }
 
        //  // close bet btn
        //  dom('.close-bet').onclick = () => {
        //      closeBet(doc['ticket Id'], 'parley');
        //  }
 
         // request payout
         dom('.request-payout').onclick = () => {
             requestPayout(doc['ticket Id'],doc['amount to win']);
         }
     }
}

dom('h1.cancel-btn').onclick = () => {
    popup.classList.add('hide');
    dom('.games-table tbody').innerHTML = '';
    dom('.games').innerHTML = '';

}


dom('.close-options').onclick = () => {
    options_popup.classList.add('hide');
}

// function closeBet(betID, type) {
//     dom('.close-bet').innerHTML = 'Please wait..';
//     fetch('https://parlaynplay.herokuapp.com/close-bet', {
//         mode: 'cors',
//         method: 'POST',
//         credentials: 'include',
//         headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin':'http://localhost:5501;'},
//         body: JSON.stringify({betID,type})
//     }).then(res => res.json())
//     .then(data => { 
//         if(data.success) {
//             toast('Bet closed Successfully')
//             dom('.close-bet').innerHTML = 'Close Bet';
//             setTimeout(() => {
//                 location.reload();
//             }, 3000);
//         }else{
//             dom('.close-bet').innerHTML = 'Close Bet';
//             toast('An error occured from the server')
//         }
//     }
//     ).catch(err => {console.log(err); toast('An error occured')})
//     dom('.close-bet').innerHTML = 'Close Bet';
// }
const rqbtn = dom('.request-payout');

function requestPayout(betID, payout) {
    // get user email
    const email = localStorage.getItem('email');
    rqbtn.innerHTML = 'Please Wait...';
    
    fetch('https://parlaynplay.herokuapp.com/request-payout', {
        mode: 'cors',
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin':'http://localhost:5501;'},
        body: JSON.stringify({betID: betID, payout: payout, email: email, token: getCookie('token')})
    }).then(res => res.json())
    .then(data => {
        if(data.success) {
            rqbtn.innerHTML = 'Request Payout';
            toast('Your Payout Request has been sent');
        }else{
            toast('An error occured from the server')
            rqbtn.innerHTML = 'Request Payout';
            console.log(data.error);
        }
    })
    .catch(err => {
        console.log(err); 
        toast('An error occured')
        rqbtn.innerHTML = 'Request Payout';
    })

}

function convertToDate(timestamp) {
    let date = new Date(timestamp);
    let day = date.getDate()
    let month = convertToMonth(date.getMonth() + 1);

    return `${month} ${day}`;
}


function convertToMonth(val) {
    switch(parseInt(val)) {
        case 01 || 1:
            return 'Jan';
        case 02 || 2:
            return 'Feb';
        case 03 ||3:
            return 'Mar';
        case 04 || 4:
            return 'Apr';
        case 05 || 5:
            return 'May';
        case 06 || 6:
            return 'Jun';
        case 07 || 7:
            return 'Jul';
        case 08 || 8:
            return 'Aug';
        case 09 || 9:
            return 'Sep';
        case 10:
            return 'Oct';
        case 11:
            return 'Nov';
        case 12:
            return 'Dec';
    }
}

function setAttributes(ele, attrs) {
    for(var key in attrs) {
        ele.setAttribute(key, attrs[key]);
    }
}