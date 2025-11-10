const Router = require('express');
const userController = require("../controllers/user-controller.js");
const authController = require("../controllers/auth-controller")
const tokenController = require("../controllers/token-controller")
const router = new Router();
const {body} = require("express-validator");
const authMiddleware = require("../middlewares/auth-middleware");
const errorMiddleware = require("../middlewares/error-middleware.js")
const roleMiddleware = require("../middlewares/role-middleware");
const gptController = require("../controllers/gpt-controller.js")

router.post("/register",
    body("email").isEmail(),
    body("password").isLength({min:6, max:25}),
    authController.register);
router.post("/login",authController.login);
router.post("/logout",authController.logout);
router.post("/password/forgot",userController.requestPasswordResetLink);
router.post("/password/reset", userController.resetPassword);
router.post("/generate-text", gptController.generateText);
router.get('/activate/:link',tokenController.activate);
router.get('/refresh',tokenController.refresh);
router.get('/users',authMiddleware,roleMiddleware(["ADMIN"]),userController.getUsers);


module.exports = router;