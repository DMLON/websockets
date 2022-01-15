


class ProductModel {
    id;
    title;
    price;
    thumbnail;

    constructor({id, title, price, thumbnail}) {
        this._id = id;
        this._title = title;
        this._price = price;
        this._thumbnail = thumbnail;
    }

    static fromJson(json) {
        const parsed = JSON.parse(json);
        return new ProductModel(
            parsed.id,
            parsed.title,
            parsed.price,
            parsed.thumbnail
        );
    }

    set _thumbnail(value) {
        this.thumbnail = value;
    }

    set _id(value) {
        this.id = value;
    }

    set _title(value) {
        if(!value)
            throw new Error("Title cannot be null");
        this.title = value;
    }

    set _price(value) {
        if(!value)
            throw new Error("Price cannot be null");
        if(isNaN(value))
            throw new Error("Price must be a number");
        if(value < 0)
            throw new Error("Price cannot be negative");
        this.price = value;
    }
}

module.exports = {ProductModel}