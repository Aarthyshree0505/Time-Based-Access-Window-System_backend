const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING"
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAccount"   // ← fixed
    },
    requestedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAccount"   // ← fixed
    },
    requestedStart: Date,
    requestedEnd: Date,
    accessStart: Date,
    accessEnd: Date,
    actionTakenOn: Date

}, { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);