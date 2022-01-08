const mongoose = require('mongoose')

const Schema = mongoose.Schema;


const MessagesSchema = new Schema({
    message: { type: String, required: true },
    date: { type: Date, required: true },
    profilePhoto: { type: String},
    email: { type: String, required: true },
    name: { type: String, required: true },
});
  
const MessagesModel = mongoose.model("messages",MessagesSchema);

module.exports = {MessagesModel}