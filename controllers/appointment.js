const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// POST /appointments - create a new appointment
router.post("/appointments", async (req, res) => {
  const {
    patientId,
    doctorName,
    appointmentDate,
    appointmentStartTime,
    appointmentEndTime,
    appointmentNotes,
  } = req.body;

  try {
    // Check if appointment already exists
    const existingAppointment = await Appointment.findOne({
      doctorName,
      appointmentDate,
      appointmentStartTime,
      appointmentEndTime,
      status: { $ne: "cancelled" },
    });

    if (existingAppointment) {
      return res.status(409).json({
        message: "Appointment already exists",
      });
    }

    // Create a new appointment
    const appointment = new Appointment({
      patientId,
      doctorName,
      appointmentDate,
      appointmentStartTime,
      appointmentEndTime,
      appointmentNotes,
    });

    // Save the appointment to the database
    await appointment.save();

    // Return the newly created appointment
    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

router.get("/appointments", async (req, res) => {
  try {
    // Query the database for all appointments
    const appointments = await Appointment.find().populate("patientId");

    // Return the list of appointments
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

// GET /appointments/:patientId - retrieve appointments by patient ID
router.get("/appointments/:patientId", async (req, res) => {
  const patientId = req.params.patientId;

  try {
    // Query the database for all appointments associated with the patient ID
    const appointments = await Appointment.find({
      patientId: patientId, // Update to "patientId" field
    }).populate("patientId"); // Update to "patientId" field

    // Return the list of appointments
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

// PUT /appointments/:id/cancel - cancel an appointment by ID
router.put("/appointments/:id/cancel", async (req, res) => {
  try {
    // Find the appointment in the database by ID
    const appointment = await Appointment.findById(req.params.id);

    // If the appointment doesn't exist, return a 404 error
    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // Update the appointment's status to "cancelled"
    appointment.status = "cancelled";
    await appointment.save();

    // Return the updated appointment as a response
    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});
module.exports = router;
