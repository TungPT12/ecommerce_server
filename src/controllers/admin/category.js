const Category = require('../../models/Category');
const Product = require('../../models/Product');
const paging = require('../../utils/paging');
const { validationResult } = require('express-validator');

const resultPerPage = 8;

exports.createCategory = async (req, res) => {
    try {
        const { name, image } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json(errors);
        }
        const category = new Category({
            name: name,
            image: image ? image : ' ',
        });
        const result = await category.save();
        if (result) {
            return res.send(JSON.stringify(result));
        }
        return res.status(400).send(JSON.stringify({
            message: "Cannot create area!",
            success: false
        }))
    } catch (error) {
        console.log(error)
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

exports.getCategoryById = async (req, res) => {
    try {
        let { id } = req.params;
        const category = await Category.findById(id)
        if (!category) {
            return res.status(404).json({
                message: "Not found category!",
                success: false,
            });
        }
        return res.send(JSON.stringify(category));
    } catch (error) {
        console.log(error)
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

exports.getCategories = async (req, res) => {
    try {
        let { page } = req.query;
        const categories = await Category.find()
        if (page) {
            page = parseInt(page)
            if (categories.length === 0) {
                return res.send(JSON.stringify({
                    page: 0,
                    results: [],
                    pageSize: 0,
                }))
            }
            const total_pages = Math.ceil(categories.length / resultPerPage);
            if (page > total_pages) {
                return res.send(JSON.stringify({
                    errors: `page must be less than or equal to ${total_pages}`,
                    success: false
                }));
            }

            const results = paging(categories, resultPerPage, page)
            return res.send(JSON.stringify({
                page: page ? page : 1,
                results: results,
                total_pages: total_pages
            }))
        }
        return res.json({
            results: categories,
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

exports.updateCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image } = req.body;
        const area = await Category.findById(id)
        if (!area) {
            return res.status(404).send(JSON.stringify({
                message: "Not found area!",
                success: false,
            }))
        }
        if (name) {
            area.name = name;
        }
        if (image) {
            area.image = image;
        }

        const categoryUpdate = await area.save();

        if (categoryUpdate) {
            return res.json(categoryUpdate);
        }
        return res.status(404).send(JSON.stringify({
            message: "Cannot update category!",
            success: false
        }))
    } catch (error) {
        if (error.message.includes("Cast to ObjectId failed")) {
            return res.status(404).send(JSON.stringify({
                message: "Not Found category",
                success: false
            }))
        }
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const products = await Product.findOne({
            category: id,
        })
        if (products) {
            return res.status(422).send(JSON.stringify({
                message: "This category have products!",
                success: false
            }))
        }

        const category = await Category.findById(id);
        if (category) {
            const categoryDelete = await Category.deleteOne({ _id: id });
            if (categoryDelete.deletedCount > 0) {
                return res.status(200).send(JSON.stringify({
                    success: true
                }))
            }
            return res.status(400).send(JSON.stringify({
                message: "Cannot delete area",
                success: false
            }))
        }
        return res.status(404).send(JSON.stringify({
            message: "Not Found area",
            success: false
        }))
    } catch (error) {
        if (error.message.includes("Cast to ObjectId failed")) {
            return res.status(404).send(JSON.stringify({
                message: "Not Found area",
                success: false
            }))
        }
        console.log(error.message);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}
