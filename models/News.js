const { Schema, model } = require('mongoose')

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date1: {
        type: Date,
    }
})

module.exports = model('News', schema)
