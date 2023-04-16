require("dotenv").config();
const Patient = require("../models/Patient");
const { translateError } = require("./mongo_helper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* Generate Password Salt and hash */
const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(13);
  console.log("The salt generated ", salt);
  return await bcrypt.hash(password, salt);
};

/* Create new Patient */
const createPatient = async ({
  firstname,
  lastname,
  username,
  phonenumber,
  email,
  password,
  age,
  occupation,
  spousePhone,
  emergencyContact,
  address,
  spouseName,
  profilePhoto,
  profilePhotoPublicCloudinaryId,
}) => {
  try {
    let patient = new Patient({
      firstname,
      lastname,
      username,
      phonenumber,
      age,
      occupation,
      spousePhone,
      emergencyContact,
      address,
      email,
      spouseName,
      password: await encryptPassword(password),
      profilePhoto,
      profilePhotoPublicCloudinaryId,
    });

    console.log("The Patient Created ", patient);

    //Create a  token
    const token = jwt.sign(
      { id: patient._id, role: "Patient" },
      process.env.JWT_SECRET
    );

    patient.token = token;

    if (await patient.save()) {
      return [true, patient];
    }
  } catch (error) {
    console.log(error);
    return [false, translateError(error)];
  }
};

/* Return patient with specified iemail*/
const getPatientByEmail = async (email) => {
  const user = await Patient.findOne({ email });

  if (user !== null) {
    return [true, user];
  } else {
    return [false, "Patient with that email doesn't exist"];
  }
};

/* Return patient with specified username*/
const getPatientByUsername = async (username) => {
  const user = await Patient.findOne({ username });

  if (user !== null) {
    return [true, user];
  } else {
    return [false, "Patient with that username doesn't exist"];
  }
};

/* Authenticate Patient */
const authenticatePatient = async (username, password) => {
  const patient = await Patient.findOne({ username });

  if (patient && (await bcrypt.compare(password, patient.password))) {
    return [true, patient];
  } else {
    return [false, "Incorrect username/password"];
  }
};

//Get patient by id
const getPatientById = async (id) => {
  try {
    const user = await Patient.findById(id);
    if (user !== null) {
      return [true, user];
    } else {
      return [
        false,
        "Patient doesn't exist. It is null and/or has been deleted.",
      ];
    }
  } catch (error) {
    console.log(translateError(error));
    return [false, translateError(error)];
  }
};

//Update Patient Password
const updatePatientPassword = async (id, password) => {
  try {
    const userWithPassword = await Patient.findByIdAndUpdate(
      id,
      { password: await encryptPassword(password) },
      { new: true }
    );
    if (userWithPassword !== null) {
      return [true, userWithPassword];
    } else {
      return [
        false,
        "Patient with ID and Password does not exist. Patient is null and/or has been deleted,",
        "Something went wrong.",
      ];
    }
  } catch (error) {
    console.log(error);
    return [false, translateError(error), "Something went wrong"];
  }
};

// Delete Patient
const deletePatient = async (id) => {
  try {
    const user = await Patient.findByIdAndDelete(id);
    if (!user) {
      throw new Error("Patient not found");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

//Get All Patients
const getAllPatients = async () => {
  try {
    const users = await Patient.find({});
    if (!users) {
      throw new Error("Patients not found");
    }
    return users;
  } catch (error) {
    throw error;
  }
};

//updatePatient

const updatePatient = async (id, fields) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(id, fields, {
      new: true,
    });
    if (updatedPatient !== null) {
      return [true, updatedPatient];
    } else {
      return [
        false,
        "Patient doesn't exist. It is null and/or has been deleted.",
        "Something went wrong.",
      ];
    }
  } catch (error) {
    return [false, translateError(error), "Something went wrong."];
  }
};

const generateVerificationToken = (id) => {
  console.log("The user id passed into the jwt generate method", id);
  const verificationToken = jwt.sign(
    { id: id },
    process.env.USER_VERIFICATION_TOKEN_SECRET,
    { expiresIn: "24h" }
  );
  console.log("Generated verification token ", verificationToken);
  return verificationToken;
};

const decodeToken = (token) => {
  try {
    const payload = jwt.verify(
      token,
      process.env.USER_VERIFICATION_TOKEN_SECRET
    );
    return [true, payload];
  } catch (error) {
    return [false, error];
  }
};

module.exports = {
  createPatient,
  encryptPassword,
  getPatientByUsername,
  getPatientByEmail,
  getAllPatients,
  deletePatient,
  authenticatePatient,
  updatePatient,
  generateVerificationToken,
  decodeToken,
  getPatientById,
  updatePatientPassword,
};
