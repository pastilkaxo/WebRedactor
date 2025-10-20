const userService = require('../service/user-service');
const {validationResult} = require('express-validator');
const ApiError = require('../Exceptions/api-error');

class UserController {

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
            // res.cookie('passwordToken',result.passwordToken,{maxAge:15*60*1000,httpOnly:true});
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