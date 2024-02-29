const userService = require("../service/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");
const postService = require("../service/post-service");

class postController {
  async create(req, res, next) {
    try {
      const title = req.body.title;
      const content = req.body.content;
      let path = "";
      req.files.forEach(function (files, index, arr) {
        path = path + files.path + ",";
      });
      path = path.substring(0, path.lastIndexOf(","));
      const userData = await postService.createPost(title, content, path);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async deletePost(req, res, next) {
    try {
      const { title } = req.body.title;
      const posts = await postService.deletePost(title);
      return res.json(posts);
    } catch (e) {
      next(e);
    }
  }

  async getPosts(req, res, next) {
    try {
      const posts = await postService.getPosts();
      return res.json(posts);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new postController();
