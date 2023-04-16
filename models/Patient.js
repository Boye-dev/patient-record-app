// Import the mongoose module
const mongoose = require("mongoose");

const { Schema } = mongoose;

const PatientSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true },
    phonenumber: { type: String, required: true },
    age: { type: String, required: true },
    occupation: { type: String, required: true },
    spouseName: { type: String, required: true },
    spousePhone: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    token: { type: String },
    role: { type: String, default: "Patient" },
    profilePhoto: { type: String, required: true },
    profilePhotoPublicCloudinaryId: { type: String },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", PatientSchema);

module.exports = Patient;
