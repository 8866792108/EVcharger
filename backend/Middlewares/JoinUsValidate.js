const Joi = require("joi");

const JoinWithUsValidation = (req, res, next) => {

    const Schema = Joi.object({
        ownerName: Joi.string().min(4).max(30).required(),
        businessName: Joi.string().min(4).max(50).required(),
        stationLocation: Joi.string().min(4).max(100).required(),
        contactNumber: Joi.number().required(),
        email: Joi.string().email().required(),
        stationType: Joi.string().min(4).max(20).required(),
        numberOfPorts: Joi.string().required(),
        additionalInfo: Joi.string().min(4).max(200).required()
    })


    const { error } = Schema.validate(req.body)

    if (error) {
        return res.status(200)
            .json({ message: "ERROR FOUND", error })
    }

    // const { contactNumber } = req.body

    // console.log(contactNumber.length)
    // if (contactNumber.legth >= 12 && contactNumber.length <= 10) {
    //     res.status(200).json({
    //         message: "Contact Number Length Must Be 10 to 12",
    //         success: false,
    //     });
    // }

    next();
}


module.exports = {
    JoinWithUsValidation
}