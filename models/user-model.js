const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  type: { type: String, required: true, default: "user" },
  registrationDate: { type: String, required: true },
  role: { type: String, required: true },
});

module.exports = model("User", UserSchema);
