const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    fullName: {
        type: String,
        require: true,
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    require: true
                },
            }
        ]
    },
    isAdmin: {
        type: Boolean,
        require: true,
    },
    isCounselor: {
        type: Boolean,
        require: true,
    }
})


module.exports = mongoose.model('User', userSchema)