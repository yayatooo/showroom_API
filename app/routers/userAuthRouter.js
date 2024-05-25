const userAuthController = require("../controller/userAuth");
const router = require("express").Router();

router.post("/register", userAuthController.registerUser);
router.post("/login", userAuthController.loginUser);
router.get("/users", userAuthController.getAllUser);

module.exports = router;
