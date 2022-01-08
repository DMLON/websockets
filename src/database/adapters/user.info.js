
class UserInfoSafe {
    username;
    emai;
    profilePhoto;
    authMethod;
    firstName;
    lastName;

    constructor({username, email,profilePhoto, authMethod, firstName, lastName}) {
        this.username = username;
        this.email = email;
        this.profilePhoto = profilePhoto;
        this.authMethod = authMethod;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

module.exports = {UserInfoSafe}