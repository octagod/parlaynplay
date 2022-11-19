
const straight = dom('.straight');
const parley = dom('.parley');

parley.onclick = () => {
    location.href = '/sports/?type=parley';
}
straight.onclick = () => {
    location.href = '/sports/?type=straight';
}

const UrlParams = new URLSearchParams(window.location.search);
const type = UrlParams.get('type');