const router = require("express").Router();
const soldController = require("../controller/soldAtController");

router.get("/sold", soldController.getSold);
router.post("/sold/:bikeId", soldController.selledBike);

module.exports = router;
