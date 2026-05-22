const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAccount"   // ← fixed
    },
    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Request"
    },
    accessTime: Date,
    status: String

}, { timestamps: true });

module.exports = mongoose.model("AccessLog", logSchema);