const router = require("express").Router()
const { add, findById, remove } = require("../Controllers/OrderController")


router.post("/add",add)
router.post("/remove/:orderId",remove)
router.get("/find/:orderId",findById)

module.exports = router