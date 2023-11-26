const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomChatSchema = new Schema({
    message: [
        {
            type: String,
            required: true
        }
    ],
    client: {
        type: Schema.Types.ObjectId,
        require: true
    },
    counselor: {
        type: Schema.Types.ObjectId,
        require: true
    },
})