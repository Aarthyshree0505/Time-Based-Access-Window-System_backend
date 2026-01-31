const experss = require('express')
const router = experss.Router()
const bcrypt=require("bcrypt")
require("dotenv").config()
const User = require("../models/userModel")
const jwt=require("jsonwebtoken")

router.post('/signup',async(req,res) => {
    console.log(req.body)
    const name=req.body.name
    const email=req.body.email
    const role=req.body.role
    const password=req.body.password

    console.log(name)

    if (!email ||!password){
        return res.json({"message":"invalid request"})
    }
    const usercheck=await User.findOne({email:email})
    console.log("usercheck:",usercheck)
    if(usercheck){
        return res.json({"message":"email already exist"})
    }

    const hashedPassword=await bcrypt.hash(password,10)
    const user =new User({
        name:name,
        email:email,
        password:hashedPassword,
        role:role,
    })
    await user.save()
    return res.json({"message":"success"})
})

router.post("/login",async(req,res)=>{
    const user=await User.findOne({email:req.body.email})
    if(!user){
        return res.json({message:"Email is invalid"})
    }
    console.log(user,user.password, req.body.password)
    
    const isPasswordMatching= await bcrypt.compare(req.body.password,user.password)
    
    if(!isPasswordMatching){
        return res.json({"message":"password invalid"})
    }
    try {
        const token = jwt.sign(
            { user: user._id },
            process.env.SECRETE_CODE,
            { expiresIn: "1h" }
        )
        return res.json({ message: "login successfull", token: token })
        } catch (err) {
            console.log(err)
            return res.json({"message":"server error"})
    }
}) 
module.exports = router