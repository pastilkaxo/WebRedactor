const ApiError = require('../errors/api-error');
const ImageModel = require('../models/image-model');

module.exports = async function (req, res, next) {
    try {
        const imageId = req.params.id || req.body.imageId;
        if (!imageId) return next(ApiError.BadRequest("Image ID required"));

        const image = await ImageModel.findById(imageId);
        if (!image) return next(ApiError.NotFound("Image not found"));

        req.image = image;

        if (image.visibility === "PUBLIC") return next();

        const user = req.user;
        if (!user) return next(ApiError.Unauthorized("Auth required"));

        if (image.owner.toString() === user.id.toString()) return next();

        if (image.visibility === "SHARED") {
            if (image.sharedWith.some(u => u.toString() === user.id.toString())) {
                return next();
            }
            return next(ApiError.Forbidden("You do not have access (shared)"));
        }

        return next(ApiError.Forbidden("You do not have access"));
    } catch (err) {
        next(ApiError.Internal("Middleware error: " + err.message));
    }
};
