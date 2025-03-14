const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'ev_slots', required: true },
    branchId: { type: String, required: true },
    slots: [{
        start: { type: String, required: true },
        end: { type: String, required: true }
    }],
    method: { type: String, required: true },
    date: { type: String, required: true },
    price: { type: String, required: true },
    transaction: { type: String, required: true },
    status: { type: String, default: "Pending" }
});

const ordermodel = mongoose.model("orders", OrdersSchema);
module.exports = ordermodel;
