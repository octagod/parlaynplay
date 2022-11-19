// const btn = dom('.category-btn');

// btn.onclick = () => {
//     let markets = Array.from(domAll('.football input'));
//     let selectedMarkets = markets.filter(mk => mk.checked)
//     for(x in selectedMarkets) {
//         console.log(selectedMarkets[x].name);
//     }
// }

// render all games

const sportsHolder = dom('.sports');

fetch('https://parlaynplay.herokuapp.com/sports', {
    mode: 'cors',
    method: 'POST',
    credentials: 'include',
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin':'http://localhost:5501;'},
    body: JSON.stringify({token: getCookie('token')})
})
.then(res => res.json())
.then(data => {
    if(data.success) {
        let docs = data.data;
        //remove loading
        sportsHolder.innerHTML = '';
        console.log(docs);
        for(let x in docs) {
            pipeData(docs[x]);
        }
        renderSports([football, basketball, baseball, rugby, cricket, golf, iceHockey, mma, soccer]);
    }else{
        M.toast({html: 'An error from the server occured'});
        console.log(data.error);
    }
}).catch(err => {
    console.log(err);
    M.toast({html: 'An error occured, try again'});
});

// all sports list
let football = [];
let soccer = [];
let cricket = [];
let golf = [];
let iceHockey = [];
let mma = [];
let basketball = [];
let baseball = [];
let rugby = [];



function pipeData(doc) {
    switch (doc.group){
        case 'American Football': 
            football.push(doc);
            break;

        case 'Soccer':
            soccer.push(doc);
            break;
        
        case 'Cricket':
            cricket.push(doc);
            break;
        
        case 'Golf':
            golf.push(doc);
            break;

        case 'Ice Hockey':
            iceHockey.push(doc);
            break;

        case 'Mixed Martial Arts':
            mma.push(doc);
            break;

        case 'Basketball':
            basketball.push(doc);
            break;

        case 'Baseball':
            baseball.push(doc);
            break;

        case 'Rugby League':
            rugby.push(doc);
            break;
    }
}

function renderSports(object) {
    for(let x in object) {
        if(object[x].length == 0){
            // do nothing
            console.log(`object ${x} is empty`);
        }else{
            sortIndividualBlock(object[x]);
        }
    }
}

function sortIndividualBlock(arr) {
    const category = create('div');
    const category_header = create('p');
    const category_body = create('div');
    const category_button_holder = create('div');
    const category_btn = create('button');

    
    // set class name
    category.classList.add('category', `${changeSpacedWords(arr[0].group)}`);
    category_header.classList.add('category-header');
    category_body.classList.add('category-body');
    category_button_holder.classList.add('category-button', 'center', `${changeSpacedWords(arr[0].group)}`);
    category_btn.classList.add('category-btn');
    

    category_header.innerHTML = (arr[0].group).toString().toUpperCase();
    category_btn.innerHTML = 'CONTINUE';

    for(x in arr) {
        renderTitle(arr[x], category_body);
    }

    category_button_holder.appendChild(category_btn);
    category.appendChild(category_header);
    category.appendChild(category_body);
    category.appendChild(category_button_holder);

    sportsHolder.appendChild(category);

    category_btn.onclick = () => {
        let market = Array.from(domAll(`.${changeSpacedWords(arr[0].group)} input`));
        let selectedMarkets = market.filter(mk => mk.checked);
        if(selectedMarkets.length >= 1) {
            let values = [];
            for(x in selectedMarkets) {
                values[x] = selectedMarkets[x].value;
            }
            let keys = values.toString();
            location.href = `/picks.html?picks=${keys}&type=${type}`;
        }else{
            toast(`Kindly select a sport from ${(arr[0].group).toString().toUpperCase()} group`);
        }
    }

}

function renderTitle(doc, holder) {
    const label = create('label');
    const input = create('input');
    const span = create('span');

    input.setAttribute('name', `${doc.group}`);
    input.setAttribute('type', 'checkbox');
    input.setAttribute('value', `${doc.key}`);

    span.innerHTML = doc.title;
    label.appendChild(input);
    label.appendChild(span);
    holder.appendChild(label);

}

function changeSpacedWords(word) {
    let newWord = word.replaceAll(' ', '_');
    return newWord;
}

