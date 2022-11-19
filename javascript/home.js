const straight = dom('.straight');
const parley = dom('.parley');

parley.onclick = () => {
    location.href = '/sports/?type=parley';
}
straight.onclick = () => {
    location.href = '/sports/?type=straight';
}

const tbody = dom('tbody');

fetch('https://parlaynplay.herokuapp.com/home-stat', {credentials: 'include'})
.then(res => res.json())
.then(data => {
    if(data.success) {
        const doc = data.data;
        renderStat(doc);
    }else{
        console.log(data.error);
        M.toast({html: 'An error occured from the server'})
    }
}).catch(err => {
    console.log(err);
    M.toast({html: `${err}`});
})


function renderStat(data) {
    tbody.innerHTML = 'NO DATA AT THIS TIME'
}