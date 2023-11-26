const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    cart: {
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    required: true
                },
            }
        ]
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
    isCounselor: {
        type: Boolean,
        required: true,
    }
})


module.exports = mongoose.model('User', userSchema)