const userService = require('../service/user-service');
const {validationResult} = require('express-validator');
const ApiError = require('../Exceptions/api-error');

class UserController {
    async register(req, res,next) {
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest("Ошибка при валидации",errors.array()));
            }
            const {email,password} = req.body;
            const userData = await userService.register(email,password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
           return res.json(userData);
        }
        catch(err){
           next(err);
        }
    }


    async login(req, res,next) {
        try{
            const {email,password} = req.body;
            const userData = await userService.login(email,password);
            res.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true});
            return res.json(userData);

        }
        catch(err){
            next(err);
        }
    }

    async logout(req, res,next) {
        try{
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        }
        catch(err){
            next(err);
        }
    }

    async activate(req, res,next) {
        try{
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        }
        catch(err){
            next(err); // ApiError
        }
    }

    async refresh(req, res,next) {
        try{
            const refreshToken = req.cookies.refreshToken;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true});
            return res.json(userData);
        }
        catch(err){
            next(err);
        }   
    }

    async getUsers(req, res,next) {
        try{
            const users = await userService.getAllUsers();
            return res.json(users);
        }
        catch(err){
            next(err);
        }
    }

    async requestPasswordResetLink(req,res,next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest("Ошибка при валидации",errors.array()));
            }
            const {email} = req.body;
            const result = await userService.requestPasswordResetLink(email);
            return res.json(result);

        }
        catch(err){
            next(err);
        }
    }
    async resetPassword(req, res,next) {
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest("Ошибка при валидации",errors.array()));
            }
            const {token,newPassword} = req.body;
            const result = await userService.resetPassword(token,newPassword);
            return res.json(result);
        }
        catch(err){
            next(err);
        }
    }

}

module.exports = new UserController();