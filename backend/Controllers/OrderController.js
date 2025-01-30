const ordermodel = require("../Models/order");

const add = async (req, res) => {
    try {
        const { userId, slotId, Booking_slots } = req.body;

        if (!userId || !slotId || !Booking_slots.length) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newOrder = new ordermodel({ userId, slotId, Booking_slots });
        await newOrder.save();

        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const remove = async (req, res) => {
    try {
        const { orderId } = req.params;

        const deletedOrder = await ordermodel.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order deleted successfully", order: deletedOrder });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


const findById = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await ordermodel.findById(orderId)
            .populate("userId", "email image name") // Populating user details
            .populate("slotId", "name address image All_slots"); // Populating slot details

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}



module.exports = {
    add,
    remove,
    findById
}