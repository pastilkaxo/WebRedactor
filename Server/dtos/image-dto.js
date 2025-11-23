
module.exports = class ImageDto {
    id;
    filename;
    owner;
    visibility;
    s3key;
    sharedWith;
    updatedAt;
    createdAt;
    constructor(model) {
        this.id = model._id;
        this.filename = model.filename;
        this.s3Key = model.s3Key;
        this.owner = model.owner;
        this.visibility = model.visibility;
        this.sharedWith = model.sharedWith;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
}