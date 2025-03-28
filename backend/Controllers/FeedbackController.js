const feedbackmodel = require("../Models/feedback");

const getfeedback = async (req, res) => {
    try {
        const messages = await feedbackmodel.find({}).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Fetched Feedback successful",
            success: true,
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error: " + error.message,
            success: false,
        });
    }
}

const deleteById = async (req, res) => {
    const { id } = req.params
    console.log(id)
    try {
        const messages = await feedbackmodel.findByIdAndDelete(id)
        return res.status(201).json({
            message: "Deleted SuccessFully",
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error: " + error.message,
            success: false,
        });
    }
}

const feedback = async (req, res) => {
    try {
        const { name, email, message, rating, userId } = req.body;
        console.log("Your feedback body is: ", req.body);

        // Create a new user
        const newfeedback = new feedbackmodel({
            userId: userId,
            name: name,
            email: email,
            message: message,
            rating
        });
        console.log("New Feedback: ", newfeedback)

        // Save the user to the database
        await newfeedback.save()
        return res.status(201).json({
            message: "send successful",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error: " + error.message,
            success: false,
        });
    }
}


module.exports = {
    feedback,
    getfeedback,
    deleteById
}