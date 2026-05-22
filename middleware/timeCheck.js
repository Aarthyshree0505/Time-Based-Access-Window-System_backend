const Request = require("../models/requestModel");

module.exports = async (req, res, next) => {

    const currentTime = new Date();

    const activeRequest = await Request.findOne({
        requestedBy: req.user,
        status: "APPROVED"
    });

    if(!activeRequest){
        return res.json({ message: "No approved access window" })
    }

    if(currentTime > activeRequest.accessEnd){

        
        activeRequest.status = "EXPIRED";
        await activeRequest.save();

        return res.json({ message: "Access expired" })
    }

    if(currentTime < activeRequest.accessStart){
        return res.json({ message: "Access not started yet" })
    }

    next();
}
