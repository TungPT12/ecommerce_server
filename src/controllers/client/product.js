const sendEmail = require('../../utils/send-email');
const winston = require('../../utils/winston');


exports.getProduct = async (req, res) => {
    try {
        sendEmail('boypham12042000@gmail.com', `Tung's Store`, '<h1>Thanks buy product from our store</h1>')
        winston.log({
            level: 'info',
            message: 'Hello distributed log files!'
        });
        res.json('sadas')
    } catch (error) {
        winston.warn('error')
    }
}