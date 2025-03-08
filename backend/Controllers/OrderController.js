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


// const bookslot = async (req, res) => {
//     try {
//         const { startTime, endTime } = req.body;

//         // Mark the time slot as booked
//         const res = await ordermodel.updateMany(
//             { time: { $gte: startTime, $lt: endTime } },
//             { $set: { isBooked: true } }
//         );

//         console.log(res)
//         res.json({ message: "Slot booked successfully" });
//     } catch (err) {
//         console.error("Error booking slot:", err);
//         res.status(500).send("Error booking slot");
//     }
// };


// const availableslots = async (req, res) => {
//     try {
//         const availableSlots = await ordermodel.find({ isBooked: false });
//         res.json(availableSlots);
//     } catch (err) {
//         console.error("Error fetching available slots:", err);
//         res.status(500).send("Error fetching available slots");
//     }
// };


function roundToNearest30(time) {
    let minutes = time.minutes();
    let roundedMinutes = minutes < 30 ? 0 : 30;
    return time.minutes(roundedMinutes).seconds(0);
}

// Function to generate time slots
// function generateTimeSlots(startTime, endTime, interval) {
//     let timeSlots = [];
//     let currentTime = roundToNearest30(moment(startTime, 'hh:mm A'));

//     // Generate time slots at the given interval
//     while (currentTime.isBefore(moment(endTime, 'hh:mm A'))) {
//         let slotEndTime = moment(currentTime).add(interval, 'minutes');
//         timeSlots.push({
//             start: currentTime.format('hh:mm A'),
//             end: slotEndTime.format('hh:mm A')
//         });
//         currentTime.add(interval, 'minutes');
//     }

//     return timeSlots;
// }

// function generateTimeSlots(startTime, endTime, interval) {
//     let timeSlots = [];
//     let currentTime = moment(startTime, 'hh:mm A');

//     while (currentTime.isBefore(moment(endTime, 'hh:mm A'))) {
//         let slotEndTime = moment(currentTime).add(interval, 'minutes');

//         timeSlots.push({
//             start: currentTime.format('hh:mm A'),
//             end: slotEndTime.format('hh:mm A'),
//             available: true // Default to available
//         });

//         currentTime.add(interval, 'minutes');
//     }

//     return timeSlots;
// }

// const availableslots = async (req, res) => {
//     console.log(req.body);
//     const { startTime, endTime, interval } = req.body; // Get dynamic parameters from the request body

//     // Validate input
//     if (!startTime || !endTime || !interval) {
//         return res.status(400).json({ message: 'startTime, endTime, and interval are required.' });
//     }

//     // Get all bookings
//     const bookings = await ordermodel.find();

//     // Get the time slots based on dynamic start time, end time, and interval
//     const allSlots = generateTimeSlots(startTime, endTime, interval);

//     // Convert booking start and end times into moment objects for comparison
//     const bookedSlots = bookings.map(booking => ({
//         start: moment(booking.start),
//         end: moment(booking.end)
//     }));

//     // Filter out the booked slots by checking if any time slot overlaps
//     const availableSlots = allSlots.filter(slot => {
//         return !bookedSlots.some(booked => {
//             const slotStartTime = moment(slot.start, 'hh:mm A');
//             const slotEndTime = moment(slot.end, 'hh:mm A');

//             // Check if the slot overlaps with any booking
//             return slotStartTime.isBefore(booked.end) && slotEndTime.isAfter(booked.start);
//         });
//     });
//     console.log(availableSlots);

//     res.json({ availableSlots });
// }


// function roundUpTime(time, interval) {
//     const roundedMinutes = Math.ceil(time.minutes() / interval) * interval;
//     return time.clone().minutes(roundedMinutes).seconds(0);
// }

// function generateTimeSlots(startTime, endTime, interval) {
//     let timeSlots = [];
//     let currentTime = moment(startTime, "hh:mm A");

//     // Round up to the nearest interval
//     currentTime = roundUpTime(currentTime, interval);

//     while (currentTime.isBefore(moment(endTime, "hh:mm A"))) {
//         let slotEndTime = moment(currentTime).add(interval, "minutes");

//         timeSlots.push({
//             start: currentTime.format("hh:mm A"),
//             end: slotEndTime.format("hh:mm A"),
//             available: true // Default to available
//         });

//         currentTime.add(interval, "minutes");
//     }

//     return timeSlots;
// }

// const availableslots = async (req, res) => {
//     console.log(req.body)
//     const { startTime, endTime, interval, userId, slotId } = req.body;

//     if (!startTime || !endTime || !interval) {
//         return res.status(400).json({ message: 'startTime, endTime, and interval are required.' });
//     }

//     // Fetch all booked slots from the database
//     const bookings = await ordermodel.find({
//         userId: userId,
//         slotId: slotId
//     });

//     // Generate all time slots based on interval
//     let allSlots = generateTimeSlots(startTime, endTime, interval);

