const mongoose = require("mongoose")

const messageschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

const messagemodel = mongoose.model("Message", messageschema)

module.exports = messagemodel