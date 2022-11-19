const selectedData = JSON.parse(localStorage.getItem('selectedData'))
const tbody = dom('tbody');
const type_bet = type.toString().toUpperCase()+' BET';
const picks = UrlParams.get('picks');



console.log(selectedData);

/*  
    parameters needed for outright picks
    1. Commence Date of Game 
    2. Category e.g NFL
    3. Sport Title
    4. Team
    5. Odd/Points

    parameters needed for regular picks
    1. commence Date
    2. Category e.g NFL
    3. selected Market name and odd
    4. teams

*/

//check for outright picks
selectedData.selectedPicks.forEach((arr,index) => {
    if(arr.type == 'outright') {
        // outright activities
        outrightActivities(index);
    }else{
        // regular activities
        regularActivities(index);
    }
});


function outrightActivities(index) {
    let row = create('tr');
    let wagerType = create('td');
    let date = create('td');
    let team = create('td');
    let buyPoint = create('td');
    let amount_input = create('td');
    let amount = create('input');

    let date_variable = `${convertToMonth((selectedData.selectedPicksData[index].commence_time).toString().substring(5,7))} ${(selectedData.selectedPicksData[index].commence_time).toString().substring(8,10)}`;

    setAttributes(amount, {
        'type': 'number',
        'class': 'amount'
    });


    // classname
    team.classList.add('uppercase')

    // add value
    wagerType.innerHTML = type_bet;
    date.innerHTML = date_variable;
    team.innerHTML = getTeamName(index);

    // append element
    amount_input.appendChild(amount);
    row.appendChild(wagerType)
    row.appendChild(date)
    row.appendChild(team)
    row.appendChild(buyPoint);
    row.appendChild(amount);

    tbody.appendChild(row);

}


function regularActivities(index) {
    let row = create('tr');
    let wagerType = create('td');
    let date = create('td');
    let team = create('td');
    let buyPoint = create('td');
    let amount_input = create('td');
    let amount = create('input');

    let date_variable = `${convertToMonth((selectedData.selectedPicksData[index].commence_time).toString().substring(5,7))} ${(selectedData.selectedPicksData[index].commence_time).toString().substring(8,10)}`;

    // class name
    team.classList.add('uppercase');
    
    setAttributes(amount, {
        'type': 'number',
        'class': 'amount'
    });

    // add value
    wagerType.innerHTML = type_bet;
    date.innerHTML = date_variable;
    team.innerHTML = getOrdinaryTeam(index);
    

    if(selectedData.selectedPicks[index].market == 'mLine') {
        buyPoint.innerHTML = '';
    }else if(selectedData.selectedPicks[index].market == 'totals') {
        buyPoint.appendChild(generateBuypoint(index))
    }else {
        buyPoint.appendChild(generateBuypoint(index))
    }
    
    // append element
    amount_input.appendChild(amount);
    row.appendChild(wagerType)
    row.appendChild(date)
    row.appendChild(team)
    // row.appendChild(buyPoint); TODO: remove buypoints
    row.appendChild(amount_input);
    tbody.appendChild(row);
}


function getTeamName(index) {
    let category, teamName, points;

    category = selectedData.selectedPicksData[index].sport_title;
    teamName = selectedData.selectedPicks[index].name;
    points = getPoints(selectedData.selectedPicksData[index].bookmakers[0].markets[0].outcomes, selectedData.selectedPicks[index].name);

    return `${category} - ${teamName} +${points}`;
}


function getPoints(arr, name) {
    let p = arr.filter( a => a.name == name)
    return p[0].price;
}


function getOrdinaryTeam(index) {
    let sportTitle, teams, market, odd, price;

    sportTitle = selectedData.selectedPicksData[index].sport_title;
    price = selectedData.selectedPicks[index].price;


    // check market type
    teams = getTeamName_ordinary(index)

    // check if market is mLine
    selectedData.selectedPicks[index].market == 'mLine' ? odd = '' : odd = selectedData.selectedPicks[index].point;
    // check if market is total
    selectedData.selectedPicks[index].market == 'totals' ? market = 'TOTAL' : market = '';

    if(selectedData.selectedPicks[index].market == 'totals') {

        return `${sportTitle} - ${market} <span class='lowercase'>${odd}</span>${determineNumberSign(price)} ${teams}`;
    }else if(selectedData.selectedPicks[index].market == 'mLine'){
        // mline format
        return `${sportTitle} - ${teams} ${determineNumberSign(price)}`
    }else{
        // spread
        return `${sportTitle} - ${teams} ${odd}${determineNumberSign(price)}`
    }

}

