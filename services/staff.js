require("dotenv").config();
const Staff = require("../models/Staff");
const { translateError } = require("./mongo_helper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* Generate Password Salt and hash */
const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(13);
  console.log("The salt generated ", salt);
  return await bcrypt.hash(password, salt);
};

//Create Staff
const createStaff = async ({
  firstname,
  lastname,
  username,
  phonenumber,
  email,
  password,
  profilePhoto,
  profilePhotoPublicCloudinaryId,
}) => {
  try {
    let staff = new Staff({
      firstname,
      lastname,
      username,
      phonenumber,
      email,
      password: await encryptPassword(password),
      profilePhoto,
      profilePhotoPublicCloudinaryId,
    });

    console.log("The Staff Created ", staff);

    //Create a  token
    const token = jwt.sign(
      { id: staff._id, role: "Staff" },
      process.env.JWT_SECRET
    );

    staff.token = token;

    if (await staff.save()) {
      return [true, staff];
    }
  } catch (error) {
    console.log(error);
    return [false, translateError(error)];
  }
};

/* Return Staff with specified iemail*/
const getStaffByEmail = async (email) => {
  const user = await Staff.findOne({ email });

  if (user !== null) {
    return [true, user];
  } else {
    return [false, "Staff with that email doesn't exist"];
  }
};

/* Return Staff with specified username*/
const getStaffByUsername = async (username) => {
  const user = await Staff.findOne({ username });

  if (user !== null) {
    return [true, user];
  } else {
    return [false, "Staff with that username doesn't exist"];
  }
};

// Delete Staff
const deleteStaff = async (id) => {
  try {
    const user = await Staff.findByIdAndDelete(id);
    if (!user) {
      throw new Error("Staff not found");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

//Get Staff by id
const getStaffById = async (id) => {
  try {
    const user = await Staff.findById(id);
    if (user !== null) {
      return [true, user];
    } else {
      return [
        false,
        "Staff doesn't exist. It is null and/or has been deleted.",
      ];
    }
  } catch (error) {
    console.log(translateError(error));
    return [false, translateError(error)];
  }
};

//Update Staff Password
const updateStaffPassword = async (id, password) => {
  try {
    const userWithPassword = await Staff.findByIdAndUpdate(
      id,
      { password: await encryptPassword(password) },
      { new: true }
    );
    if (userWithPassword !== null) {
      return [true, userWithPassword];
    } else {
      return [
        false,
        "Staff with ID and Password does not exist. Staff is null and/or has been deleted,",
        "Something went wrong.",
      ];
    }
  } catch (error) {
    console.log(error);
    return [false, translateError(error), "Something went wrong"];
  }
};

//Get All Staffs
const getAllStaffs = async () => {
  try {
    const users = await Staff.find({});
    if (!users) {
      throw new Error("Staffs not found");
    }
    return users;
  } catch (error) {
    throw error;
  }
};

//updateStaff

const updateStaff = async (id, fields) => {
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(id, fields, {
      new: true,
    });
    if (updatedStaff !== null) {
      return [true, updatedStaff];
    } else {
      return [
        false,
        "Staff doesn't exist. It is null and/or has been deleted.",
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

/* Authenticate Staff */
const authenticateStaff = async (username, password) => {
  const staff = await Staff.findOne({ username });

  if (staff && (await bcrypt.compare(password, staff.password))) {
    return [true, staff];
  } else {
    return [false, "Incorrect username/password"];
  }
};

module.exports = {
  createStaff,
  encryptPassword,
  getStaffByUsername,
  getStaffByEmail,
  getAllStaffs,
  deleteStaff,
  authenticateStaff,
  updateStaff,
  generateVerificationToken,
  decodeToken,
  getStaffById,
  updateStaffPassword,
};
