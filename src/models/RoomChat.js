const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomChatSchema = new Schema({
    message: [
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
    // client: {
    //     type: Schema.Types.ObjectId,
    //     require: true
    // },
})

module.exports = mongoose.model('RoomChat', roomChatSchema)