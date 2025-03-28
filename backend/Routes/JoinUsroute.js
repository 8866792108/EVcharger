const { ReqJoinUs, getJoinUs, DeleteById, StatusChange } = require("../Controllers/JoinUsController")
const { JoinWithUsValidation } = require("../Middlewares/JoinUsValidate")

const router = require("express").Router()

router.post("/ReqJoinUs", JoinWithUsValidation, ReqJoinUs)
router.get("/getJoinUs", getJoinUs)
router.get("/deletebyid/:id", DeleteById)
router.post('/reject/:id', StatusChange);
router.post('/accept/:id', StatusChange);
module.exports = router