const { getitems, setitems } = require("../Controllers/EvController")

const router = require("express").Router()

router.get("/getitems", getitems)
router.post("/setitems", setitems)

module.exports = router