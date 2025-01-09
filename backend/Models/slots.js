const mongoose = require("mongoose")

const slotschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    long: {
        type: Number,
        required: true
    }
})

const slotmodel = mongoose.model("ev slots", slotschema)

module.exports = slotmodel