function getTeamName_ordinary(index) {
    if(selectedData.selectedPicks[index].market == 'mLine') {
        return getMLineTeamName(index)

    }else if(selectedData.selectedPicks[index].market == 'totals'){

        return getTotalsTeamName(index)
    
    }else{

        return getSpreadTeamName(index);
    }
}


function getMLineTeamName(index) {
    let bookmaker_index = parseInt(selectedData.selectedPicks[index].bookmaker);
    let outcomes = selectedData.selectedPicksData[index].bookmakers[bookmaker_index].markets[0].outcomes;
    let price = parseFloat(selectedData.selectedPicks[index].price);
    let teamName;

    // loop through outcomes to get team with the selected price
    for(let x in outcomes) {
        if(outcomes[x].price == price) {
           teamName = outcomes[x].name;
        }
    }
    return teamName;
}

function getTotalsTeamName(index) {
    return `(${selectedData.selectedPicksData[index].home_team} vrs ${selectedData.selectedPicksData[index].away_team})`
}

function getSpreadTeamName(index) {
    let bookmarker_index = parseInt(selectedData.selectedPicks[index].bookmaker);
    let outcomes = selectedData.selectedPicksData[index].bookmakers[bookmarker_index].markets[1].outcomes;
    let odd = parseFloat(selectedData.selectedPicks[index].point);
    let teamName;

    // loop through outcomes to get team with the selected odd
    for(let x in outcomes) {
        if(outcomes[x].point == odd) {
            teamName = outcomes[x].name;
        }
    }

    return teamName;
}


function generateBuypoint(index) {
    if(selectedData.selectedPicks[index].market == 'mLine') {
        return ''

    }else if(selectedData.selectedPicks[index].market == 'totals'){

        return generateTotalsBuyPoint(index);
    
    }else{

        return generateSpreadBuyPoint(index);
    }
}


function generateTotalsBuyPoint(index) {
    let select = create('select');
    let point = removeOverandUnder(selectedData.selectedPicks[index].point);
    let over = checkIfOverOrUnder(selectedData.selectedPicks[index].point);
    let price = parseFloat(selectedData.selectedPicks[index].price)
    let options = [];


    //${price-10} will increase the price by 10. "reason": minus is used because all prices are rep buy - i.e -100 or -120
    if(over) {
        options = [
            {text: `Buy no Point`, price: price, point: point},
            {text: `Buy 0.5 for o${point-0.5}${price-10}`, price: price-10, point: point-0.5 }, 
            {text: `Buy 1 for o${point - 1.0}${price-20}`, price: price-20, point: point-1.0},
            {text: `Buy 1.5 for o${point - 1.5}${price-30}`, price: price-30, point: point-1.5},
            {text: `Buy 2 for o${point - 2.0}${price-40}`, price: price-40, point: point-2},
            {text: `Buy 2.5 for o${point - 2.5}${price-50}`, price: price-50, point: point-2.5},
            {text: `Buy 3 for o${point - 3.0}${price-60}`, price: price-60, point: point-3},
    
        ];
    }else{
        options = [
            {text: `Buy no Point`, price: price, point: point},
            {text: `Buy 0.5 for u${point+0.5}${price-10}`, price: price-10, point: point+0.5 }, 
            {text: `Buy 1 for u${point + 1.0}${price-20}`, price: price-20, point: point+1.0},
            {text: `Buy 1.5 for u${point + 1.5}${price-30}`, price: price-30, point: point+1.5},
            {text: `Buy 2 for u${point + 2.0}${price-40}`, price: price-40, point: point+2},
            {text: `Buy 2.5 for u${point + 2.5}${price-50}`, price: price-50, point: point+2.5},
            {text: `Buy 3 for u${point + 3.0}${price-60}`, price: price-60, point: point+3},
    
        ];
    }

    // render the options
    for(let x in options) {
        let opt = create('option');

        // give value
        opt.innerHTML = options[x].text;

        opt.value = options[x].text;
        setAttributes(opt, {
            'data-point': options[x].point,
            'data-price': options[x].price
        })

        select.appendChild(opt); //append
    }

    select.onchange = (e) => {
        console.log(selectedData.selectedPicks[index])
        // replace original points and price with the selected buy points and price 
        let point_ = e.target.options[e.target.selectedIndex].dataset.point
        let price_ = e.target.options[e.target.selectedIndex].dataset.price
        over ? selectedData.selectedPicks[index].point = `o${point_}` : selectedData.selectedPicks[index].point = `u${point_}`
        selectedData.selectedPicks[index].price = price_;
        console.log(selectedData.selectedPicks[index])
    }

     return select;
}

