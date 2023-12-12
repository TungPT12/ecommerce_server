const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomChatSchema = new Schema({
    messages: [
        {
            message: {
                type: String,
                required: true
            },
            isClient: {
                type: Boolean,
                required: true
            },
            time: {
                type: Date,
                required: true
            }
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
})

module.exports = mongoose.model('RoomChat', roomChatSchema)