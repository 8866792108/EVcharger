const { getitems, setitems } = require("../Controllers/EvController")
const evupload = require("../Middlewares/evupload")

const router = require("express").Router()

router.get("/getitems", getitems)
// router.post("/setitems",evupload.single("image"), setitems)

module.exports = router