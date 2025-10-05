const UserModel = require("../models/user-model.js")
const bcrypt = require("bcrypt")
const { v4: uuidv4 } = require('uuid');
const mailService = require("../service/mail-service.js");
const tokenService = require("../service/token-service.js");
const UserDto = require("../dtos/user-dto")
const ApiError = require("../Exceptions/api-error");

class UserService {
    async register(email,password) {
        const candidate = await UserModel.findOne({email});
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтой ${email} уже существует`);
        }
        const hashPassword = await bcrypt.hash(password, 4);
        const activationLink = uuidv4();
        const user = await  UserModel.create({email,password:hashPassword,activationLink});
        await mailService.sendActivationMail(email,`${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id,tokens.refreshToken);
        return {
            ...tokens,
            user: userDto
        }
    }
    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink});
        if(!user) {
            throw ApiError.BadRequest("Недопустимая ссылка активации");
        }
        user.isActivated = true;
        await user.save();
    }
}

module.exports = new UserService();