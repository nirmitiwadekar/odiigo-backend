const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/store-location", async (req, res) => {
  console.log("Received request:", req.body);

  try {
    let { phone, latitude, longitude } = req.body;

    if (!phone || latitude === undefined || longitude === undefined) {
      return res
        .status(400)
        .json({ message: "Phone and location are required" });
    }

    // Handle both formats (+91 and without +91)
    const phoneFormatted = phone.startsWith("+91") ? phone.substring(3) : phone;

    const user = await User.findOne({
      $or: [{ phone: phoneFormatted }, { phone: `+91${phoneFormatted}` }],
    });

    if (!user) {
      console.log("❌ User not found in database");
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Update user location
    user.location = { latitude, longitude };
    await user.save();

    res.status(200).json({ message: "Location stored successfully" });
  } catch (error) {
    console.error("Error storing location:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// ✅ Store user location
// router.post("/store-location", async (req, res) => {
//   console.log("Received request:", req.body);

//   try {
//     let { phone, latitude, longitude } = req.body;

//     if (!phone || latitude === undefined || longitude === undefined) {
//       return res
//         .status(400)
//         .json({ message: "Phone and location are required" });
//     }

//     if (!phone.startsWith("+91")) {
//       phone = `+91${phone}`;
//     }

//     const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;
//     console.log("📞 Searching for user with phone:", formattedPhone);

//     const user = await User.findOne({ phone: formattedPhone });

//     if (!user) {
//       console.log("❌ User not found in database");
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Update user location
//     user.location = { latitude, longitude };
//     await user.save();

//     res.status(200).json({ message: "Location stored successfully" });
//   } catch (error) {
//     console.error("Error storing location:", error.message);
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// });

module.exports = router;
