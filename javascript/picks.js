let allData = [];

const picks = UrlParams.get('picks');

// get markets for picks
const picksList = picks.split(',');

// arrays to store outright picks and regular picks
let outrightsArray = [];
let regularArray = []; 

// parent element
const sports = dom('.sports');


fetch('https://parlaynplay.herokuapp.com/picks', {
    mode: 'cors',
    method: 'POST',
    credentials: 'include',
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin':'http://localhost:5501;'},
    body: JSON.stringify({picks: picksList, token: getCookie('token')})
}).then(res => res.json())
.then(data => {
    if(data.success) {
        const currentTimestamp = Date.now();
        
        let doc = [];
        let unfilteredData = data.data;
        console.log('unfilteredData')
        console.log(unfilteredData)

        for(let x in unfilteredData) {
            doc.push(unfilteredData[x].filter(uf => currentTimestamp < Date.parse(uf.commence_time)));
        }

        console.log('Filtered data');
        console.log(doc);
        // Add the doc to allData
        for(let d in doc) {
            for(let i=0; i < doc[d].length; i++) {
                allData.push(doc[d][i]);
            }
        }
        // check if picks are more than 1
        if(picksList.length > 0) {
            //loop through the array data gotten from the server to check for outrights and regular picks
            for(x in doc) {
                checkForOutrightPicks(doc[x])
            }
            sports.innerHTML = '';
            checkIfOutrightsHaveValue();
            checkIfRegularsHaveValue();
            renderButton();

        }
    }else{
        toast(data.error);
    }
}).catch(err => {
    console.log(err);
    M.toast({html: 'An error occured'});
})


//check for outrights picks and store in the outrights Array else store in regular Array
function checkForOutrightPicks(doc) {
    if(doc[0].has_outrights) {
        //add to outrights array
        outrightsArray.push(doc);
    }else{
        //add to regular array
        regularArray.push(doc);
    }
}


function checkIfOutrightsHaveValue() {
    if(outrightsArray.length > 0) {
        // render outright 
        outrightsArray.forEach(doc => {
            renderOutrightPicks(doc);
        })
    }
}

function checkIfRegularsHaveValue() {
    if(regularArray.length > 0) {
        // render regular
        renderRegularPicks(regularArray);
    }
}

function renderOutrightPicks(doc) {
    for(x in doc) {
        // renderIndividualOutrightPick(doc[x]);
        // TODO: UNCOMMENT TO RENDER OUTRIGHT PICKS
    }
}

function renderRegularPicks(doc) {
    for(i in doc) {
        renderIndividualRegularPick(doc[i]);
    }
}


function renderIndividualOutrightPick(data) {
    const o_wrapper = create('div');
    const table = create('table');
    const outright_heading = create('tr');
    const outrightTitle = create('th');
    const linesFrom = create('th');
    const instructions = create('tr');
    const cutOff = create('td')
    const numb_ = create('td')
    const description = create('td')
    const odds = create('td')
    const titleDateHolder = create('tr');
    const titleDate = create('td')
    const outrightDateTimeAndTitleHolder = create('tr')
    const outrightDateAndTime = create('td');
    const outrightTitleOddToWIn = create('td');
    
    const holdContent = create('tbody');

    // GET THE OUTCOMES AND SAVE TO AN ARRAY
    let outcomes = data.bookmakers[0].markets[0].outcomes;

    for(x in outcomes) {
        renderOutrightBookmakers(outcomes[x], x, holdContent, data.id);
    }

    // setting class name
    o_wrapper.classList.add('outright-wrapper');
    outright_heading.classList.add('outright-heading');
    linesFrom.classList.add('line-from');
    outrightTitle.classList.add('outright-title')
    instructions.classList.add('instructions');
    titleDate.classList.add('text-center', 'outright-title-and-date');

    // set other parameters
    titleDate.setAttribute('colspan', '4');
    outrightTitle.setAttribute('colspan', '2');
    linesFrom.setAttribute('colspan', '2');
    outrightDateAndTime.setAttribute('colspan', '2');

    // adding value
    outrightTitle.innerHTML = data.sport_title;
    linesFrom.innerHTML = `Lines From: ${preferedDate(data.bookmakers[0].last_update)}`
    cutOff.innerHTML = 'Cut Off';
    numb_.innerHTML = '#';
    description.innerHTML = 'Description';
    odds.innerHTML = 'Odds';

    titleDate.innerHTML = `${data.sport_title} - ${convertToMonth((data.commence_time).substring(5,7))} ${(data.commence_time).substring(8,10)}`;

    outrightDateAndTime.innerHTML = `${convertToMonth((data.commence_time).substring(5,7))} ${(data.commence_time).substring(8,10)} - ${(data.commence_time).toString().substring(11,16)}`

    outrightTitleOddToWIn.innerHTML = `${data.sport_title} - ODD TO WIN`;

    // APPENDING ELEMENTS
    outright_heading.appendChild(outrightTitle)
    outright_heading.appendChild(linesFrom)
    instructions.appendChild(cutOff)
    instructions.appendChild(numb_)
    instructions.appendChild(description)
    instructions.appendChild(odds)
    titleDateHolder.appendChild(titleDate)
    outrightDateTimeAndTitleHolder.appendChild(outrightDateAndTime)
    outrightDateTimeAndTitleHolder.appendChild(outrightTitleOddToWIn);
    table.appendChild(outright_heading);
    table.appendChild(instructions);
    table.appendChild(titleDateHolder);
    table.appendChild(outrightDateTimeAndTitleHolder);
    table.appendChild(holdContent);
    o_wrapper.appendChild(table);
    sports.appendChild(o_wrapper);
    
}