function generateSpreadBuyPoint(index) {
    select = create('select');
    let point = parseFloat(selectedData.selectedPicks[index].point);
    let price = parseFloat(selectedData.selectedPicks[index].price);
    let options = [];

    if(Math.sign(point) == 1) {
        // positive numbers
        options = [
            {text: `Buy no Point`, price: price, point: point},
            {text: `Buy 0.5 for +${point+0.5}${price-10}`, price: price-10, point: point+0.5 }, 
            {text: `Buy 1 for +${point + 1.0}${price-20}`, price: price-20, point: point+1.0},
            {text: `Buy 1.5 for +${point + 1.5}${price-30}`, price: price-30, point: point+1.5},
            {text: `Buy 2 for +${point + 2.0}${price-40}`, price: price-40, point: point+2},
            {text: `Buy 2.5 for +${point + 2.5}${price-50}`, price: price-50, point: point+2.5},
            {text: `Buy 3 for +${point + 3.0}${price-60}`, price: price-60, point: point+3},
        ]        
    }else{
        options = [
            {text: `Buy no Point`, price: price, point: point},
            {text: `Buy 0.5 for ${point+0.5}${price-10}`, price: price-10, point: point+0.5 }, 
            {text: `Buy 1 for ${point + 1.0}${price-20}`, price: price-20, point: point+1.0},
            {text: `Buy 1.5 for ${point + 1.5}${price-30}`, price: price-30, point: point+1.5},
            {text: `Buy 2 for ${point + 2.0}${price-40}`, price: price-40, point: point+2},
            {text: `Buy 2.5 for ${point + 2.5}${price-50}`, price: price-50, point: point+2.5},
            {text: `Buy 3 for ${point + 3.0}${price-60}`, price: price-60, point: point+3},
        ]
    }

    
    // render the options
    for(let x in options) {
        let opt = create('option');

        // give value
        opt.innerHTML = options[x].text;

        opt.value = options[x].text;
        setAttributes(opt, {
            'data-point': options[x].point,
            'data-price': options[x].price
        })

        select.appendChild(opt); //append
    }


    select.onchange = (e) => {
        console.log(selectedData.selectedPicks[index])

        // replace original points and price with the selected buy points and price 
        let point_ = e.target.options[e.target.selectedIndex].dataset.point
        let price_ = e.target.options[e.target.selectedIndex].dataset.price
        selectedData.selectedPicks[index].point = point_
        selectedData.selectedPicks[index].price = price_;

        console.log(selectedData.selectedPicks[index])
    }
    

    return select;
}

dom('.same-amount').onchange = () => {
    setTimeout(() => {
        location.href = `/wager.html?picks=${picks}&type=${type}`
    }, 2000);
}


// proceed btn activities
const submitBtn = dom('.procceed-btn');
const amount_inputs = domAll('input.amount');
const popup = dom('.popup')

