const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth")
const Request = require("../models/requestModel")

router.post('/create',auth ,async(req,res)=>{
        const title=req.body.title;
        const description=req.body.description
        const requestedTo=req.body.requestedTo
        if(!title || !description || !requestedTo){
            return res.json({"message":"please send all the details"})
        }
        const request=Request({
            title: title,
            description:description, //DECODE AUTOMATICALLY
            status:"PENDING",
            requestedBy:req.user,
            requestedTo:requestedTo
        })
        await request.save()
        return res.json({"message": "valid"})
})
router.get("/my-requests",auth ,async(res,req) => {
    const requests=await Request.find({requestedBy:req.user,status:"PENDING"}) 
    res.json({"requests":requests})                 //find  it take one data (requests)
});

module.exports = router;