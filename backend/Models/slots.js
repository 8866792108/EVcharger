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
    All_slots: { 
        type: [String], 
        default: ["08:00-08:30", "08:30-09:00", "09:00-09:30","9:30-10:00","10:00-10:30"]
    }
})

const slotmodel = mongoose.model("ev slots", slotschema)

module.exports = slotmodel