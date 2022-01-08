

class UserDto {
    username;
    email;
    password;
    profilePhoto;
    authMethod;
    firstName;
    lastName;

    constructor({username, email, password, profilePhoto, authMethod, firstName, lastName}) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.profilePhoto = profilePhoto;
        this.authMethod = authMethod;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    static fromJson(json) {
        const parsed = JSON.parse(json);
        return new UserModel(
            parsed.username,
            parsed.email,
            parsed.password,
            parsed.profilePhoto,
            parsed.authMethod,
            parsed.firstName,
            parsed.lastName
        );
    }
}

module.exports = {UserDto}