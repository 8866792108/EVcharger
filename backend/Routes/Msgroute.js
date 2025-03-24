const { message, latestMsg } = require("../Controllers/MsgController")

const router = require("express").Router()


router.post("/addmsg",message)
router.get("/NewMessage",latestMsg)


module.exports = router