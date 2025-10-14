const Router = require('express');
const userController = require("../controllers/user-controller.js");
const router = new Router();
const {body} = require("express-validator");
const authMiddleware = require("../middlewares/auth-middleware");


router.post("/register",
    body("email").isEmail(),
    body("password").isLength({min:6, max:25}),
    userController.register);
router.post("/login",userController.login);
router.post("/logout",userController.logout);
router.post("/password/forgot",userController.requestPasswordResetLink);
router.post("/password/reset",userController.resetPassword);
router.get('/activate/:link',userController.activate);
router.get('/refresh',userController.refresh);
router.get('/users',authMiddleware,userController.getUsers);

module.exports = router;