const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const Request = require("../models/requestModel");
const AccessLog = require("../models/accessLogModel");


// ================= CREATE REQUEST =================
router.post('/create', auth, async (req, res) => {
    const { title, description, requestedTo, requestedStart, requestedEnd } = req.body;

    if (!title || !description || !requestedTo) {
        return res.json({ message: "please send all the details" });
    }

    const request = new Request({
        title,
        description,
        status: "PENDING",
        requestedBy: req.user,
        requestedTo,
        requestedStart: requestedStart ? new Date(requestedStart) : null,
        requestedEnd: requestedEnd ? new Date(requestedEnd) : null,
    });

    await request.save();
    return res.json({ message: "request created" });
});


// ================= USER VIEW THEIR OWN REQUESTS =================
router.get("/my-requests", auth, async (req, res) => {
    const requests = await Request.find({
        requestedBy: req.user
    }).populate("requestedTo", "name email");

    res.json({ requests });
});


// ================= USER VIEW APPROVED REQUESTS =================
router.get("/approved", auth, async (req, res) => {
    const requests = await Request.find({
        requestedBy: req.user,
        status: "APPROVED"
    });

    res.json({ requests });
});


// ================= ADMIN VIEW ALL REQUESTS =================
router.get("/all-requests", auth, async (req, res) => {
    console.log("role is:", req.role); // debug line

    if (req.role !== "ADMIN") {
        return res.json({ message: "only admin allowed" });
    }

    const requests = await Request.find()
        .populate("requestedBy", "name email role")
        .populate("requestedTo", "name email role");

    console.log("requests found:", requests.length); // debug line

    res.json({ requests });
});


// ================= ADMIN APPROVE =================
router.put("/approve/:id", auth, async (req, res) => {
    if (req.role !== "ADMIN") {
        return res.json({ message: "Only admin can approve" });
    }

    const { accessStart, accessEnd } = req.body;

    if (!accessStart || !accessEnd) {
        return res.json({ message: "Access start and end time required" });
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
        return res.json({ message: "Request not found" });
    }

    request.status = "APPROVED";
    request.accessStart = new Date(accessStart);
    request.accessEnd = new Date(accessEnd);
    request.actionTakenOn = new Date();

    await request.save();

    res.json({ message: "Access window assigned successfully" });
});


// ================= ADMIN REJECT =================
router.put("/reject/:id", auth, async (req, res) => {
    if (req.role !== "ADMIN") {
        return res.json({ message: "only admin allowed" });
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
        return res.json({ message: "request not found" });
    }

    request.status = "REJECTED";
    request.actionTakenOn = new Date();

    await request.save();

    res.json({ message: "request rejected" });
});


// ================= CHECK ACCESS WINDOW =================
router.get("/check-access/:id", auth, async (req, res) => {
    const request = await Request.findById(req.params.id);

    if (!request) {
        return res.json({ message: "request not found" });
    }

    if (request.status !== "APPROVED") {
        return res.json({ message: "request not approved" });
    }

    const now = new Date();
    let result;

    if (now >= request.accessStart && now <= request.accessEnd) {
        result = "ACCESS GRANTED";
    } else {
        result = "ACCESS DENIED";
    }

    const log = new AccessLog({
        user: req.user,
        requestId: request._id,
        accessTime: now,
        status: result
    });

    await log.save();

    res.json({
        message: result,
        start: request.accessStart,
        end: request.accessEnd
    });
});


// ================= ADMIN VIEW ACCESS LOGS =================
router.get("/access-logs", auth, async (req, res) => {
    if (req.role !== "ADMIN") {
        return res.json({ message: "only admin allowed" });
    }

    const logs = await AccessLog.find()
        .populate("user", "name email")
        .populate("requestId", "title");

    res.json({ logs });
});


// ================= DELETE REQUEST =================
router.delete("/delete/:id", auth, async (req, res) => {
    const request = await Request.findById(req.params.id);

    if (!request) {
        return res.json({ message: "Request not found" });
    }

    if (request.requestedBy.toString() !== req.user) {
        return res.json({ message: "Not allowed" });
    }

    await request.deleteOne();

    res.json({ message: "Request deleted" });
});


module.exports = router;