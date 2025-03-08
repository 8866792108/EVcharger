// const mongoose = require("mongoose")

// const OrdersSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
//     slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'ev slots', required: true },
//     start: { type: Date, required: true },
//     end: { type: Date, required: true }
// });

// // OrdersSchema.index({ start: 1, end: 1 }, { unique: true });

// OrdersSchema.index({ start: 1, end: 1 }, { unique: false });  // Remove the unique constraint


// const ordermodel = mongoose.model("orders", OrdersSchema)
// module.exports = ordermodel

const mongoose = require("mongoose")

const OrdersSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'ev slots', required: true },
    method: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: String, required: true },
    slotnumber: { type: String, required: true },
    price: { type: String, required: true },
    transaction: { type: String, required: true },
    status: { type: String, default:"Pending" }
});

// OrdersSchema.index({ start: 1, end: 1 }, { unique: true });

OrdersSchema.index({ start: 1, end: 1 }, { unique: false });  // Remove the unique constraint


const ordermodel = mongoose.model("orders", OrdersSchema)
module.exports = ordermodel