function renderOutrightBookmakers(outcome, index, holder, outrightGameId) {
    const gameHolder = create('tr');
    const space = create('td');
    const id = create('td')
    const team = create('td')
    const odd_cell = create('td');
    const label = create('label');
    const checkbox = create('input');
    const odd = create('span');

    //set classnames


    // set values
    id.innerHTML = parseFloat(index) + 1;
    team.innerHTML = outcome.name;
    odd.innerHTML = '+'+outcome.price;
    checkbox.setAttribute('value', outcome.price);
    checkbox.setAttribute('type', 'checkbox');
    setAttributes(checkbox, {
        'value': outcome.price,
        'type': 'checkbox',
        'data-name': outcome.name,
        'data-type': 'outright',
        'data-id': outrightGameId
    })

    // appending elements
    label.appendChild(checkbox)
    label.appendChild(odd)
    odd_cell.appendChild(label)
    gameHolder.appendChild(space);
    gameHolder.appendChild(id);
    gameHolder.appendChild(team);
    gameHolder.appendChild(odd_cell);
    holder.appendChild(gameHolder);
}

function renderIndividualRegularPick(data) {
    const regular_wrapper = create('div');
    const table = create('table');
    const regular_heading = create('tr');
    const regularTitle = create('th');
    const linesFrom = create('th');
    const instructions = create('tr');
    const date = create('td');
    const numb_ = create('td');
    const team = create('td');
    const spread = create('td');
    const total = create('td');
    const mLine = create('td');
    const regularTitleAndDateHolder = create('tr');
    const regularTitleAndDate = create('td');
    const tbody = create('tbody');
    

    // for each game
    for(a in data) {
        renderRegularGame(data[a], tbody, a);
    }

    // classnames
    regular_wrapper.classList.add('regular-wrapper');
    regularTitle.classList.add('regular_title')
    linesFrom.classList.add('line-from');
    instructions.classList.add('instructions');


    //set other parameters
    setAttributes(regularTitle, {'colspan': '3'})
    setAttributes(linesFrom, {'colspan': '3'})
    setAttributes(regularTitleAndDate, {'colspan': '6'});


    // set values
    regularTitle.innerHTML = data[0].sport_title;
    linesFrom.innerHTML = `Lines From: ${preferedDate(data[0].bookmakers[0].last_update)}`;
    date.innerHTML = 'Date';
    numb_.innerHTML = '#';
    team.innerHTML = 'Team';
    spread.innerHTML = 'Spread';
    total.innerHTML = 'Total';
    mLine.innerHTML = 'M Line';
    regularTitleAndDate.innerHTML = `${data[0].sport_title} - ${convertToMonth(data[0].commence_time.toString().substring(5, 7))} ${data[0].commence_time.toString().substring(8, 10)}`;


    //append Element
    regular_heading.appendChild(regularTitle)
    regular_heading.appendChild(linesFrom)
    instructions.appendChild(date)
    instructions.appendChild(numb_)
    instructions.appendChild(team)
    instructions.appendChild(spread)
    instructions.appendChild(total)
    instructions.appendChild(mLine)
    regularTitleAndDateHolder.appendChild(regularTitleAndDate)
    table.appendChild(regular_heading)
    table.appendChild(instructions)
    table.appendChild(regularTitleAndDateHolder)
    table.appendChild(tbody)
    regular_wrapper.appendChild(table)
    sports.appendChild(regular_wrapper);

};

