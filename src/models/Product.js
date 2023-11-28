const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    image: [
        {
            type: String,
            required: true
        }
    ],
    short_desc: {
        type: String,
        required: true
    },
    long_desc: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Product', productSchema);