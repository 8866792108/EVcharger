const mongoose = require("mongoose")

const OrdersSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'ev slots', required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true }
});

// OrdersSchema.index({ start: 1, end: 1 }, { unique: true });

OrdersSchema.index({ start: 1, end: 1 }, { unique: false });  // Remove the unique constraint


const ordermodel = mongoose.model("orders", OrdersSchema)
module.exports = ordermodel