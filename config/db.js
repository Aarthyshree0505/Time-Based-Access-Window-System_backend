require("dotenv").config()
const mongoose = require('mongoose')


module.exports = () => {
    console.log("db url : ",process.env.DB_URL)
    mongoose.connect(process.env.DB_URL).then(() =>{console.log("database connected")}).catch((err) => {console.log(err)})
    
}