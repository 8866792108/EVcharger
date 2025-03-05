const router = require("express").Router()
const { signup, login, googlelogin, feedback } = require("../Controllers/userController")
const {signupValidation, loginValidation}= require("../Middlewares/AuthValidate")

router.post("/login",loginValidation,login)


router.post("/signup", signupValidation,signup)

router.get('/google',googlelogin)

router.post("/feedback",feedback)


module.exports = router