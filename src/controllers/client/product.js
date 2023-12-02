const Product = require('../../models/Product');
const sendEmail = require('../../utils/send-email');
const winston = require('../../utils/winston');


exports.getProducts = async (req, res) => {
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

exports.getTopTrendingProducts = async (req, res) => {
    try {
        const products = await Product.find()
        if (products.length < 8) {
            return res.json({
                results: products,
            })
        }
        if (products.length === 0) {
            return res.send(JSON.stringify({
                results: [],
            }))
        }
        let topProducts = [];
        for (let index = 0; index < 8; index++) {
            topProducts.push(products[index])
        }

        return res.json({
            results: topProducts,
        })
    } catch (error) {
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}