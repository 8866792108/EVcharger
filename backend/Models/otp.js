// const mongoose = require("mongoose")

// const otpschema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: true
//     },
//     otp: {
//         type: String,
//         required: true
//     },
//     isVerified: {
//         type: Boolean,
//         default: false
//     }
// })

// const otpModel = mongoose.model("OTP", otpschema)

// module.exports = otpModel

const mongoose = require("mongoose");

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
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiry
    }
});

// Automatically delete expired OTPs
// otpschema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const otpModel = mongoose.model("OTP", otpschema);

module.exports = otpModel;
