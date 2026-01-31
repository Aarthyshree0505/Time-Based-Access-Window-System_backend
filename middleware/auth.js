
const jwyt = require("jsonwebtoken") 

const secretCode = process.env.SECRETE_CODE;

module.exports = (req,res,next) => {
    const authorization = req.headers.authorization;
    if(!authorization) {
        return res.json({"message" : "authorization missing"})
    }
    try{
        const token = authorization.split(" ")[1]    //split bearer (token) by space , [0] [1]
        const decode = jwt.verify(token,secretCode)
        req.user=decode.user
        next()
       
   }catch(err){
        console.log(err)
        return res.json({"message": "token is invalid or expired"})
    }
}

