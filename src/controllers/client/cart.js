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
        const user = await User.findById(req.userId);

        if (user) {
            let items = user.cart.items;
            const position = items.findIndex((item) => {
                return item.product === productId;
            })
            if (position > -1) {
                // code here
            } else {
                items.push({
                    product: productId,
                    quantity: quantity
                })
                user.cart.items = items;
                user.cart.totalQuantity = user.cart.totalQuantity + quantity;
            }
            const userUpdated = await user.save();
            if (userUpdated) {
                return res.send(JSON.stringify({
                    cart: userUpdated.cart,
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
