const { getitems, setitems, removeitems } = require("../Controllers/EvController")

const router = require("express").Router()

router.get("/getitems", getitems)
router.post("/remove", removeitems)
// router.post("/setitems",upload.single("image"), setitems)

module.exports = router