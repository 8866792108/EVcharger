const mongoose = require("mongoose")

const OrdersSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'ev slots', required: true },
    Booking_slots: { type: [String], required: true }
});

const ordermodel = mongoose.model("orders",OrdersSchema)
module.exports = ordermodel