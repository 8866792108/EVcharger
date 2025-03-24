const router = require("express").Router()
const Joi = require("joi")
const { signup, login, googlelogin, feedback, ForgetPassword, VerifyOTP, updatePassword } = require("../Controllers/userController")
const { signupValidation, loginValidation } = require("../Middlewares/AuthValidate")

router.post("/login", loginValidation, login)


router.post("/signup", signupValidation, signup)

router.get('/google', googlelogin)

router.post("/feedback", feedback)

//forget password routes

router.post("/forgot-password", ForgetPassword)
router.post("/verify-otp", VerifyOTP)
router.post("/reset-password", (req, res, next) => {
    const Schema = Joi.object({
        password: Joi.string().min(7).max(50).required()
    })

    const { error } = Schema.validate({
        password: req.body.password
    })

    if (error) {
        return res.status(200)
            .json({ message: "ERROR FOUND", error })
    }

    next();
}, updatePassword)


module.exports = router