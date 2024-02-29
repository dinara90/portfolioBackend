require("dotenv").config();
const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const router = new Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth-middleware");
const postController = require("../controllers/post-controller");
const upload = require("../middlewares/upload");
const Grid = require("gridfs-stream");
const connection = require("../db");
const mongoose = require("mongoose");

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 5, max: 32 }),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/refresh", userController.refresh);
router.get("/users", authMiddleware, userController.getUsers);
router.get("/posts", authMiddleware, postController.getPosts);
router.post("/deletePost", authMiddleware, postController.deletePost);
router.post("/posts", upload.array("images"), postController.create);

module.exports = router;
