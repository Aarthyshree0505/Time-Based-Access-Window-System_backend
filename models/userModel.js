const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:String,
    email: String,
    password: String,
    role:String
})

const User = mongoose.model("UserAccount",userSchema)
module.exports = User;