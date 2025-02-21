const { getitems, setitems, removeitems, findById } = require("../Controllers/EvController")

const router = require("express").Router()

router.get("/getitems", getitems)
router.post("/remove/:slotid", removeitems)
router.get("/find/:id", findById)
// router.post("/setitems",upload.single("image"), setitems)

module.exports = router