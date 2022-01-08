const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const ProductoSchema = new Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true }
});
  
const ProductoModel = mongoose.model("products",ProductoSchema);

module.exports =  {ProductoModel}