const ApiError = require('../Exceptions/api-error');
const tokenService = require('../service/token-service');

module.exports = async (req, res, next) => {
    try{

    }
    catch(err){
        return next(ApiError.UnauthorizedError());
    }
}