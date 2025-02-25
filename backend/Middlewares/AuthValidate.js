const Joi = require("joi");
const { schema } = require("../Models/user");


const signupValidation = (req, res, next) => {

    console.log(req.body)
    
    const Schema = Joi.object({
        name: Joi.string().min(4).max(20).required().messages({'string.empty': 'Name is required'}),
        email: Joi.string().email().required(),
        password: Joi.string().min(7).max(50).required()
    })
    

    const { error } = Schema.validate(req.body)

    if (error) {
        return res.status(200)
            .json({ message: "ERROR FOUND", error })
    }

    next();
}


const loginValidation = (req, res, next) => {

    const Schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(7).max(50).required()
    })

    const { error } = Schema.validate(req.body)

    if (error) {
        return res.status(200)
            .json({ message: "ERROR FOUND", error })
    }

    next();
}

module.exports = {
    signupValidation,
    loginValidation
}