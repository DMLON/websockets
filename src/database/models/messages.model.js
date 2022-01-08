


class MessageModel {
    id;
    message;
    date;
    profilePhoto;
    email;
    name;

    constructor({id, message, date, profilePhoto, email, name}) {
        this._id = id;
        this._message = message;
        this._date = date;
        this._profilePhoto = profilePhoto;
        this._email = email;
        this._name = name;
    }

    static fromJson(json) {
        const parsed = JSON.parse(json);
        return new MessageModel(
            parsed.id,
            parsed.message,
            parsed.date,
            parsed.profilePhoto,
            parsed.email,
            parsed.name,
        );
    }

    // Setters -----------
    set _id(value) {
        if(!value)
            throw new Error("Id cannot be null");
        this.id = value;
    }

    set _message(value) {
        if(!value)
            throw new Error("Message cannot be null");
        this.message = value;
    }

    set _date(value) {
        if(!value)
            throw new Error("Date cannot be null");
        this.date = value;
    }

    set _profilePhoto(value) {
        this.profilePhoto = value;
    }

    set _email(value) {
        if(!value)
            throw new Error("Email cannot be null");
        this.email = value;
    }

    set _name(value) {
        if(!value)
            throw new Error("Name cannot be null");
        this.name = value;
    }
}

module.exports = {MessageModel};