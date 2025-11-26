const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    roles: [{type: String, ref: 'Role'}],
    resetRequestedAt: { type: Date, default: null },
    isBlocked: {type: Boolean, default: false}
})

module.exports = model('User', UserSchema);