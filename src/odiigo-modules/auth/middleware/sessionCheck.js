// middlewares/sessionCheck.js

const User = require("../models/User");

const sessionCheck = async (req, res, next) => {
    const phone = req.user?.phone;

    if (!phone) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findOne({ phone });
    if (!user) return res.status(401).json({ message: "User not found" });

    const fifteenDaysAgo = Date.now() - 15 * 24 * 60 * 60 * 1000; // 15 days in ms

    if (!user.lastLogin || user.lastLogin.getTime() < fifteenDaysAgo) {
        return res
            .status(401)
            .json({ message: "Session expired, please re-login" });
    }

    next();
};

module.exports = sessionCheck;