const UserModel = require("../models/user-model.js")
const RoleModel = require("../models/role-model.js")
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

    async login(email,password) {
        const user = await UserModel.findOne({email});
        if(!user) {
            throw ApiError.BadRequest("Пользователь с таким email не найден!");
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if(!isPassEquals) {
            throw ApiError.BadRequest("Некорректный пароль");
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id,tokens.refreshToken);
        return {...tokens,user: userDto}
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = await tokenService.validateRefreshToken(refreshToken);
        const tokenFromDatabase = await tokenService.findToken(refreshToken);
        if(!tokenFromDatabase || !userData) {
           // throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id,tokens.refreshToken);
        return {...tokens,user: userDto}
    }

    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }

    async requestPasswordResetLink(email) {
        const user  = await UserModel.findOne({email});
        if(!user) {
            throw ApiError.BadRequest("Пользователь с таким email не найден!");
        }
        const now = Date.now();
        if(user.resetRequestedAt && now - user.resetRequestedAt.getTime() < 15*60*1000) {
            throw ApiError.BadRequest("Ссылка уже была отправлена недавно. Проверьте почту.");
        }
        const {passwordToken} = tokenService.generatePasswordToken( user._id.toString());
        const resetLink = `${process.env.CLIENT_URL}/password/reset?token=${passwordToken}`;
        await mailService.sendPasswordResetLink(email,resetLink);
        user.resetRequestedAt = new Date();
        await user.save();
        return {passwordToken, message:`Ссылка для восстановления отправлена на почту ${email}.`}
    }

    async resetPassword(token,newPassword) {
        const payload = await tokenService.validatePasswordToken(token);
        console.log("payload.userId:", payload.userId);
        if (!payload) {
            throw ApiError.BadRequest("Ссылка недействительна или истекла");
        }
        const user = await UserModel.findById(payload.userId);
        if(!user) {
            throw ApiError.BadRequest("Пользователь не найден!");
        }
        user.password = await bcrypt.hash(newPassword, 4);
        await user.save();
    }

}

module.exports = new UserService();