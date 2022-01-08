


class MessageDto {
    id;
    message;
    date;
    profilePhoto;
    email;
    name;

    constructor({id, message, date, profilePhoto, email, name}) {
        this.id = id;
        this.message = message;
        this.date = date;
        this.profilePhoto = profilePhoto;
        this.email = email;
        this.name = name;
    }

    static fromJson(json) {
        const parsed = JSON.parse(json);
        return new MessageDto(
            parsed.id,
            parsed.message,
            parsed.date,
            parsed.profilePhoto,
            parsed.email,
            parsed.name,
        );
    }
}

module.exports = {MessageDto}