function renderRegularGame(game, holder, index) {
    const dayRow = create('tr');
    const day = create('td');
    const homeGameId = create('td');
    const homeTeam = create('td');
    const homeGameSpread = create('td');
    const homeGameTotal = create('td');
    const homeGameMLine = create('td');
    const timeRow = create('tr');
    const time = create('td');
    const awayGameId = create('td');
    const awayTeam = create('td');
    const awayGameSpread = create('td');
    const awayGameTotal = create('td');
    const awayGameMLine = create('td');

    const homeSpreadLabel = create('label');
    const homeSpreadCheckbox = create('input');
    const homeSpreadSpan = create('span');
    const homeTotalLabel = create('label');
    const homeTotalCheckbox = create('input');
    const homeTotalSpan = create('span');
    const homeMLineLabel = create('label');
    const homeMLineCheckbox = create('input');
    const homeMLineSpan = create('span');

    const awaySpreadLabel = create('label');
    const awaySpreadCheckbox = create('input');
    const awaySpreadSpan = create('span');
    const awayTotalLabel = create('label');
    const awayTotalCheckbox = create('input');
    const awayTotalSpan = create('span');
    const awayMLineLabel = create('label');
    const awayMLineCheckbox = create('input');
    const awayMLineSpan = create('span');


    // get the markets
    let bookie = getBookmaker(game.bookmakers, game.home_team, game.away_team);
    
    //if bookie is not undefined render the bet
    if(bookie) {
        
        let markets = bookie.markets;
        let bookmaker_index = bookie.bookmaker_index
        
        
        // get H2H (M Line) for both home and away teams
         // do a check before passing theprice in determineNumberSign as the api sometimes switches the placements of the team in the outcomes
        let homeTeamMLineOdd = determineNumberSign(num = markets[0].outcomes[0].name == game.home_team ? markets[0].outcomes[0].price : markets[0].outcomes[1].price);
        
        let awayTeamMLineOdd = determineNumberSign(num = markets[0].outcomes[1].name == game.away_team ? markets[0].outcomes[1].price : markets[0].outcomes[0].price);
    
        // get spread (handicap) for both teams  
        // do a check before passing the point & price in determineNumberSign as the api sometimes switches the placements of the team in the outcomes
        let homeTeamSpreadPointNPrice = `${determineNumberSign(num = markets[1].outcomes[0].name == game.home_team ? markets[1].outcomes[0].point : markets[1].outcomes[1].point)}${determineNumberSign(num = markets[1].outcomes[0].name == game.home_team ? markets[1].outcomes[0].price : markets[1].outcomes[1].price)}`;
    
        let awayTeamSpreadPointNPrice = `${determineNumberSign(num = markets[1].outcomes[1].name == game.away_team ? markets[1].outcomes[1].point : markets[1].outcomes[0].point)}${determineNumberSign(num = markets[1].outcomes[1].name == game.away_team ? markets[1].outcomes[1].price : markets[1].outcomes[0].price)}`;
    
        // get totals(Over/Under) for both teams | home team is Over while Away team is Under
        let homeTeamTotalsPointNPrice = markets[2].outcomes[0].point == undefined ? 'null' : `o${markets[2].outcomes[0].point}${determineNumberSign(markets[2].outcomes[0].price)}`;
        let awayTeamTotalsPointNPrice = markets[2].outcomes[1].point == undefined ? 'null' : `u${markets[2].outcomes[1].point}${determineNumberSign(markets[2].outcomes[1].price)}`;
    
        //class names
        index%2 == 1 ? dayRow.classList.add('grey', 'lighten-4') : '' //add grey color to the odd number cells
        index%2 == 1 ? timeRow.classList.add('grey', 'lighten-4') : '' //add grey color to the odd number cells
    
        // setting additional values
        // create attach corresponding data to the checkboxes
        // home team
        setAttributes(homeSpreadCheckbox, {
            "data-point": `${game.home_team == markets[1].outcomes[0].name ? markets[1].outcomes[0].point : markets[1].outcomes[1].point}`, 
            "data-price": `${game.home_team == markets[1].outcomes[0].name ? markets[1].outcomes[0].price : markets[1].outcomes[1].price}`, 
            'type' : 'checkbox',
            'data-type': 'regular',
            'data-id': game.id,
            'data-market': 'spread',
            'data-bookmaker': bookmaker_index,
            'data-team' : game.home_team,
            'data-sport_key': game.sport_key
        }); //home team spread checkbox
    
    
        setAttributes(homeTotalCheckbox, {
            'data-point': `o${markets[2].outcomes[0].point}`,
            'data-price': `${markets[2].outcomes[1].point == 'Over'? markets[2].outcomes[0].price : markets[2].outcomes[1].price}`, 
            'type' : 'checkbox',
            'data-type': 'regular',
            'data-id': game.id,
            'data-market': 'totals',
            'data-bookmaker': bookmaker_index,
            'data-team' : game.home_team,
            'data-sport_key': game.sport_key
        }); //home team total checkbox
    
        setAttributes(homeMLineCheckbox, {
            'data-price': `${game.home_team == markets[0].outcomes[0].name ? markets[0].outcomes[0].price : markets[0].outcomes[1].price}`, 
            'type' : 'checkbox',
            'data-type': 'regular',
            'data-id': game.id,
            'data-market': 'mLine',
            'data-bookmaker': bookmaker_index,
            'data-team' : game.home_team,
            'data-sport_key': game.sport_key
        }); //home team M Line
    
        //Away team
        setAttributes(awaySpreadCheckbox, {
            "data-point": `${game.away_team == markets[1].outcomes[1].name ? markets[1].outcomes[1].point : markets[1].outcomes[0].point }`, 
            "data-price": `${game.away_team == markets[1].outcomes[1].name ? markets[1].outcomes[1].price : markets[1].outcomes[0].price}`, 
            'type' : 'checkbox',
            'data-type': 'regular',
            'data-id': game.id,
            'data-market': 'spread',
            'data-bookmaker': bookmaker_index,
            'data-team' : game.away_team,
            'data-sport_key': game.sport_key
        }); //away team spread checkbox
    
        setAttributes(awayTotalCheckbox, {
            'data-point': `u${markets[2].outcomes[1].point}`, 
            'data-price': `${markets[2].outcomes[1].point == 'Under' ? markets[2].outcomes[1].price : markets[2].outcomes[0].price}`, 
            'type' : 'checkbox',
            'data-type': 'regular',
            'data-id': game.id,
            'data-market': 'totals',
            'data-bookmaker': bookmaker_index,
            'data-team' : game.away_team,
            'data-sport_key': game.sport_key
        }); //away team total checkbox
    
        setAttributes(awayMLineCheckbox, {
            'data-price': `${game.away_team == markets[0].outcomes[1].name ? markets[0].outcomes[1].price : markets[0].outcomes[0].price}`, 
            'type' : 'checkbox',
            'data-type': 'regular',
            'data-id': game.id,
            'data-market': 'mLine',
            'data-bookmaker': bookmaker_index,
            'data-team' : game.away_team,
            'data-sport_key': game.sport_key
        }); //away team M Line
    
    
        // set values
        day.innerHTML = `${convertToMonth(game.commence_time.toString().substring(5,7))} ${game.commence_time.toString().substring(8,10)}`;
        homeGameId.innerHTML = `${getEvenNumber(index)}`;
        homeTeam.innerHTML = game.home_team;
        homeSpreadSpan.innerHTML = homeTeamSpreadPointNPrice;
        homeTotalSpan.innerHTML = homeTeamTotalsPointNPrice;
        homeMLineSpan.innerHTML = homeTeamMLineOdd;
        time.innerHTML = `${game.commence_time.toString().substring(11, 16)}`;
        awayGameId.innerHTML = `${getOddNumber(index)}`;
        awayTeam.innerHTML = game.away_team;
        awaySpreadSpan.innerHTML = awayTeamSpreadPointNPrice;
        awayTotalSpan.innerHTML = awayTeamTotalsPointNPrice;
        awayMLineSpan.innerHTML = awayTeamMLineOdd;
        
    
        // append elements
        homeSpreadLabel.appendChild(homeSpreadCheckbox)
        homeSpreadLabel.appendChild(homeSpreadSpan);
        homeTotalLabel.appendChild(homeTotalCheckbox)
        homeTotalLabel.appendChild(homeTotalSpan)
        homeMLineLabel.appendChild(homeMLineCheckbox)
        homeMLineLabel.appendChild(homeMLineSpan)
        awaySpreadLabel.appendChild(awaySpreadCheckbox)
        awaySpreadLabel.appendChild(awaySpreadSpan);
        awayTotalLabel.appendChild(awayTotalCheckbox)
        awayTotalLabel.appendChild(awayTotalSpan)
        awayMLineLabel.appendChild(awayMLineCheckbox)
        awayMLineLabel.appendChild(awayMLineSpan)
    
        homeGameSpread.appendChild(homeSpreadLabel);
        homeGameTotal.appendChild(homeTotalLabel)
        homeGameMLine.appendChild(homeMLineLabel);
        awayGameSpread.appendChild(awaySpreadLabel)
        awayGameTotal.appendChild(awayTotalLabel)
        awayGameMLine.appendChild(awayMLineLabel)
    
        dayRow.appendChild(day)
        dayRow.appendChild(homeGameId)
        dayRow.appendChild(homeTeam)
        dayRow.appendChild(homeGameSpread)
        dayRow.appendChild(homeGameTotal)
        dayRow.appendChild(homeGameMLine)
        timeRow.appendChild(time)
        timeRow.appendChild(awayGameId)
        timeRow.appendChild(awayTeam)
        timeRow.appendChild(awayGameSpread)
        timeRow.appendChild(awayGameTotal)
        timeRow.appendChild(awayGameMLine)
    
        holder.appendChild(dayRow)
        holder.appendChild(timeRow);

    }
}


