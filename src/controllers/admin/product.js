const Order = require('../../models/Order');
const Product = require('../../models/Product');
const { validationResult } = require('express-validator');

exports.createProduct = async (req, res) => {
    try {
        const { name, price, images, short_desc, long_desc, category, quantity } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json(errors);
        }
        const product = new Product({
            name: name,
            price: price,
            images: images,
            short_desc: short_desc,
            long_desc: long_desc,
            category: category,
            quantity: quantity,
        });
        const result = await product.save();
        if (result) {
            return res.status(200).send(JSON.stringify({
                message: "success",
                success: true
            }));
        }
        return res.status(400).send(JSON.stringify({
            success: false
        }));

    } catch (error) {
        console.log(error.message);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate({ path: 'category', select: '-_id name' })
        if (products.length === 0) {
            return res.send(JSON.stringify({
                results: [],
            }))
        }
        return res.json({
            results: products,
        })
    } catch (error) {
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

// exports.getEnableHotels = async (req, res) => {
//     try {
//         const hotel = await Hotel.find({ isDisable: false }).select('_id area name title type isDisable')
//             .populate({ path: 'area', select: '-_id name' })
//         return res.send(JSON.stringify(hotel));
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send(JSON.stringify({
//             message: "Server Error",
//             success: false
//         }))
//     }
// }

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

// exports.disableHotel = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const isHaveRoom = await Room.findOne({
//             hotelID: id,
//             isDisable: false
//         })

//         if (isHaveRoom) {
//             return res.status(400).send(JSON.stringify({
//                 message: "This hotel have rooms",
//                 success: false
//             }))
//         }
//         const hotel = await Hotel.findById(id);
//         if (hotel) {
//             hotel.isDisable = true;
//             const disableHotel = hotel.save();
//             if (disableHotel) {
//                 return res.sendStatus(200);
//             }
//             return res.status(400).send(JSON.stringify({
//                 message: "Cannot delete hotel",
//                 success: false
//             }))
//         }
//         return res.status(404).send(JSON.stringify({
//             message: "Not Found hotel",
//             success: false
//         }))
//     } catch (error) {
//         if (error.message.includes("Cast to ObjectId failed")) {
//             return res.status(404).send(JSON.stringify({
//                 message: "Not Found Area",
//                 success: false
//             }))
//         }
//         console.log(error.message);
//         return res.status(500).send(JSON.stringify({
//             message: "Server Error",
//             success: false
//         }))
//     }
// }

exports.updateProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, images, short_desc, long_desc, quantity } = req.body;
        if (!id) {
            return res.status(400).send(JSON.stringify({
                message: "Not found id params!",
                success: false
            }));
        }
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).send(JSON.stringify({
                message: "Not found product",
                success: false
            }));
        }

        product.name = name;
        product.price = price;
        product.images = images;
        product.short_desc = short_desc;
        product.long_desc = long_desc;
        product.quantity = quantity;

        const productUpdated = await product.save();
        if (productUpdated) {
            return res.json(productUpdated);
        }

        return res.status(400).send(JSON.stringify({
            message: "Cannot update product!",
            success: false
        }));

    } catch (error) {
        if (error.message.includes("Cast to ObjectId failed")) {
            return res.status(404).send(JSON.stringify({
                message: "Not Found Area",
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

exports.deleteProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).send(JSON.stringify({
                message: "Not found id params!",
                success: false
            }));
        }
        const orders = await Order.find({
            product: id
        })

        if (orders.length > 0) {
            return res.status(422).send(JSON.stringify({
                message: "This product have orders cannot delete!",
                success: false
            }));
        }

        const product = await Product.findById({
            _id: id
        })

        if (!product) {
            return res.status(400).send(JSON.stringify({
                message: "Product Not Found!",
                success: false
            }));
        }

        const productDeleted = await Product.deleteOne({ _id: id });

        if (productDeleted.deletedCount <= 0) {
            return res.status(400).send(JSON.stringify({
                message: "Something went wrong when delete product!",
                success: false
            }));
        }

        return res.sendStatus(200)

    } catch (error) {
        if (error.message.includes("Cast to ObjectId failed")) {
            return res.status(404).send(JSON.stringify({
                message: "Not Found Area",
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