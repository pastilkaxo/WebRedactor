module.exports = class UserDto{
    email;
    id;
    isActivated;
    isBlocked;
    roles;
    

    constructor(model){
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.isBlocked = model.isBlocked;
        this.roles = model.roles;
    }
}