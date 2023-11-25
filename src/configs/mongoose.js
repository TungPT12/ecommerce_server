const mongoose = require('mongoose');
const getKeyEnvironmentVariable = require('../utils/getKeyEnvironmentVariable');
const uri = getKeyEnvironmentVariable('MONGODB_URI');
const connectMongoose = (callback) => {
    mongoose.connect(uri).then((client) => {
        callback();
    }).catch((error) => {
        console.log(error)
        throw "Error connect mongoose"
    })
}

module.exports = connectMongoose;