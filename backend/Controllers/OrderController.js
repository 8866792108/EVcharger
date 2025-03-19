const { PaymentVerification } = require("../Middlewares/EmailConfige");
const { SendSMS } = require("../Middlewares/SMSConfigue");
const ordermodel = require("../Models/order");
const moment = require("moment")

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

const findByOrderId = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find all orders that belong to the user
        const orders = await ordermodel.find({ userId: userId });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user" });
        }

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


function roundToNearest30(time) {
    let minutes = time.minutes();
    let roundedMinutes = minutes < 30 ? 0 : 30;
    return time.minutes(roundedMinutes).seconds(0);
}

function roundUpTime(time, interval) {
    const roundedMinutes = Math.ceil(time.minutes() / interval) * interval;
    return time.clone().minutes(roundedMinutes).seconds(0);
}

function generateTimeSlots(startTime, endTime, interval, bookings) {
    let timeSlots = [];
    let currentTime = moment(startTime, "hh:mm A");

    currentTime = roundUpTime(currentTime, interval);

    while (currentTime.isBefore(moment(endTime, "hh:mm A"))) {
        let slotEndTime = moment(currentTime).add(interval, "minutes");

        const isBooked = bookings.some(booking => {
            return booking.slots.some(bookedSlot => {
                const bookedStart = moment(bookedSlot.start, "hh:mm A");
                const bookedEnd = moment(bookedSlot.end, "hh:mm A");
                return (
                    (currentTime.isSameOrAfter(bookedStart) && currentTime.isBefore(bookedEnd)) ||
                    (slotEndTime.isAfter(bookedStart) && slotEndTime.isSameOrBefore(bookedEnd)) ||
                    (currentTime.isBefore(bookedStart) && slotEndTime.isAfter(bookedEnd))
                );
            });
        });

        timeSlots.push({
            start: currentTime.format("hh:mm A"),
            end: slotEndTime.format("hh:mm A"),
            available: !isBooked
        });

        currentTime.add(interval, "minutes");
    }
    return timeSlots;
}

const availableslots = async (req, res) => {
    try {
        const { branchId, date, slotId } = req.body;

        if (!branchId || !date || !slotId) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // const bookings = await ordermodel.find({ branchId, date, slotId })
        const bookings = await ordermodel.find({ 
            branchId, 
            date, 
            slotId, 
            status: { $in: ["Pending", "Accepted"] } 
        });

        console.log(bookings)

        let allSlots = generateTimeSlots("8:00 AM", "8:00 PM", 30, bookings);

        res.json({ slots: allSlots });
    } catch (error) {
        console.error("Error fetching available slots:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const bookslot = async (req, res) => {
    console.log("Raw request body:", req.body);

    let { userId, slotId, branchId, method, date, transaction, price, slots } = req.body;

    const existtransaction = await ordermodel.findOne({ transaction });

    if (existtransaction) {
        return res.status(200).json({ message: "inValid Transaction id. Already use the Transaction id", success: false });
    }

    try {
        if (typeof slots === "string") {
            slots = JSON.parse(slots);
        }
    } catch (error) {
        console.error("Error parsing slots JSON:", error);
        return res.status(400).json({ message: "Invalid slots format.", success: false });
    }

    console.log("Slots type:", typeof slots);
    console.log("Slots value:", slots);

    // Convert ":" to "-" in start and end times
    const updatedSlots = slots.map(slot => ({
        ...slot,
        start: slot.start.replace("-", ":"),
        end: slot.end.replace("-", ":")
    }));

    console.log("Updated slots:", updatedSlots);

    const formattedSlots = updatedSlots.map(slot => ({
        start: slot.start,
        end: slot.end
    }));

    console.log("Formatted slots for booking:", formattedSlots);

    const existingBooking = await ordermodel.findOne({
        slotId,
        date,
        branchId,
        $and: formattedSlots.map(slot => ({
            "slots.start": { $lt: slot.end },
            "slots.end": { $gt: slot.start }
        }))
    });

    console.log(existingBooking)
    if (existingBooking) {
        return res.status(200).json({ message: "slots are already booked.", success: false });
    }

    const newBooking = new ordermodel({
        userId,
        slotId,
        branchId,
        slots: formattedSlots,
        method,
        date,
        transaction,
        price
    });

    try {
        const response = await newBooking.save();

        const populatedBooking = await ordermodel.findById(response._id).populate("userId", "email");

        PaymentVerification(populatedBooking.userId.email, populatedBooking._id, populatedBooking.branchId, populatedBooking.date, populatedBooking.price, populatedBooking.method, populatedBooking.transaction, populatedBooking.slots)

        SendSMS(populatedBooking.userId.email, populatedBooking.transaction, populatedBooking.method, populatedBooking.slots)

        res.status(201).json({ message: "Slot booked successfully!", success: true, booking: response });
    } catch (error) {
        console.error("Error saving booking:", error);
        res.status(500).json({ message: "Error booking slot.", success: false });
    }
};


module.exports = {
    add,
    remove,
    findById,
    bookslot,
    availableslots,
    findByOrderId
}