require("dotenv").config();
const express = require("express");
const router = express.Router();
// Auth Middleware
const { authorize, isAdmin, isActive } = require("../middleware/auth");
const {
  createPatient,
  getPatientById,
  updatePatient,
  updatePatientPassword,
  authenticatePatient,
} = require("../services/patient");
const { translateError } = require("../services/mongo_helper");
const {
  patientSignupValidator,
  validate,
  updatePatientValidator,

  loginValidator,
  updatePatientPasswordValidator,
} = require("../services/validation");
const {
  upload,
  uploadProfilePicToCloudinary,
  updateProfilePicture,
} = require("../services/upload");

const Patient = require("../models/Patient");

let uploadProfileImageMiddleware = upload.fields([
  { name: "profilePhoto", maxCount: 1 },
]);

//Create Patient
router.post(
  "/patient-signup",
  upload.single("profilePhoto"),
  patientSignupValidator(),
  validate,
  async (req, res) => {
    console.log("signing up");
    try {
      console.log("Signup User");
      console.log("The req body ", req.body);

      const {
        firstname,
        lastname,
        username,
        phonenumber,
        age,
        occupation,
        spouseName,
        spousePhone,
        emergencyContact,
        address,
        email,
        password,
      } = req.body;

      let patientObj = {
        firstname,
        lastname,
        username,
        phonenumber,
        email,
        password,
        age,
        occupation,
        spouseName,
        spousePhone,
        emergencyContact,
        address,
      };
      let filepath = req.file && req.file.path;
      // Check if images on the files property are existent
      if (filepath !== undefined) {
        let result = await uploadProfilePicToCloudinary(filepath);
        console.log("The result from uploading to cloudinary ", result);
        let PatientPictureId = result.publicId; //To get the public cloudinary id which will be used to delete the image when updating and deleting products.
        let profilePhoto = result.url;
        patientObj.profilePhoto = profilePhoto;
        patientObj.profilePhotoPublicCloudinaryId = PatientPictureId;

        console.log("Patient picture added ");
        // To use local file path on disk storage
        // patientObj.picture = filepath
        console.log("The Patient object ", patientObj);

        const check = await createPatient(patientObj);
        console.log("The Patient ", check);
        if (check[0] !== false) {
          let tal = check[1];
          return res.status(201).json({
            message: "Patient created successfully with picture uploaded",
            status: "OK",
            Patient: tal,
          });
        } else {
          return res.status(400).json({
            error: "Something went wrong.",
            actualError: check[1],
            status: "NOT OK",
          });
        }
      } else {
        console.log("No Patient picture added ");
        console.log("The Patient object ", patientObj);

        const check = await createPatient(patientObj);
        if (check[0] !== false) {
          console.log("The Patient ", check);
          return res.status(201).json({
            message: "Patient created successfully. No picture uploaded",
            status: "OK",
            Patient: check[1],
          });
        } else {
          return res.status(400).json({
            error: "Something went wrong.",
            actualError: check[1],
            status: "NOT OK",
          });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        error: "Something went wrong",
        actualError: translateError(error),
        status: "NOT OK",
      });
    }
  }
);

