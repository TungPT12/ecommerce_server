const Category = require('../../models/Category');
const Product = require('../../models/Product');

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        if (categories.length === 0) {
            return res.send(JSON.stringify({
                results: [],
            }))
        }
        return res.send(JSON.stringify({
            results: categories
        }))
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}
