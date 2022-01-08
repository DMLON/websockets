const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    profilePhoto: { type: String},
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    authMethod: { type: String, required: true },
});
  
const UsersModel = mongoose.model("users",UsersSchema);

module.exports = {UsersModel}