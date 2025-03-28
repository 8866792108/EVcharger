const { feedback, getfeedback, deleteById } = require("../Controllers/FeedbackController")

const router = require("express").Router()

router.post("/add", feedback)
router.get("/getfeedback", getfeedback)
router.get("/deletebyid/:id", deleteById)

module.exports = router