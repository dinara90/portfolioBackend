const { Schema, model } = require("mongoose");

const PostSchema = new Schema({
  title: {
    en: { type: String, required: true },
    kz: { type: String, required: true },
  },
  content: {
    en: { type: String, required: true },
    kz: { type: String, required: true },
  },
  images: { type: String, required: true },
  registrationDate: { type: String, required: true },
});

module.exports = model("PostSchema", PostSchema);
