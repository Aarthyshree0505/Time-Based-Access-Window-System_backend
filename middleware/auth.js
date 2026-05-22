const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.SECRETE_CODE);

        req.user = decoded.user;   // user ID
        req.role = decoded.role;   // "ADMIN" or "USER"

        next();
    } catch (err) {
        return res.json({ message: "Invalid or expired token" });
    }
};

module.exports = auth;