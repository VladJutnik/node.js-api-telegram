const { Schema, model } = require('mongoose')

const schema = new Schema({
    chatID: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true
    },
    right: {
        type: String,
        default: 0
    },
    wrong: {
        type: String,
        default: 0
    },
})

module.exports = model('Chat_user', schema)
