const { Schema, model, Types } = require("mongoose");

const ImageSchema = new Schema({
    fileName: { type: String, required: true },
    s3Key: { type: String, required: true },

    owner: { type: Types.ObjectId, ref: "User", required: true },

    visibility: {
        type: String,
        enum: ["PRIVATE", "PUBLIC", "SHARED", "ROLE"],
        default: "PRIVATE"
    },

    sharedWith: [{ type: Types.ObjectId, ref: "User" }],
    sharedWithEmails: [{ type: String }],   


    createdAt: { type: Date, default: Date.now }
});

module.exports = model("Image", ImageSchema);
