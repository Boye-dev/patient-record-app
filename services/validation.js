//ERROR HANDLING and VALIDATION

const { check, body, validationResult } = require("express-validator");
const {
  getPatientByUsername,
  getPatientByEmail,
  getPatientById,
  authenticatePatient,
} = require("./patient");
const {
  getStaffByUsername,
  getStaffByEmail,
  getStaffById,
  authenticateStaff,
} = require("./staff");

const patientSignupValidator = () => {
  return [
    //Check that email isn't taken
    check("username")
      .custom(async (value) => {
        let patientExist = await getPatientByUsername(value);
        console.log("Exists? ", patientExist);
        if (patientExist[0] !== false) {
          console.log("The Patient already exists");
          return Promise.reject();
        }
      })
      .withMessage("Username is taken! If it belongs to you, please login!"),

    check("email")
      .custom(async (value) => {
        let patientExist = await getPatientByEmail(value);
        console.log("Exists? ", patientExist);
        if (patientExist[0] !== false) {
          console.log("The Patient already exists");
          return Promise.reject();
        }
      })
      .withMessage("Email is taken! If it belongs to you, please login!"),

    //First name and lastname is not null and is between 4-10 characters
    body("firstname", "First Name is required")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),
    body("lastname", "Last Name is required")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),

    //Email validation
    body("email", "Email is required").trim().notEmpty(),
    body("email", "Email must be valid containing @ and a domain (e.g .com)")
      .isEmail()
      .isLength({ min: 10 }),

    body("username", "Enter User Username")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),

    //Password validation
    body("password", "Password is required").trim().notEmpty(),
    body("confirmPassword", "Please enter your password again")
      .trim()
      .notEmpty(),
    body("phonenumber", "Please enter your Phone Number ").trim().notEmpty(),
    body("age", "Please enter your Age").trim().notEmpty(),
    body("occupation", "Please enter your occupation ").trim().notEmpty(),
    body("spouseName", "Please enter your spouseName ").trim().notEmpty(),
    body("spousePhone", "Please enter your spousePhone ").trim().notEmpty(),
    body("emergencyContact", "Please enter your emergencyContact")
      .trim()
      .notEmpty(),
    body("address", "Please enter your address").trim().notEmpty(),

    check("confirmPassword")
      .custom((value, { req }) => {
        console.log("From Validator req body ", req.body);
        const { password } = req.body;
        if (value === password) {
          console.log(
            "Passwords are the same.. Validation passed",
            value === password
          );
          return true;
        } else {
          console.log(
            "Passwords must be the same.. Validation test failed",
            value === password
          );
          return Promise.reject(); //return false or return Promise.reject() would both work since this isn't an async function
        }
      })
      .withMessage("Passwords must be the same"),
    body("password")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
      .withMessage(
        "Password must be atleast 8 characters long and a combination of at least one upper and lower case letter and one number."
      ),
  ];
};

const staffSignupValidator = () => {
  return [
    //Check that email isn't taken
    check("username")
      .custom(async (value) => {
        let patientExist = await getStaffByUsername(value);
        console.log("Exists? ", patientExist);
        if (patientExist[0] !== false) {
          console.log("The Staff already exists");
          return Promise.reject();
        }
      })
      .withMessage("Username is taken! If it belongs to you, please login!"),

    check("email")
      .custom(async (value) => {
        let patientExist = await getStaffByEmail(value);
        console.log("Exists? ", patientExist);
        if (patientExist[0] !== false) {
          console.log("The Staff already exists");
          return Promise.reject();
        }
      })
      .withMessage("Email is taken! If it belongs to you, please login!"),

    //First name and lastname is not null and is between 4-10 characters
    body("firstname", "First Name is required")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),
    body("phonenumber", "Please enter your Phone Number ").trim().notEmpty(),
    body("lastname", "Last Name is required")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),

    //Email validation
    body("email", "Email is required").trim().notEmpty(),
    body("email", "Email must be valid containing @ and a domain (e.g .com)")
      .isEmail()
      .isLength({ min: 10 }),

    body("username", "Enter User Username")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),

    //Password validation
    body("password", "Password is required").trim().notEmpty(),
    body("confirmPassword", "Please enter your password again")
      .trim()
      .notEmpty(),
    check("confirmPassword")
      .custom((value, { req }) => {
        console.log("From Validator req body ", req.body);
        const { password } = req.body;
        if (value === password) {
          console.log(
            "Passwords are the same.. Validation passed",
            value === password
          );
          return true;
        } else {
          console.log(
            "Passwords must be the same.. Validation test failed",
            value === password
          );
          return Promise.reject(); //return false or return Promise.reject() would both work since this isn't an async function
        }
      })
      .withMessage("Passwords must be the same"),
    body("password")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
      .withMessage(
        "Password must be atleast 8 characters long and a combination of at least one upper and lower case letter and one number."
      ),
  ];
};

