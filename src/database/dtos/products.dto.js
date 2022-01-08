


class ProductDto {
    id;
    title;
    price;
    thumbnail;

    constructor({id, title, price, thumbnail}) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.thumbnail = thumbnail;
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

    
}


module.exports = {ProductDto}