const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt")
require("dotenv").config()
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")

// ================= REGISTER =================
router.post('/register', async (req, res) => {
    const { name, email, role, password } = req.body;

    if (!email || !password || !name || !role) {
        return res.json({ message: "invalid request" });
    }

    if (role !== "ADMIN" && role !== "USER") {
        return res.json({ message: "role must be ADMIN or USER" });
    }

    const usercheck = await User.findOne({ email });
    if (usercheck) {
        return res.json({ message: "email already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    return res.json({ message: "user created" });
});

// keep /signup working too (optional)
router.post('/signup', async (req, res) => {
    const { name, email, role, password } = req.body;

    if (!email || !password || !name || !role) {
        return res.json({ message: "invalid request" });
    }

    if (role !== "ADMIN" && role !== "USER") {
        return res.json({ message: "role must be ADMIN or USER" });
    }

    const usercheck = await User.findOne({ email });
    if (usercheck) {
        return res.json({ message: "email already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    return res.json({ message: "user created" });
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.json({ message: "Email is invalid" });
        }

        const isPasswordMatching = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordMatching) {
            return res.json({ message: "password invalid" });
        }

        const token = jwt.sign(
            { user: user._id, role: user.role },
            process.env.SECRETE_CODE,
            { expiresIn: "1h" }
        );

        // ✅ return token AND user object
        return res.json({
            message: "login successfull",
            token: token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.log(err);
        return res.json({ message: "server error" });
    }
});

// ================= GET ALL USERS =================
router.get("/all", auth, async (req, res) => {
    const users = await User.find({}, "name email role");
    res.json({ users });
});

module.exports = router;