const updateStaffValidator = () => {
  return [
    //Check that email isn't taken
    check("email")
      .custom(async (value, { req }) => {
        const { id } = req.params;
        let userExist = await getStaffByEmail(value);
        console.log("Exists? ", userExist);
        if (userExist[1]._id == id) {
          console.log(
            "Staff's email didn't change. Still the same email for Staff. ",
            userExist[1]._id == id
          );
        }
        if (userExist[0] !== false && userExist[1]._id != id) {
          console.log("The Staff already exists");
          return Promise.reject();
        }
      })
      .withMessage("Another Staff with that email already exists."),
    body("phonenumber", "Please enter your Phone Number ").trim().notEmpty(),
    check("username")
      .custom(async (value, { req }) => {
        const { id } = req.params;
        let userExist = await getStaffByUsername(value);
        console.log("Exists? ", userExist);
        if (userExist[1]._id == id) {
          console.log(
            "Staff's username didn't change. Still the same username for Staff. ",
            userExist[1]._id == id
          );
        }
        if (userExist[0] !== false && userExist[1]._id != id) {
          console.log("The Staff already exists");
          return Promise.reject();
        }
      })
      .withMessage("Another Staff with that username already exists."),

    body("firstname", "First Name is required")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),
    body("lastname", "Last Name is required")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),
    body("username", "Enter User Username")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),
    body("email", "Email is required").notEmpty(),
    body("email")
      .isEmail()
      .withMessage("Email must be valid containing @ and a domain (e.g .com) ")
      .isLength({ min: 10 }),
  ];
};
const updatePatientValidator = () => {
  return [
    //Check that email isn't taken
    check("email")
      .custom(async (value, { req }) => {
        const { id } = req.params;
        let userExist = await getPatientByEmail(value);
        console.log("Exists? ", userExist);
        if (userExist[1]._id == id) {
          console.log(
            "Patient's email didn't change. Still the same email for Patient. ",
            userExist[1]._id == id
          );
        }
        if (userExist[0] !== false && userExist[1]._id != id) {
          console.log("The Patient already exists");
          return Promise.reject();
        }
      })
      .withMessage("Another Patient with that email already exists."),
    body("phonenumber", "Please enter your Phone Number ").trim().notEmpty(),
    body("age", "Please enter your Age").trim().notEmpty(),
    body("occupation", "Please enter your occupation ").trim().notEmpty(),
    body("spouseName", "Please enter your spouseName ").trim().notEmpty(),
    body("spousePhone", "Please enter your spousePhone ").trim().notEmpty(),
    body("emergencyContact", "Please enter your emergencyContact")
      .trim()
      .notEmpty(),
    body("address", "Please enter your address").trim().notEmpty(),
    check("username")
      .custom(async (value, { req }) => {
        const { id } = req.params;
        let userExist = await getPatientByUsername(value);
        console.log("Exists? ", userExist);
        if (userExist[1]._id == id) {
          console.log(
            "Patient's username didn't change. Still the same username for Patient. ",
            userExist[1]._id == id
          );
        }
        if (userExist[0] !== false && userExist[1]._id != id) {
          console.log("The Patient already exists");
          return Promise.reject();
        }
      })
      .withMessage("Another Patient with that username already exists."),

    body("firstname", "First Name is required")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),
    body("lastname", "Last Name is required")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),
    body("username", "Enter User Username")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),
    body("email", "Email is required").notEmpty(),
    body("email")
      .isEmail()
      .withMessage("Email must be valid containing @ and a domain (e.g .com) ")
      .isLength({ min: 10 }),
  ];
};

