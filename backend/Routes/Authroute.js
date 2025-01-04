const router = require("express").Router()
const { signup, login } = require("../Controllers/userController")
const {signupValidation, loginValidation}= require("../Middlewares/AuthValidate")

router.post("/login",loginValidation,login)


// router.post("/signup", signupValidation,signup)


module.exports = router