const router = require("express").Router();
const soldController = require("../controller/soldAtController");

router.get("/sold", soldController.getSold);

module.exports = router;
