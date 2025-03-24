const { ReqJoinUs } = require("../Controllers/JoinUsController")
const { JoinWithUsValidation } = require("../Middlewares/JoinUsValidate")

const router = require("express").Router()

router.post("/ReqJoinUs", JoinWithUsValidation, ReqJoinUs)
module.exports = router