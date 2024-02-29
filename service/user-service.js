const UserModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const MailService = require("./mail-service");
const mailService = require("./mail-service");
const TokenService = require("./token-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");

class UserService {
  async registration(email, username, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`User with email: ${email} already exists`);
    }
    const usernameCandidate = await UserModel.findOne({ username });
    if (usernameCandidate) {
      throw ApiError.BadRequest(
        `User with username: ${username} already exists`
      );
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const ts = Date.now();
    const date_ob = new Date(ts);
    const date = date_ob.getDate();
    const month = date_ob.getMonth() + 1;
    const year = date_ob.getFullYear();
    const hour = date_ob.getHours();
    const minute = date_ob.getMinutes();
    const registrationDate =
      date + "-" + month + "-" + year + " " + hour + ":" + minute;
    const user = await UserModel.create({
      email,
      username,
      password: hashPassword,
      registrationDate,
      role: "user",
    });
    await mailService.sendActivationMail(email);

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest("Unauthorized email");
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Password is not correct");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }
}

module.exports = new UserService();
