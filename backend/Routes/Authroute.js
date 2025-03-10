const router = require("express").Router()
const { signup, login, googlelogin, feedback, ForgetPassword, VerifyOTP, updatePassword } = require("../Controllers/userController")
const { signupValidation, loginValidation } = require("../Middlewares/AuthValidate")

router.post("/login", loginValidation, login)


router.post("/signup", signupValidation, signup)

router.get('/google', googlelogin)

router.post("/feedback", feedback)

//forget password routes

router.post("/forgot-password", ForgetPassword)
router.post("/verify-otp", VerifyOTP)
router.post("/reset-password", updatePassword)


module.exports = router