const router = require("express").Router()
const { add, findById, remove, bookslot, availableslots, findByOrderId } = require("../Controllers/OrderController")


router.post("/add", add)
router.post("/remove/:orderId", remove)
router.get("/find/:orderId", findById)

// router.post("/api/book-slot", bookslot);

// router.get("/api/available-slots",availableslots);

router.post('/api/available-slots', availableslots);
router.post('/api/book-slot', bookslot);
router.get('/api/find/:userId', findByOrderId);


module.exports = router