const loginValidator = (req, res, next) => {
  const { username, password } = req.body;
  if (!(username && password)) {
    return res
      .status(400)
      .json({ error: "Please Login with valid email and password" });
  } else {
    console.log("Details from Login form", req.body);
    next();
  }
};

const updatePatientPasswordValidator = () => {
  return [
    body("currentPassword", "Please enter current password").trim().notEmpty(),
    //Check that current Password is correct
    check("currentPassword")
      .custom(async (value, { req }) => {
        const { id } = req.params;
        const user = await getPatientById(id);
        //An error of Incorrect Password would always be shown to the user if the getAdminById method returns false
        const { username } = user[1];

        let check = await authenticatePatient(username, value);
        console.log("Check ", check);

        if (check[0] == false) {
          console.log("Current password is incorrect");
          return Promise.reject();
        }
      })
      .withMessage("Current Password is incorrect"),
    body("newPassword", "New password can not be empty").trim().notEmpty(),
    body("confirmNewPassword", "Please confirm new password").trim().notEmpty(),
    check("confirmNewPassword")
      .custom((value, { req }) => {
        console.log("FROM Validator req body", req.body);
        const { newPassword } = req.body;

        if (value === newPassword) {
          console.log(
            "Passwords are the same.. Validation passed",
            value === newPassword
          );
          return true;
        } else {
          console.log(
            "Passwords must be the same.. Validation test failed",
            value === newPassword
          );
          return false;
          // return Promise.reject()    //return false or return Promise.reject() would both work since this isn't an async function
        }
      })
      .withMessage("Passwords must match!!"),
    check("confirmNewPassword")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
      .withMessage(
        "Password must be atleast 8 characters long and a combination of at least one upper and lower case letter and one number."
      ),
  ];
};

const updateStaffPasswordValidator = () => {
  return [
    body("currentPassword", "Please enter current password").trim().notEmpty(),
    //Check that current Password is correct
    check("currentPassword")
      .custom(async (value, { req }) => {
        const { id } = req.params;
        const user = await getStaffById(id);
        //An error of Incorrect Password would always be shown to the user if the getAdminById method returns false
        const { username } = user[1];

        let check = await authenticateStaff(username, value);
        console.log("Check ", check);

        if (check[0] == false) {
          console.log("Current password is incorrect");
          return Promise.reject();
        }
      })
      .withMessage("Current Password is incorrect"),
    body("newPassword", "New password can not be empty").trim().notEmpty(),
    body("confirmNewPassword", "Please confirm new password").trim().notEmpty(),
    check("confirmNewPassword")
      .custom((value, { req }) => {
        console.log("FROM Validator req body", req.body);
        const { newPassword } = req.body;

        if (value === newPassword) {
          console.log(
            "Passwords are the same.. Validation passed",
            value === newPassword
          );
          return true;
        } else {
          console.log(
            "Passwords must be the same.. Validation test failed",
            value === newPassword
          );
          return false;
          // return Promise.reject()    //return false or return Promise.reject() would both work since this isn't an async function
        }
      })
      .withMessage("Passwords must match!!"),
    check("confirmNewPassword")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
      .withMessage(
        "Password must be atleast 8 characters long and a combination of at least one upper and lower case letter and one number."
      ),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  // errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
  errors.array().map((err) => extractedErrors.push(err.msg));

  return res.status(400).json({
    errors: extractedErrors,
  });
};

module.exports = {
  patientSignupValidator,
  staffSignupValidator,
  validate,
  loginValidator,

  updatePatientPasswordValidator,
  updateStaffPasswordValidator,
  updatePatientValidator,
  updateStaffValidator,
};
