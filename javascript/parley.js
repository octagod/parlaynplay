// formular for under dogs and favorites
const underdog = (odd) => {
    return Math.round(((odd/100) + 1) * 10)/10;
}
const favorites = (odd) => {
    return Math.round(((100/odd) + 1) * 10)/10;
}


function singleParleyMline(maxPayout, btn) {

    let decimalOdds = [];

    let userFinalAmount = parseFloat(amount_input.value) - (parseFloat(amount_input.value) * 0.1) //remove tax
    

    // loop through the mLine odds(price) to determine sign(-)/(+) and convert to decimal odd
    for(let x in selectedData.selectedPicks) {
        if(Math.sign(selectedData.selectedPicks[x].price) == 1) {
            // positive odd - underdogs
            decimalOdds[x] = underdog(selectedData.selectedPicks[x].price);
        }else{
            // negative odd - favorite
            decimalOdds[x] = favorites(Math.abs(selectedData.selectedPicks[x].price));
        }

    }

    console.log(decimalOdds);

    let potentialWin;
    let oddsProduct = 1;
    for(let o in decimalOdds) oddsProduct *= decimalOdds[o];

    // reduce odds product to 1 decimal places
    oddsProduct = Math.round(oddsProduct * 10)/10;
    console.log(oddsProduct);
    potentialWin = oddsProduct * parseFloat(userFinalAmount);
    console.log(potentialWin);
    
    if(potentialWin > maxPayout) {
        toast('Reduce your number of games or your stake amount', 8000);
        toast(`Your potential win can not be more than $${maxPayout}`, 8000);
        btn.innerHTML = 'Proceed';
    }else{
         // open popup
         popup.classList.remove('hide');
         dom('.parley-risk-amount p').innerHTML = `Risking $${amount_input.value} to win $${Math.floor(potentialWin)}`;
 
         for(let x = 0; x < selectedData.selectedPicks.length; x++) {
             let p = create('p');
 
             p.innerHTML = tbody.children[x].children[2].innerText;
             setAttributes(p, {
                 'style': 'padding-bottom: 5px; border-bottom: 1px #E0E0E0 solid',
             });
 
             // add risk amount and stake amount to the selectedPicks object
             selectedData.selectedPicks[x]['amount paid'] = parseFloat(amount_input.value);
             selectedData.selectedPicks[x]['amount to win'] = Math.floor(potentialWin); 
             selectedData.selectedPicks[x]['amount without tax'] = userFinalAmount; 
             
             risks_holder.appendChild(p);
         }
         btn.innerHTML = 'Proceed';
    }
}

function singleParleySpreadNTotal(maxPayout, btn) {
    const spreadAndTotalsFormular = {
        2 : 2.5,
        3: 5,
        4: 10,
        5: 20,
        6: 30
    }

    let userFinalAmount = parseFloat(amount_input.value) - (parseFloat(amount_input.value) * 0.1) //remove tax

    // get how many games were selected and calculate the potential win
    let potentialWin = userFinalAmount * spreadAndTotalsFormular[selectedData.selectedPicks.length];
    
    if(potentialWin > maxPayout) {
        toast('Reduce your number of games or your stake amount', 8000);
        toast(`Your potential win can not be more than $${maxPayout}`, 8000);
        btn.innerText = 'Proceed';
    }else{
        // open popup
        popup.classList.remove('hide');
        dom('.parley-risk-amount p').innerHTML = `Risking $${amount_input.value} to win $${Math.floor(potentialWin)}`;

        for(let x = 0; x < selectedData.selectedPicks.length; x++) {
            let p = create('p');

            p.innerHTML = tbody.children[x].children[2].innerText;
            setAttributes(p, {
                'style': 'padding-bottom: 5px; border-bottom: 1px #E0E0E0 solid',
            });

            // add risk amount and stake amount to the selectedPicks object
            selectedData.selectedPicks[x]['amount paid'] = parseFloat(amount_input.value);
            selectedData.selectedPicks[x]['amount to win'] = Math.floor(potentialWin); 
            selectedData.selectedPicks[x]['amount without tax'] = userFinalAmount; 
            
            risks_holder.appendChild(p);
        }
        btn.innerHTML = 'Proceed';
    }
}

function multipleParley(maxPayout, btn) {
    let decimalOdds = [];

    let userFinalAmount = parseFloat(amount_input.value) - (parseFloat(amount_input.value) * 0.1) //remove tax
    

    // loop through the mLine odds(price) to determine sign(-)/(+) and convert to decimal odd
    for(let x in selectedData.selectedPicks) {
        if(Math.sign(selectedData.selectedPicks[x].price) == 1) {
            // positive odd - underdogs
            decimalOdds[x] = underdog(selectedData.selectedPicks[x].price);
        }else{
            // negative odd - favorite
            decimalOdds[x] = favorites(Math.abs(selectedData.selectedPicks[x].price));
        }

    }

    let potentialWin;
    let oddsProduct = 1;
    for(let o in decimalOdds) oddsProduct *= decimalOdds[o];

    // reduce odds product to 1 decimal places
    oddsProduct = Math.round(oddsProduct * 10)/10;
    potentialWin = oddsProduct * parseFloat(userFinalAmount);
    
    if(potentialWin > maxPayout) {
        toast('Your potential win can not exceed $'+maxPayout, 8000);
        toast('Reduce your number of games or your stake amount', 8000);
        btn.innerHTML = 'Proceed';
    }else{
         // open popup
         popup.classList.remove('hide');
         dom('.parley-risk-amount p').innerHTML = `Risking $${amount_input.value} to win $${Math.floor(potentialWin)}`;
 
         for(let x = 0; x < selectedData.selectedPicks.length; x++) {
             let p = create('p');
 
             p.innerHTML = tbody.children[x].children[2].innerText;
             setAttributes(p, {
                 'style': 'padding-bottom: 5px; border-bottom: 1px #E0E0E0 solid',
             });
 
             // add risk amount and stake amount to the selectedPicks object
             selectedData.selectedPicks[x]['amount paid'] = parseFloat(amount_input.value);
             selectedData.selectedPicks[x]['amount to win'] = Math.floor(potentialWin); 
             selectedData.selectedPicks[x]['amount without tax'] = userFinalAmount; 
             
             risks_holder.appendChild(p);
         }
         btn.innerHTML = 'Proceed';
    }

}