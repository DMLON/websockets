

class UserModel {
    username;
    email;
    password;
    profilePhoto;
    authMethod;
    firstName;
    lastName;

    constructor({username, email, password, profilePhoto, authMethod, firstName, lastName}) {
        this._username = username;
        this._email = email;
        this._password = password;
        this._profilePhoto = profilePhoto;
        this._authMethod = authMethod;
        this._firstName = firstName;
        this._lastName = lastName;
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

    get fullName() {
        return this.firstName + " " + this.lastName;
    }

    set _lastName(value) {
        if(!value)
            throw new Error("Last name cannot be null");
        this.lastName = value;
    }

    set _firstName(value) {
        if(!value)
            throw new Error("First name cannot be null");
        this.firstName = value;
    }

    set _authMethod(value) {
        if(!value)
            throw new Error("Authentication method cannot be null");
        this.authMethod = value;
    }

    set _profilePhoto(value) {
        this.profilePhoto = value;
    }

    set _password(value) {
        if(!value)
            throw new Error("Password cannot be null");
        this.password = value;
    }

    set _email(value) {
        if(!value)
            throw new Error("Email cannot be null");
        this.email = value;
    }

    set _username(value) {
        if(!value)
            throw new Error("Username cannot be null");
        this.username = value;
    }
}

module.exports = {UserModel};