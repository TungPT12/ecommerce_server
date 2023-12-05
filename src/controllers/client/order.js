const Order = require("../../models/Order");

exports.createOrder = async (req, res) => {
    try {
        const { fullName, email, items, phone, address, totalPrice } = req.body;
        const userId = req.userId;
        const order = new Order({
            user: userId,
            fullName: fullName,
            email: email,
            phone: phone,
            items: items,
            address: address,
            totalPrice: totalPrice,
            delivery: 'Wating for progress',
            status: 'Wating for pay',
            items: items
        })
        const orderCreated = await order.save();
        if (orderCreated) {
            return res.send(JSON.stringify({
                results: categories
            }))
        }
        return res.status(400).send(JSON.stringify({
            message: "Cannot order!",
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