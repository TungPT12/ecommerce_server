const Product = require('../../models/Product');
const { validationResult } = require('express-validator');

exports.createProduct = async (req, res) => {
    try {
        let { name, price, images, short_desc, long_desc, category, quantity } = req.body;
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
// exports.getHotels = async (req, res) => {
//     try {
//         let { isDisable, page } = req.query;
//         if (page) {
//             page = parseInt(page)
//         }
//         let hotels = [];
//         if (isDisable) {
//             if (isDisable === 'true') {
//                 isDisable = true;
//             } else {
//                 isDisable = false;
//             }
//             hotels = await Hotel.find({ isDisable: isDisable }).select('_id type area name title isDisable').populate({ path: 'type', select: '-_id name' }).populate({ path: 'area', select: '-_id name' })
//         } else {
//             hotels = await Hotel.find().select('_id area name title type isDisable').populate({ path: 'type', select: '-_id name' }).populate({ path: 'area', select: '-_id name' })
//         }
//         // if (isDisable) {
//         //     if (isDisable === 'true') {
//         //         isDisable = true;
//         //     } else {
//         //         isDisable = false;
//         //     }
//         //     hotels = await Hotel.find({ isDisable: isDisable }).select('_id type area name title isDisable').populate({ path: 'type', select: '-_id name' }).populate({ path: 'area', select: '-_id name' })
//         // } else {
//         //     hotels = await Hotel.find().select('_id area name title type isDisable').populate({ path: 'type', select: '-_id name' }).populate({ path: 'area', select: '-_id name' })
//         // }
//         if (hotels.length === 0) {
//             return res.send(JSON.stringify({
//                 page: 0,
//                 results: [],
//                 pageSize: 0,
//             }))
//         }
//         const total_pages = Math.ceil(hotels.length / resultPerPage);
//         if (page > total_pages) {
//             return res.send(JSON.stringify({
//                 errors: `page must be less than or equal to ${total_pages}`,
//                 success: false
//             }));
//         }
//         const results = paging(hotels, resultPerPage, page)
//         return res.send(JSON.stringify({
//             page: page ? page : 1,
//             results: results,
//             total_pages: total_pages
//         }))
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send(JSON.stringify({
//             message: "Server Error",
//             success: false
//         }))
//     }
// }

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

// exports.updateHotelById = async (req, res) => {
//     try {
//         const { id, name, type, area, address, distance, photos, desc, title, featured } = req.body;

//         if (!id) {
//             return res.status(400).send(JSON.stringify({
//                 message: "Not found id params!",
//                 success: false
//             }));
//         }
//         const hotel = await Hotel.findById(id);

//         if (!hotel) {
//             return res.status(404).send(JSON.stringify({
//                 message: "Not found hotel",
//                 success: false
//             }));
//         }

//         hotel.name = name;
//         hotel.type = type;
//         hotel.area = area;
//         hotel.address = address;
//         hotel.distance = distance;
//         hotel.photos = photos;
//         hotel.desc = desc;
//         hotel.title = title;
//         hotel.featured = featured;

//         const hotelUpdated = await hotel.save();
//         console.log(hotelUpdated)
//         if (hotelUpdated) {
//             return res.json(hotelUpdated);
//         }

//         return res.status(400).send(JSON.stringify({
//             message: "Cannot update hotel!",
//             success: false
//         }));

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

// exports.deleteHotelById = async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!id) {
//             return res.status(400).send(JSON.stringify({
//                 message: "Not found id params!",
//                 success: false
//             }));
//         }

//         const transactions = await Transaction.find({
//             hotelId: id
//         })

//         if (transactions.length > 0) {
//             return res.status(400).send(JSON.stringify({
//                 message: "This hotel have transactions cannot delete!",
//                 success: false
//             }));
//         }

//         const deletedRooms = await Room.deleteMany({
//             hotelID: id
//         })

//         if (!deletedRooms) {
//             return res.status(400).send(JSON.stringify({
//                 message: "Something went wrong!",
//                 success: false
//             }));
//         }

//         const deletedHotel = await Hotel.deleteOne({
//             _id: id
//         });

//         if (deletedHotel.deletedCount <= 0) {
//             return res.status(400).send(JSON.stringify({
//                 message: "Something went wrong when delete hotels!",
//                 success: false
//             }));
//         }

//         return res.sendStatus(200)

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