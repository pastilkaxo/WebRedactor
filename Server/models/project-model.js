const {Schema, model} = require('mongoose');

const ProjectSchema = new Schema({
    name: { type: String, required: true },
    s3Key: { type: String, required: true }, 
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // previewUrl: { type: String },
    visibility: { 
        type: String, 
        enum: ['PRIVATE', 'PUBLIC'], 
        default: 'PRIVATE' 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    previewImage: { type: String, default: '' },
    stars: { type: Number, default: 0 }, 
});

module.exports = model('Project', ProjectSchema);