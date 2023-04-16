require("dotenv").config();
const express = require("express");
const router = express.Router();
// Auth Middleware
const { authorize, isActive } = require("../middleware/auth");
const {
  createStaff,
  getStaffById,
  updateStaff,
  updateStaffPassword,
  authenticateStaff,
} = require("../services/staff");
const { translateError } = require("../services/mongo_helper");
const {
  validate,
  staffSignupValidator,
  updateStaffValidator,
  loginValidator,
  updateStaffPasswordValidator,
} = require("../services/validation");
const {
  upload,
  uploadProfilePicToCloudinary,
  updateProfilePicture,
} = require("../services/upload");

const Staff = require("../models/Staff");

let uploadProfileImageMiddleware = upload.fields([
  { name: "profilePhoto", maxCount: 1 },
]);

//Create Staff
router.post(
  "/staff-signup",
  upload.single("profilePhoto"),
  staffSignupValidator(),
  validate,
  async (req, res) => {
    console.log("signing up");
    try {
      console.log("Signup User");
      console.log("The req body ", req.body);

      const { firstname, lastname, username, phonenumber, email, password } =
        req.body;

      let staffObj = {
        firstname,
        lastname,
        username,
        phonenumber,
        email,
        password,
      };
      let files = req.files;
      let filepath = req.file && req.file.path;
      // Check if images on the files property are existent
      if (filepath !== undefined) {
        let result = await uploadProfilePicToCloudinary(filepath);
        console.log("The result from uploading to cloudinary ", result);
        let StaffPictureId = result.publicId; //To get the public cloudinary id which will be used to delete the image when updating and deleting products.
        let profilePhoto = result.url;
        staffObj.profilePhoto = profilePhoto;
        staffObj.profilePhotoPublicCloudinaryId = StaffPictureId;

        console.log("Staff picture added ");
        // To use local file path on disk storage
        // staffObj.picture = filepath
        console.log("The Staff object ", staffObj);

        const check = await createStaff(staffObj);
        console.log("The Staff ", check);
        if (check[0] !== false) {
          let tal = check[1];
          return res.status(201).json({
            message: "Staff created successfully with picture uploaded",
            status: "OK",
            Staff: tal,
          });
        } else {
          return res.status(400).json({
            error: "Something went wrong.",
            actualError: check[1],
            status: "NOT OK",
          });
        }
      } else {
        console.log("No Staff picture added ");
        console.log("The Staff object ", staffObj);

        const check = await createStaff(staffObj);
        if (check[0] !== false) {
          console.log("The Staff ", check);
          return res.status(201).json({
            message: "Staff created successfully. No picture uploaded",
            status: "OK",
            Staff: check[1],
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

/* Edit a Staff */
router.put(
  "/editStaff/:id",
  uploadProfileImageMiddleware,
  updateStaffValidator(),
  validate,
  async (req, res) => {
    try {
      //Get Current User

      const { id } = req.params;
      let foundStaff = await getStaffById(id);

      if (foundStaff[0] !== false) {
        let files = req.files;

        let { firstname, lastname, username, phonenumber, email } = req.body;

        let staffObj = {
          firstname,
          lastname,
          username,
          phonenumber,
          email,
        };

        console.log("Found Staff -- ", foundStaff[1]);

        let foundStaffPublicId =
          foundStaff[1].profilePhotoPublicCloudinaryId !== undefined
            ? foundStaff[1].profilePhotoPublicCloudinaryId
            : "not_found";

        // Check if images on the files property are existent
        let profilePhoto = files.profilePhoto
          ? files.profilePhoto[0].path
          : undefined;

        // To use Cloudinary
        let result1 = null;

        profilePhoto != undefined
          ? (result1 = await updateProfilePicture(
              foundStaffPublicId,
              profilePhoto
            ))
          : (result1 = undefined);

        console.log(
          "The results from updating the profile phototo cloudinary (Deleting the old images and uploading the new ones)",
          result1
        );

        staffObj.profilePhoto = result1 && result1.url;

        // To save the public Ids of each of the image which we can later use for updating and deleting images from cloudinary
        staffObj.profilePhotoPublicCloudinaryId = result1 && result1.publicId;

        console.log("The Staff Object ", staffObj);

        const check = await updateStaff(id, staffObj);
        //NB: We wont have any issue even if we have no pictures because the pictures used would still be the ones created Initially.
        console.log("The Updated Staff from DB", check);
        if (check[0] !== false) {
          let updatedStaff = check[1];
          res.status(201).json({
            message: "Staff updated successfully.",
            status: "OK",
            Staff: updatedStaff,
          });
        } else {
          return res
            .status(400)
            .json({ error: check[2], actualError: check[1], status: "NOT OK" });
        }
      } else {
        return res.status(422).json({
          error: "Something went wrong.",
          actualError: foundStaff[1],
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
  "/editStaff/password/:id",

  updateStaffPasswordValidator(),
  validate,
  async (req, res) => {
    let { id } = req.params;
    console.log(req.body);

    const { confirmNewPassword } = req.body;

    const tryUpdate = await updateStaffPassword(id, confirmNewPassword);
    console.log("Edit Staff password  ", tryUpdate);
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

router.post("/staff-login", loginValidator, async (req, res) => {
  try {
    const { username, password } = req.body;
    let staffExists = await authenticateStaff(username, password);
    console.log("The staff Exists ", staffExists);

    if (staffExists[0] == true) {
      staffExists = staffExists[1];

      //Create token
      const token = staffExists.token;
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
        profilePhoto,
        phonenumber,
      } = staffExists;

      let staff = {
        _id,
        firstname,
        lastname,
        username,
        email,
        role,
        profilePhoto,
        phonenumber,
      };

      console.log("The logged in staff ", staff);
      res
        .status(200)
        .json({ message: "staff Login successful", status: "OK", staff });
    } else {
      return res.status(400).json({
        error: "Something went wrong",
        actualError: staffExists[1],
        status: "NOT OK",
      });
    }
  } catch (error) {
    //Catch block isn't needed as the Else block would handle the error if it isn't already handled by our middlewares
    console.log(error);
    return res.status(400).json({ error: "Something went wrong" });
  }
});
module.exports = router;