//     // Mark booked slots as unavailable
//     allSlots = allSlots.map(slot => {
//         const slotStart = moment(slot.start, 'hh:mm A');
//         const slotEnd = moment(slot.end, 'hh:mm A');

//         const isBooked = bookings.some(booking => {
//             const bookedStart = moment(booking.start);
//             const bookedEnd = moment(booking.end);
//             return slotStart.isBefore(bookedEnd) && slotEnd.isAfter(bookedStart);
//         });

//         return {
//             ...slot,
//             available: !isBooked // If booked, mark as false
//         };
//     });

//     res.json({ slots: allSlots });
// }

function roundUpTime(time, interval) {
    const roundedMinutes = Math.ceil(time.minutes() / interval) * interval;
    return time.clone().minutes(roundedMinutes).seconds(0);
}

function generateTimeSlots(startTime, endTime, interval, bookings) {
    let timeSlots = [];
    let currentTime = moment(startTime, "hh:mm A");

    // Round up to the nearest interval
    currentTime = roundUpTime(currentTime, interval);

    while (currentTime.isBefore(moment(endTime, "hh:mm A"))) {
        let slotEndTime = moment(currentTime).add(interval, "minutes");

        // Check if this slot is booked
        const isBooked = bookings.some(booking => {
            const bookedStart = moment(booking.start, "hh:mm A");
            const bookedEnd = moment(booking.end, "hh:mm A");

            // If any part of this interval overlaps with a booking, mark unavailable
            return (
                (currentTime.isSameOrAfter(bookedStart) && currentTime.isBefore(bookedEnd)) ||
                (slotEndTime.isAfter(bookedStart) && slotEndTime.isSameOrBefore(bookedEnd)) ||
                (currentTime.isBefore(bookedStart) && slotEndTime.isAfter(bookedEnd))
            );
        });

        timeSlots.push({
            start: currentTime.format("hh:mm A"),
            end: slotEndTime.format("hh:mm A"),
            available: !isBooked // Mark as unavailable if booked
        });

        currentTime.add(interval, "minutes");
    }

    return timeSlots;
}

const availableslots = async (req, res) => {
    try {
        console.log(req.body);
        const { startTime, endTime, interval, slotId } = req.body;

        if (!startTime || !endTime || !interval) {
            return res.status(400).json({ message: 'startTime, endTime, and interval are required.' });
        }

        // Fetch all booked slots from the database
        const bookings = await ordermodel.find({
            slotId: slotId
        });

        // Generate time slots with bookings applied
        let allSlots = generateTimeSlots(startTime, endTime, interval, bookings);

        res.json({ slots: allSlots });
    } catch (error) {
        console.error("Error fetching available slots:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// const bookslot = async (req, res) => {
//     const { start, end, userId, slotId } = req.body;

//     // Validate input to ensure start and end times are present
//     if (!start || !end) {
//         return res.status(400).json({ message: 'Start and end times are required.' });
//     }

//     // Convert to Date objects using moment.js
//     const startTime = moment(start, 'hh:mm A').isValid() ? moment(start, 'hh:mm A').toDate() : null;
//     const endTime = moment(end, 'hh:mm A').isValid() ? moment(end, 'hh:mm A').toDate() : null;

//     if (!startTime || !endTime) {
//         return res.status(400).json({ message: 'Invalid start or end time format.' });
//     }

//     // Check if the slot is already booked
//     const existingBooking = await ordermodel.findOne({
//         start: { $lte: endTime },
//         end: { $gte: startTime },
//         slotId: slotId
//     });

//     if (existingBooking) {
//         return res.status(400).json({ message: 'Slot is already booked.' });
//     }

//     // Create a new booking
//     const newBooking = new ordermodel({
//         userId: userId,
//         slotId: slotId,
//         start: startTime,
//         end: endTime
//     });

//     try {
//         const response = await newBooking.save();
//         res.status(201).json({ message: 'Slot booked successfully!', booking: response });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error booking slot.' });
//     }
// };
const bookslot = async (req, res) => {
    console.log("the payment data is the :: ", req.body)

    const { userId, slotId, date, time, duration, slotnumber, method, transaction } = req.body

    const price = (duration / 30) * 10
    // Check if the slot is already booked
    const existingBooking = await ordermodel.findOne({
        slotId: slotId,
        date: date,
        time: time,
        duration: duration,
        slotnumber: slotnumber
    });

    if (existingBooking) {
        return res.status(200).json({ message: 'Slot is already booked.' });
    }

    // Create a new booking
    const newBooking = new ordermodel({
        userId: userId,
        slotId: slotId,
        method: method,
        date: date,
        time: time,
        duration: duration,
        slotnumber: slotnumber,
        transaction: transaction,
        price: price
    });

    try {
        const response = await newBooking.save();
        res.status(201).json({ message: 'Slot booked successfully!', booking: response });
    } catch (error) {
        console.error(error);
        res.status(200).json({ message: 'Error booking slot.' });
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