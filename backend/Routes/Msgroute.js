const { message, latestMsg, AllMsg, DeleteByIdMsg } = require("../Controllers/MsgController")

const router = require("express").Router()


router.post("/addmsg",message)
router.get("/NewMessage",latestMsg)
router.get("/AllMessage",AllMsg)
router.delete("/Delete/:id",DeleteByIdMsg)


module.exports = router