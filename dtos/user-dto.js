const { model } = require("mongoose");

module.exports = class UserDto {
  email;
  username;
  id;
  role;

  constructor(model) {
    this.email = model.email;
    this.username = model.username;
    this.id = model._id;
    this.role = model.role;
  }
};
