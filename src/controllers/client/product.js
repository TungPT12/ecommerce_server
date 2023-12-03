const Product = require('../../models/Product');
const sendEmail = require('../../utils/send-email');
const winston = require('../../utils/winston');
const paging = require('../../utils/paging');
const { searchProductByCategoryId, searchProductByName } = require('../../utils/searchProduct');
const resultPerPage = 8;


// exports.getProducts = async (req, res) => {
//     try {
//         sendEmail('boypham12042000@gmail.com', `Tung's Store`, '<h1>Thanks buy product from our store</h1>')
//         winston.log({
//             level: 'info',
//             message: 'Hello distributed log files!'
//         });
//         res.json('sadas')
//     } catch (error) {
//         winston.warn('error')
//     }
// }

exports.getTopTrendingProducts = async (req, res) => {
    try {
        const products = await Product.find({
            quantity: { $gt: 0 }
        })
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

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (id) {
            const product = await Product.findById(id)
                .populate('category')
            if (product) {
                return res.send(JSON.stringify(product));
            }
        }
        return res.status(400).send(JSON.stringify({
            message: "Cannot get product",
            success: false
        }))
    } catch (error) {
        console.log(error);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

exports.getProductByCategoryId = async (req, res) => {
    try {
        const { categoryId } = req.params;
        if (categoryId) {
            const products = await Product.find({
                category: categoryId,
                quantity: { $gt: 0 }
            })
            if (products) {
                return res.send(JSON.stringify({
                    results: products,
                }));
            }
        }
        return res.status(400).send(JSON.stringify({
            message: "Cannot get products by category id!",
            success: false
        }))
    } catch (error) {
        console.log(error);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

exports.getProducts = async (req, res) => {
    try {
        let { page, categoryId, name } = req.query;
        const products = await Product.find({
            quantity: { $gt: 0 }
        })

        let productFiltered = products;

        if (categoryId) {
            productFiltered = searchProductByCategoryId(productFiltered, categoryId)
        }

        if (name) {
            productFiltered = searchProductByName(productFiltered, name)
        }
        if (page) {
            page = parseInt(page)
            if (productFiltered.length === 0) {
                return res.send(JSON.stringify({
                    page: 0,
                    results: [],
                    pageSize: 0,
                }))
            }
            const total_pages = Math.ceil(productFiltered.length / resultPerPage);
            if (page > total_pages) {
                return res.send(JSON.stringify({
                    errors: `page must be less than or equal to ${total_pages}`,
                    success: false
                }));
            }

            const results = paging(productFiltered, resultPerPage, page)
            return res.send(JSON.stringify({
                page: page ? page : 1,
                results: results,
                total_pages: total_pages
            }))
        }
        return res.json({
            results: productFiltered,
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}