submitBtn.onclick = () => {
    submitBtn.innerHTML = 'Please Wait...'

     // get maximum stake
     fetch('https://parlaynplay.herokuapp.com/variables', {
        mode: 'cors',
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin':'http://localhost:5501;'},
        body: JSON.stringify({token: getCookie('token')})
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            const maximum_stake = data.data.stake;
            handleChecks(maximum_stake, submitBtn);
        }else{
            console.log(data.error);
            toast('an error occured from the server');
            submitBtn.innerHTML = 'Proceed'
        }
    }).catch(err => {
        console.log(err);
        toast('an error occured');
        submitBtn.innerHTML = 'Proceed'
    })
}

function handleChecks(maxStake, btn) {
    let errs = [];
    let totalStake = 0;
    for(let x = 0; x < amount_inputs.length; x++) {
        if(amount_inputs[x].value == '' ) {
            errs[x] = 'empty'
        }else if(parseFloat(amount_inputs[x].value) > maxStake) {
            errs[x] = 'greater stake'
        }else{
            console.log(amount_inputs[x].value)
        }
    }
    if(errs.length == 0) {
        // get total of all amounts
        for(let x = 0; x < amount_inputs.length; x++) {
            totalStake += parseFloat(amount_inputs[x].value);
        }

        // get user's available balance
        let avaialableBalance = localStorage.getItem('available balance');

        // check if user's available balance covers the total stake
        if(avaialableBalance >= totalStake) {

            
            // determine what market was selected for each picks
            for(let x in selectedData.selectedPicks) {
                if(selectedData.selectedPicks[x].type == 'outright') {
                    // handle outright
                    console.log('outrights')
                    toast('Futures games are currently not supported at this time', 8000);
                    toast('Your Future pick(s) will not be included in your bet',8000);
                }else if(selectedData.selectedPicks[x].type == 'regular'){
                    // show risk popup
                    popup.classList.remove('hide');

                    // handle regular type games
                    if(selectedData.selectedPicks[x].market == 'spread') {
                        // handle spread
                        handleStraightSpreadPotentialWin(x, amount_inputs[x].value);
                    }else if(selectedData.selectedPicks[x].market == 'totals') {
                        // handle totals
                        handleStraightTotalsPotentialWin(x, amount_inputs[x].value);
                    }else if(selectedData.selectedPicks[x].market == 'mLine'){
                        //handle mline
                        console.log('mLine')
                        handleStraightmLinePotentialWin(x, amount_inputs[x].value);
                    }

                }
            }

            btn.innerHTML = 'Proceed';

        }else {
            toast('Insufficient fund')
            btn.innerHTML = 'Proceed';
        }
    }else{
        if(errs.includes('greater stake')) {
            toast(`You can only stake a max of $${maxStake} on each bet`, 10000);
            btn.innerHTML = 'Proceed';
        }else{
            toast('Ensure you have filled all amounts');
            btn.innerHTML = 'Proceed';
        }
    }
}

dom('h1.cancel-btn').onclick = () => {
    popup.classList.add('hide');
    risks_holder.innerHTML = '';
}

const risks_holder = dom('.risks');

// HANDLE THE POTENTIAL WINS FOR ALL MARKETS ( STRAIGHT )
function handleStraightSpreadPotentialWin(index, amount) {
    const p = create('p');

    let risk_amount = parseFloat(amount) - (0.1 * amount);

    let text = `Risking $${amount} to win $${risk_amount}`;

    // get the the name -- children[2] is the td that holds the name of the bet
    let game_name = tbody.children[index].children[2].innerText;

    setAttributes(p, {
        'style': 'padding-bottom: 5px; border-bottom: 1px #E0E0E0 solid',
    })
    p.innerHTML = `${game_name} — ${text}`;

    // add risk amount and stake amount to the selectedPicks object
    selectedData.selectedPicks[index]['amount paid'] = parseFloat(amount);
    selectedData.selectedPicks[index]['amount to win'] = risk_amount; 

    risks_holder.appendChild(p);

}


