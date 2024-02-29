const uuid = require("uuid");
const tokenService = require("./token-service");
const ApiError = require("../exceptions/api-error");
const postsModel = require("../models/posts-model");

class PostService {
  async createPost(title, content, images) {
    // Convert title and content from JSON strings to objects
    console.log(title + content);
    const parsedTitle = JSON.parse(title);
    const parsedContent = JSON.parse(content);
    const candidate = await postsModel.findOne({ title: parsedTitle });
    if (candidate) {
      throw ApiError.BadRequest(
        `Post with title: ${parsedTitle.en} already exists`
      );
    }
    const ts = Date.now();
    const date_ob = new Date(ts);
    const date = date_ob.getDate();
    const month = date_ob.getMonth() + 1;
    const year = date_ob.getFullYear();
    const hour = date_ob.getHours();
    const minute = date_ob.getMinutes();
    const registrationDate =
      date + "-" + month + "-" + year + " " + hour + ":" + minute;
    console.log(parsedTitle.en);
    const post = await postsModel.create({
      title: parsedTitle,
      content: parsedContent,
      images: images,
      registrationDate: registrationDate,
    });

    return post;
  }

  async deletePost(title) {
    const post = await postsModel.deleteOne(title);
    return post;
  }

  async getPosts() {
    const posts = await postsModel.find();
    return posts;
  }
}

module.exports = new PostService();