/* Edit a Patient */
router.put(
  "/editPatient/:id",
  uploadProfileImageMiddleware,
  updatePatientValidator(),
  validate,
  async (req, res) => {
    try {
      //Get Current User

      const { id } = req.params;
      let foundPatient = await getPatientById(id);

      if (foundPatient[0] !== false) {
        let files = req.files;

        let {
          firstname,
          lastname,
          username,
          phonenumber,
          email,
          age,
          occupation,
          spouseName,
          spousePhone,
          emergencyContact,
          address,
        } = req.body;

        let patientObj = {
          firstname,
          lastname,
          username,
          phonenumber,
          email,
          age,
          occupation,
          spouseName,
          spousePhone,
          emergencyContact,
          address,
        };

        console.log("Found Patient -- ", foundPatient[1]);

        let foundPatientPublicId =
          foundPatient[1].profilePhotoPublicCloudinaryId !== undefined
            ? foundPatient[1].profilePhotoPublicCloudinaryId
            : "not_found";

        // Check if images on the files property are existent
        let profilePhoto = files.profilePhoto
          ? files.profilePhoto[0].path
          : undefined;

        // To use Cloudinary
        let result1 = null;

        profilePhoto != undefined
          ? (result1 = await updateProfilePicture(
              foundPatientPublicId,
              profilePhoto
            ))
          : (result1 = undefined);

        console.log(
          "The results from updating the profile phototo cloudinary (Deleting the old images and uploading the new ones)",
          result1
        );

        patientObj.profilePhoto = result1 && result1.url;

        // To save the public Ids of each of the image which we can later use for updating and deleting images from cloudinary
        patientObj.profilePhotoPublicCloudinaryId = result1 && result1.publicId;

        console.log("The Patient Object ", patientObj);

        const check = await updatePatient(id, patientObj);
        //NB: We wont have any issue even if we have no pictures because the pictures used would still be the ones created Initially.
        console.log("The Updated Patient from DB", check);
        if (check[0] !== false) {
          let updatedPatient = check[1];
          res.status(201).json({
            message: "Patient updated successfully.",
            status: "OK",
            patient: updatedPatient,
          });
        } else {
          return res
            .status(400)
            .json({ error: check[2], actualError: check[1], status: "NOT OK" });
        }
      } else {
        return res.status(422).json({
          error: "Something went wrong.",
          actualError: foundPatient[1],
          status: "NOT OK",
        });
      }
    } catch (error) {
      console.log(error);
      // return res.status(400).json({error: "Something Went wrong", actualError:translateError(error), status: "NOT OK" });
      return res.status(500).json({
        error: "Something Went wrong",
        actualError: translateError(error),
        status: "NOT OK",
      });
    }
  }
);

router.put(
  "/editPatient/password/:id",

  updatePatientPasswordValidator(),
  validate,
  async (req, res) => {
    let { id } = req.params;
    console.log(req.body);

    const { confirmNewPassword } = req.body;

    const tryUpdate = await updatePatientPassword(id, confirmNewPassword);
    console.log("Edit Patient password  ", tryUpdate);
    if (tryUpdate[0] !== false) {
      res.json({ message: "Password updated successfully", status: "OK" });
    } else {
      return res.status(400).json({
        error: tryUpdate[2],
        actualError: tryUpdate[1],
        status: "NOT OK",
      });
    }
  }
);

router.post("/patient-login", loginValidator, async (req, res) => {
  try {
    const { username, password } = req.body;
    let patientExists = await authenticatePatient(username, password);
    console.log("The patient Exists ", patientExists);

    if (patientExists[0] == true) {
      patientExists = patientExists[1];

      //Create token
      const token = patientExists.token;
      //Save token in a cookie and send back to the frontend
      res.cookie("authToken", token, {
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24, //Cookie expires after 24hours of being logged in.. 1000 milliseconds * 60seconds * 60minutes *24 hours
        httpOnly: true,
      });

      const {
        _id,
        firstname,
        lastname,
        username,
        email,
        role,
        age,
        occupation,
        spouseName,
        spousePhone,
        emergencyContact,
        address,
        profilePhoto,
        phonenumber,
      } = patientExists;

      let patient = {
        _id,
        firstname,
        lastname,
        username,
        email,
        role,
        age,
        occupation,
        spouseName,
        spousePhone,
        emergencyContact,
        address,
        profilePhoto,
        phonenumber,
      };

      console.log("The logged in patient ", patient);
      res
        .status(200)
        .json({ message: "patient Login successful", status: "OK", patient });
    } else {
      return res.status(400).json({
        error: "Something went wrong",
        actualError: patientExists[1],
        status: "NOT OK",
      });
    }
  } catch (error) {
    //Catch block isn't needed as the Else block would handle the error if it isn't already handled by our middlewares
    console.log(error);
    return res.status(400).json({ error: "Something went wrong" });
  }
});

// GET /patients - retrieve all patients
router.get("/patients", async (req, res) => {
  try {
    // Query the database for all patients
    const patients = await Patient.find();

    // Return the list of patients
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});
module.exports = router;