// fixed continue button
function renderButton () {
    const buttonHolder = create('div');
    const button = create('button');

    buttonHolder.classList.add('button-holder');
    button.classList.add('continue-button');

    button.innerHTML = 'Continue';

    buttonHolder.appendChild(button);
    sports.appendChild(buttonHolder);

    button.onclick = () => {
        let allOptions = domAll('[type="checkbox"]');
        let sPs = Array.from(allOptions).filter(ap => ap.checked);


        if(type == 'straight' && hasDuplicates(sPs)) {
            toast('You can not make multiple selections on the same game')
        }else if(sPs.length == 0) {
            toast('Make a pick before you can proceed');
        }else{ 
            if(type == 'parley') {
                if(sPs.length <= 1){ 
                    toast('You are required to select a min of 2 games for Parley')
                }else {
                    //loop through all data to get the data of selected ids
                    let selectedPicksData = [];
                    for(let x in sPs) {
                        let arr = [];
                        arr[0] = allData.filter(ad => ad.id == sPs[x].dataset.id)
                        // selectedPicksData.push(allData.filter(ad => ad.id == sPs[x].dataset.id));
                        selectedPicksData.push(arr[0][0]);
                    }

                    //add the selected picks to an array
                    let selectedPicks = [];
                    for(let x in sPs) {
                        selectedPicks[x] = {...sPs[x].dataset}
                    }
                    console.log(selectedPicks);


                    const selectedData = {'selectedPicksData' : selectedPicksData, 'selectedPicks': selectedPicks};

                    // console.log(selectedData);

                    localStorage.setItem('selectedData', JSON.stringify(selectedData));
                    location.href = `/wager.html?picks=${picks}&type=${type}`;
                }
            }else{
                //loop through all data to get the data of selected ids
                let selectedPicksData = [];
                for(let x in sPs) {
                    let arr = [];
                    arr[0] = allData.filter(ad => ad.id == sPs[x].dataset.id)
                    // selectedPicksData.push(allData.filter(ad => ad.id == sPs[x].dataset.id));
                    selectedPicksData.push(arr[0][0]);
                }
                
                //add the selected picks to an array
                let selectedPicks = [];
                for(let x in sPs) {
                    selectedPicks[x] = {...sPs[x].dataset}
                }
                console.log(selectedPicks);
    
    
                const selectedData = {'selectedPicksData' : selectedPicksData, 'selectedPicks': selectedPicks};
                
                // console.log(selectedData);
                
                localStorage.setItem('selectedData', JSON.stringify(selectedData));
                location.href = `/wager.html?picks=${picks}&type=${type}`;
            }
        }
    }
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

// function convertTo12hours(time) {
//     const hour = time.substring(0, 2);
//     if(hour > 11) {
        
//     }
// }

function getBookmaker(arrs, home_team, away_team) {
    let market = [];

    //check if this bookmaker has 3 markets
    for(let arr in arrs) {
        market = arrs[arr].markets
        if(market.length == 3) {
            return {markets: market, bookmaker_index: arr};
        }
    }

    // this will run if bookmaker doesnt have up 3 markets but have up to 2
    for(let arr in arrs) {
        market = arrs[arr].markets
        if(market.length == 2) {
            // does not have 3 market options
            market[2] = market[1] // make totals object the last object on the array market
            //make spreads the second object on the array market
            market[1] = {
                "key": "spreads",
                "outcomes": [
                    {
                        "name": `${home_team}`,
                        "price": '-'+null,
                        "point": null
                    },
                    {
                        "name": `${away_team}`,
                        "price": '-'+null,
                        "point": null
                    }
                ]
            }
            console.log(`has 2 markets: ${market.length}`);
            return {markets: market, bookmaker_index: arr};
        }
    }

    // this will run if bookmaker doesnt have 3 or 2 markets but have up to 1
    for(let arr in arrs) {
        market = arrs[arr].markets
        if(market.length == 1) {
            // create a spread object
            market[1] = {
                "key": "spreads",
                "outcomes": [
                    {
                        "name": `${home_team}`,
                        "price": '-'+null,
                        "point": null
                    },
                    {
                        "name": `${away_team}`,
                        "price": '-'+null,
                        "point": null
                    }
                ]
            }
            // create a totals object
            market[2] = {
                "key": "totals",
                "outcomes": [
                    {
                        "name": "Over",
                        "price": -null,
                        "point": null
                    },
                    {
                        "name": "Under",
                        "price": +null,
                        "point": null
                    }
                ]
            }
            console.log(`has 1 market: ${market.length}`)
            return {markets: market, bookmaker_index: arr}
        }
    }

    // this will run if bookmaker doesnt have 3 or 2 markets but have up to 1 //TODO
    for(let arr in arrs) {
        market = arrs[arr].markets
        if(market.length == 0) {
            // create a mLine object
            market[0] = {
                "key": "h2h",
                "outcomes": [
                    {
                        "name": `${home_team}`,
                        "price": null
                    },
                    {
                        "name": `${away_team}`,
                        "price": null
                    }
                ]
            }
            // create a spread object
            market[1] = {
                "key": "spreads",
                "outcomes": [
                    {
                        "name": `${home_team}`,
                        "price": '-'+null,
                        "point": null
                    },
                    {
                        "name": `${away_team}`,
                        "price": '-'+null,
                        "point": null
                    }
                ]
            }
            // create a totals object
            market[2] = {
                "key": "totals",
                "outcomes": [
                    {
                        "name": "Over",
                        "price": -null,
                        "point": null
                    },
                    {
                        "name": "Under",
                        "price": +null,
                        "point": null
                    }
                ]
            }
            console.log(`has 0 market: ${market.length}`)
            console.log(market);
            return {markets: market, bookmaker_index: arr}
        }
    }

}

function getEvenNumber(num) {
    return 2 * parseInt(num);
}

function getOddNumber(num) {
    return 2 * parseInt(num) + 1;
}

function hasDuplicates(array) {
    var valuesSoFar = Object.create(null);
    for (var i = 0; i < array.length; ++i) {
        var value = array[i].dataset.id;
        if (value in valuesSoFar) {
            return true;
        }
        valuesSoFar[value] = true;
    }
    return false;
}

function determineNumberSign(num) {
    if(Math.sign(num) == 1) {
        return "+"+num;
    }else{
        return num;
    }
}