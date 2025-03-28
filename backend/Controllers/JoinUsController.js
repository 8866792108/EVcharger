const { SendRequestJoinWithUs } = require("../Middlewares/EmailConfige");
const JoinWithUsModel = require("../Models/JoinWithUs");

const ReqJoinUs = async (req, res) => {
    console.log("Request Body :: ", req.body);

    try {

        const {
            ownerName,
            businessName,
            stationLocation,
            contactNumber,
            email,
            stationType,
            numberOfPorts,
            additionalInfo
        } = req.body


        const newjoinus = new JoinWithUsModel({
            ownerName,
            businessName,
            stationLocation,
            contactNumber,
            email,
            stationType,
            numberOfPorts,
            additionalInfo
        })

        await newjoinus.save()

        return res.status(200).json({
            message: `Thank you, ${req.body.ownerName}! Your request for ${req.body.businessName} has been received.`,
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error: " + error.message,
            success: false,
        });
    }

}


const getJoinUs = async (req, res) => {
    try {
        const JoinWithUs = await JoinWithUsModel.find({}).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: JoinWithUs
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error: " + error.message,
            success: false,
        });
    }
}


const DeleteById = async (req, res) => {
    const { id } = req.params
    console.log(id)
    try {
        const messages = await JoinWithUsModel.findByIdAndDelete(id)
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

const StatusChange = async (req, res) => {

    const { id } = req.params
    const { status } = req.body

    try {

        const ChangeStatus = await JoinWithUsModel.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        )

        console.log(ChangeStatus);

        if (status !== "Pending") {
            SendRequestJoinWithUs(ChangeStatus, ChangeStatus.email, status)
        }

        res.status(201).json({ message: "Sended Actions successfully!", success: true });
    } catch (error) {
        console.error("Error saving booking:", error);
        res.status(500).json({ message: "Error booking slot.", success: false });
    }
};

module.exports = {
    ReqJoinUs,
    getJoinUs,
    DeleteById,
    StatusChange
}
