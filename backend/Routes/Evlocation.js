const { getitems, setitems, removeitems } = require("../Controllers/EvController")
const evupload = require("../Middlewares/evupload")

const router = require("express").Router()

router.get("/getitems", getitems)
router.post("/remove", removeitems)
// router.post("/setitems",evupload.single("image"), setitems)

module.exports = router