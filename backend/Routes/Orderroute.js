const router = require("express").Router()
const { add, findById, remove, bookslot, availableslots, findByOrderId, getMostBookedStations, changepayment, findOrders } = require("../Controllers/OrderController")


router.post("/add", add)
router.post("/remove/:orderId", remove)
router.get("/find/:orderId", findById)

// router.post("/api/book-slot", bookslot);

// router.get("/api/available-slots",availableslots);

router.post('/api/available-slots', availableslots);
router.post('/api/book-slot', bookslot);
router.get('/api/book-slot/:id/:action', changepayment);
router.get('/api/find/:userId', findByOrderId);
router.get('/api/find', findOrders);
router.get('/most-booked-stations', getMostBookedStations);


module.exports = router