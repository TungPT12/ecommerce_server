const Product = require("../../models/Product");
const User = require("../../models/User");

exports.getCart = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate({
            path: 'cart.items.product',
            populate: { path: 'category' }
        });
        if (user) {
            return res.send(JSON.stringify({
                cart: user.cart,
            }))
        }
        return res.status(400).send(JSON.stringify({
            message: "Cannot get cart!",
            success: false
        }))
    } catch (error) {
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

exports.addProductToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send(JSON.stringify({
                message: "Product Not Found!",
                success: false
            }))
        }
        const user = await User.findById(req.userId);
        if (user) {
            const cart = await user.addToCart(productId, quantity)
            if (cart) {
                return res.send(JSON.stringify({
                    cart: cart,
                }))
            }
        }
        return res.status(400).send(JSON.stringify({
            message: "Cannot get cart!",
            success: false
        }))
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

exports.deleteProductInCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.userId);
        if (user) {
            const cart = await user.deleteProductInCart(productId)
            if (cart) {
                return res.send(JSON.stringify({
                    cart: cart,
                }))
            }
        }
        return res.status(400).send(JSON.stringify({
            message: "Cannot delete product in cart!",
            success: false
        }))
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

exports.decreaseProductInCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.userId);
        if (user) {
            const cart = await user.decreaseProductInCart(productId)
            if (cart) {
                return res.send(JSON.stringify({
                    cart: cart,
                }))
            }
        }
        return res.status(400).send(JSON.stringify({
            message: "Cannot delete product in cart!",
            success: false
        }))
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

