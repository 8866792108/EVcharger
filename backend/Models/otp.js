const mongoose = require("mongoose")

const otpschema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
})

const otpModel = mongoose.model("OTP", otpschema)

module.exports = otpModel