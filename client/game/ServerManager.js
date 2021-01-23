const fetch = require('node-fetch')


async function request(url) {
    try {
        var res = await fetch(url)
        .then(res => res.text())
        .then(text => {return text;})
        return res;
    } catch (e) {
        return "Err";
    }
}

module.exports = {
    request
}