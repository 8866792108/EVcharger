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
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    start: {
        type: String,
        required: true
    },
    end: {
        type: String,
        required: true
    }
})

const slotmodel = mongoose.model("ev slots", slotschema)

module.exports = slotmodel