function handleStraightTotalsPotentialWin(index, amount) {
    const p = create('p');

    let risk_amount = parseFloat(amount) - (0.1 * amount);

    let text = `Risking $${amount} to win $${risk_amount}`;

    // get the the name -- children[2] is the td that holds the name of the bet
    let game_name = tbody.children[index].children[2].innerText;

    setAttributes(p, {
        'style': 'padding-bottom: 5px; border-bottom: 1px #E0E0E0 solid',
    })
    p.innerHTML = `${game_name} — ${text}`

    // add risk amount and stake amount to the selectedPicks object
    selectedData.selectedPicks[index]['amount paid'] = parseFloat(amount);
    selectedData.selectedPicks[index]['amount to win'] = risk_amount; 

    risks_holder.appendChild(p);

}

function handleStraightmLinePotentialWin(index, amount) {
    const p = create('p');

    let moneyLinePrice = parseFloat(selectedData.selectedPicks[index].price);

    risk_amount = Math.sign(moneyLinePrice) == 1 ? positiveFormula(amount, index, moneyLinePrice) : negativeFormula(amount, index, moneyLinePrice);

    let text = `Risking $${amount} to win $${risk_amount}`;

    // get the the name -- children[2] is the td that holds the name of the bet
    let game_name = tbody.children[index].children[2].innerText;

    setAttributes(p, {
        'style': 'padding-bottom: 5px; border-bottom: 1px #E0E0E0 solid',
    })
    p.innerHTML = `${game_name} — ${text}`

    // add risk amount and stake amount to the selectedPicks object
    selectedData.selectedPicks[index]['amount paid'] = parseFloat(amount);
    selectedData.selectedPicks[index]['amount to win'] = risk_amount; 

    risks_holder.appendChild(p);
}


const placeBetBtn = dom('.password-btn');

placeBetBtn.onclick = () => {
    placeBet(placeBetBtn);
}

function placeBet(btn) {
    let bet = selectedData.selectedPicks;
    for(let x = 0; x < bet.length; x++) {

        bet[x]['completed'] = false;
        bet[x]['open'] = true;
        bet[x]['game'] = tbody.children[x].children[2].innerText;
        bet[x]['date'] = tbody.children[x].children[1].innerText;
    
    }
    console.log(bet);
    btn.innerHTML = 'Placing Bet...'
    fetch('https://parlaynplay.herokuapp.com/placebet', {
        mode: 'cors',
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin': 'http://localhost:5501'},
        body: JSON.stringify({
            type: type,
            bet: bet,
            token: getCookie('token')
        })
    }).then(res => res.json())
    .then(data => {
        if(data.success) {
            console.log('bet placed');
            toast('Bet(s) placed');
            // clear the bets from LS
            localStorage.removeItem('selectedData');
            setTimeout(() => {
                location.href = '/open-bets.html'
            }, 3000);
            btn.innerHTML = 'CONFIRM BET'
        }else{
            console.log(data.error);
            toast(data.error);
            btn.innerHTML = 'CONFIRM BET'
        }
    }).catch(err => {
        console.log(err);
        toast(err);
        btn.innerHTML = 'CONFIRM BET'
    })
}

function positiveFormula(amount, index, moneyline) {
    let wager = parseFloat(amount);

    // remove 10% juice
    let wagerAmount = wager - (wager * 0.1)

    let profit = (wagerAmount/100) * moneyline;

    return Math.round((profit) * 10)/10;
}

function negativeFormula(amount, index, moneyline) {
    let wager = parseFloat(amount);

    // remove 10% juice
    let wagerAmount = wager - (wager * 0.1)

    let removeMinus = -1 * parseFloat(moneyline)

    let profit = ((100/removeMinus) + 1) * wagerAmount;

    return Math.round((profit) * 10)/10; 
}
// UTILITIES
function preferedDate(date) {
    return date.toString().substring(0,10)
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

function removeOverandUnder(odd) {
    odd = odd.replaceAll('o', '');
    odd = odd.replaceAll('u', '');
    return parseFloat(odd);
}

function checkIfOverOrUnder(odd) {
    return odd.includes('o');
}

function determineNumberSign(num) {
    if(Math.sign(num) == 1) {
        return "+"+num;
    }else{
        return num;
    }
}
