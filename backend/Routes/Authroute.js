const router = require("express").Router()
const { signup, login, googlelogin } = require("../Controllers/userController")
const {signupValidation, loginValidation}= require("../Middlewares/AuthValidate")

router.post("/login",loginValidation,login)


router.post("/signup", signupValidation,signup)

router.get('/google',googlelogin)


module.exports = router