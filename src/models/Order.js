const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    delivery: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
    items: [
        {
            product: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: "Product"
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            _id: false
        }
    ],
    create_at: {
        type: Date,
        required: true,
    }
})


module.exports = mongoose.model('Order', orderSchema);