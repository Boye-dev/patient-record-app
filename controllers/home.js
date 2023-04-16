/* General/Home route*/
require("dotenv").config();
const express = require("express");
const Patient = require("../models/Patient");
const router = express.Router();
// const { isAdmin, authorize, isActive } = require("../middleware/auth");
const Staff = require("../models/Staff");
router.get("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ message: "Logout Successful" });
});

router.get("/get-user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    // Check if the userId belongs to a Staff
    const staff = await Staff.findById(userId);

    if (staff) {
      return res.json(staff);
    }

    // Check if the userId belongs to a Patient
    const student = await Patient.findById(userId);

    if (student) {
      return res.json(student);
    }

    // If the userId does not belong to either a Staff or a Patient
    return res.status(400).json({ message: "Invalid userId" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
