const messagemodel = require("../Models/message");

const message = async (req, res) => {
    console.log("req : ", req.body)
    try {
        const { name, email, message } = req.body;

        if (!name) {
            return res.status(200).json({
                success: false,
                error: "Name is required"
            });
        }
        if (!email) {
            return res.status(200).json({
                success: false,
                error: "Email is required"
            });
        }
        if (!message) {
            return res.status(200).json({
                success: false,
                error: "Message is required"
            });
        }

        const newmessage = new messagemodel({
            name,
            email,
            message
        })

        await newmessage.save()

        return res.status(200).json({
            message: "Your message has been successfully sent!",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error: " + error.message,
            success: false,
        });
    }
}

const latestMsg = async (req, res) => {
    try {
        // Fetch all unseen messages sorted by newest first
        const messages = await messagemodel.find({ seen: false }).sort({ createdAt: -1 });

        if (messages.length === 0) {
            return res.status(200).json({ message: "No new messages", data: [] });
        }

        // Mark messages as seen after fetching
        await messagemodel.updateMany({ seen: false }, { $set: { seen: true } });

        res.status(200).json({ message: "Latest unseen messages", data: messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const AllMsg = async (req, res) => {
    try {
        // Fetch all unseen messages sorted by newest first
        const messages = await messagemodel.find({}).sort({ createdAt: -1 });

        if (messages.length === 0) {
            return res.status(200).json({ message: "No new messages", data: [] });
        }
        await messagemodel.updateMany({ seen: false }, { $set: { seen: true } });

        res.status(200).json({ message: "All messages", data: messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const DeleteByIdMsg = async (req, res) => {
    try {
        const { id } = req.params
        // Fetch all unseen messages sorted by newest first
        const messages = await messagemodel.findByIdAndDelete(id)
        console.log(messages);

        res.status(200).json({ message: "Deleted SuccessFully", success: true });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



module.exports = {
    message,
    latestMsg,
    AllMsg,
    DeleteByIdMsg
}