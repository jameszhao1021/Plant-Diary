const Plant = require('../models/plant');

async function show(req, res){
    res.render('plants/log')
}

module.exports = {
    show,
}