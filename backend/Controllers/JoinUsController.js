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

module.exports = {
    ReqJoinUs
}
