import { Box, IconButton, TextField, Typography } from "@mui/material";
import React, { useContext, useState } from "react";

import api from "../../api/api";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import ExeatContext from "../../ExeatContext";
import AuthService from "../../auth_service";
import { Edit, Visibility, VisibilityOff } from "@mui/icons-material";

const RegisterPatient = () => {
  const { setSnackMessage, setIsSnackOpen } = useContext(ExeatContext);
  const [state, setState] = useState({
    values2: false,
    values3: false,
  });
  const [img1, setImage1] = useState();
  const [picture, setImageFile1] = useState([]);
  const [err1, setErr1] = useState();
  const [er1, setEr1] = useState(true);
  const { getCurrentAdmin } = AuthService;
  const navigate = useNavigate();
  const schema = yup.object().shape({
    firstname: yup.string().required("Firstname Is Required"),
    lastname: yup.string().required("Lastname Is Required"),
    email: yup.string().required("Email Is Required"),
    username: yup.string().required("Patient Id Is Required"),
    phonenumber: yup.string().required("Phonenumber Is Required"),
    occupation: yup.string().required("Occupation Is Required"),
    age: yup.string().required("Age Is Required"),
    spouseName: yup.string().required("Spouse Name Is Required"),
    spousePhone: yup.string().required("Spouse Phone Is Required"),
    emergencyContact: yup
      .string()
      .required("Emergency Contact Number Is Required"),
    address: yup.string().required("Address Is Required"),
    password: yup
      .string()
      .required("Password Is Required")
      .matches(
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
        "Password Must Contain An Uppercase, A Digit, and A Special Character"
      )
      .min(8, "Password Should Have At Least 8 Characters")
      .max(32, "Password Should Have At Most 32 Characters"),
    confirmPassword: yup
      .string()
      .required("Confirm Password Is Required")
      .oneOf(
        [yup.ref("password"), null],
        "Confirm Password Must Match Password"
      ),
  });
  const onImageChange1 = (e) => {
    const [file] = e.target.files;
    const imageFile = e.target.files[0];

    if (!imageFile) {
      setErr1("Please select image.");
      setEr1(true);
      return false;
    }

    if (!imageFile.name.match(/\.(jpg|jpeg|png|gif|jfif|heif|hevc)$/)) {
      setErr1("Please select valid image.");
      setEr1(true);
      return false;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImageFile1(imageFile);
        setErr1(null);
        setEr1(false);
      };
      img.onerror = () => {
        setErr1("Invalid image content.");
        setEr1(false);
        return false;
      };

      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);

    setImage1(URL.createObjectURL(file));
  };

  const { handleSubmit, trigger, control, getValues } = useForm({
    resolver: yupResolver(schema),
  });
  const handleShowNewPassword = () => {
    setState({ ...state, values2: !state.values2 });
  };
  const handleShowConfirmNewPassword = () => {
    setState({ ...state, values3: !state.values3 });
  };
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data) => {
    let formData = new FormData();
    data = { ...data, picture };
    console.log(picture);
    formData.append("firstname", data.firstname);
    formData.append("lastname", data.lastname);
    formData.append("email", data.email);
    formData.append("phonenumber", data.phonenumber);
    formData.append("username", data.username);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("profilePhoto", picture);
    formData.append("occupation", data.occupation);
    formData.append("age", data.age);
    formData.append("spouseName", data.spouseName);
    formData.append("spousePhone", data.spousePhone);
    formData.append("emergencyContact", data.emergencyContact);
    formData.append("address", data.address);
    setLoading(true);
    try {
      setLoading(true);

      const body = formData;

      const res = await api.post("/api/patient-signup", body);
      if (res.data) {
        navigate("/staff/patients");
      }
    } catch (err) {
      if (!err.response) {
        setLoading(false);

        setSnackMessage("Server Is Not Responding");
        setIsSnackOpen(true);
      } else if (err.response) {
        setSnackMessage(err.response.data.actualError);
        setIsSnackOpen(true);

        setLoading(false);
      } else if (err.request) {
        setSnackMessage(err.request);
        setIsSnackOpen(true);
        setLoading(false);
      } else {
        setSnackMessage(err.message);
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{ ml: { xs: "0", md: "240px" }, mt: 10 }}>
      <Box sx={{ pl: { xs: 3, md: 10 }, pr: { xs: 3, md: 10 }, mb: 5 }}>
        <Typography
          sx={{
            color: "rgb(0,66,130)",
            fontWeight: "700",
            fontSize: "30px",
            pb: 5,
          }}
        >
          Register Patient
        </Typography>
        <Box sx={{ pl: { xs: 0, md: 5 }, pr: { xs: 0, md: 5 } }}>
          <Grid2 container>
            <Grid2 item xs={12} md={6}>
              <Controller
                name="firstname"
                control={control}
                defaultValue=""
                render={({
                  field: { ref, ...fields },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    sx={{ mb: 4 }}
                    label="Firstname"
                    fullWidth
                    {...fields}
                    inputRef={ref}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    onKeyUp={() => {
                      trigger("firstname");
                    }}
                  />
                )}
              />
            </Grid2>
            <Grid2 item xs={12} md={6} sx={{ pl: { xs: 0, md: 5 } }}>
              <Controller
                name="lastname"
                control={control}
                defaultValue=""
                render={({
                  field: { ref, ...fields },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    sx={{ mb: 4 }}
                    label="Lastname"
                    fullWidth
                    {...fields}
                    inputRef={ref}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    onKeyUp={() => {
                      trigger("lastname");
                    }}
                  />
                )}
              />
            </Grid2>{" "}
            <Grid2 item xs={12} md={6}>
              <Controller
                name="username"
                control={control}
                defaultValue=""
                render={({
                  field: { ref, ...fields },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    sx={{ mb: 4 }}
                    label="Patient ID"
                    fullWidth
                    {...fields}
                    inputRef={ref}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    onKeyUp={() => {
                      trigger("username");
                    }}
                  />
                )}
              />
            </Grid2>{" "}
            <Grid2 item xs={12} md={6} sx={{ pl: { xs: 0, md: 5 } }}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({
                  field: { ref, ...fields },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    sx={{ mb: 4 }}
                    label="Email"
                    fullWidth
                    {...fields}
                    inputRef={ref}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    onKeyUp={() => {
                      trigger("email");
                    }}
                  />
                )}
              />
            </Grid2>
            <Grid2 item xs={12} md={6}>
              <Controller
                name="phonenumber"
                control={control}
                defaultValue=""
                render={({
                  field: { ref, ...fields },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    sx={{ mb: 4 }}
                    label="Phone Number"
                    fullWidth
                    {...fields}
                    inputRef={ref}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    onKeyUp={() => {
                      trigger("phonenumber");
                    }}
                  />
                )}
              />
            </Grid2>
            <Grid2 item xs={12} md={6} sx={{ pl: { xs: 0, md: 5 } }}>
              <Controller
                name="occupation"
                control={control}
                defaultValue=""
                render={({
                  field: { ref, ...fields },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    sx={{ mb: 4 }}
                    label="Occupation"
                    fullWidth
                    {...fields}
                    inputRef={ref}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    onKeyUp={() => {
                      trigger("occupation");
                    }}
                  />
                )}
              />
            </Grid2>{" "}
            <Grid2 item xs={12} md={6}>
              <Controller
                name="age"
                control={control}
                defaultValue=""
                render={({
                  field: { ref, ...fields },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    sx={{ mb: 4 }}
                    label="Age"
                    fullWidth
                    {...fields}
                    inputRef={ref}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    onKeyUp={() => {
                      trigger("age");
                    }}
                  />
                )}
              />
            </Grid2>
            <Grid2 item xs={12} md={6} sx={{ pl: { xs: 0, md: 5 } }}>
              <Controller
                name="spouseName"
                control={control}
                defaultValue=""
                render={({
                  field: { ref, ...fields },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    sx={{ mb: 4 }}
                    label="Spouse Name"
                    fullWidth
                    {...fields}
                    inputRef={ref}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    onKeyUp={() => {
                      trigger("spouseName");
                    }}
                  />
                )}
              />
            </Grid2>
            <Grid2 item xs={12} md={6}>
              <Controller
                name="spousePhone"
                control={control}
                defaultValue=""
                render={({
                  field: { ref, ...fields },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    sx={{ mb: 4 }}
                    label="Spouse Phone Number"
                    fullWidth
                    {...fields}
                    inputRef={ref}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    onKeyUp={() => {
                      trigger("spousePhone");
                    }}
                  />
                )}
              />
            </Grid2>
            <Grid2 item xs={12} md={6} sx={{ pl: { xs: 0, md: 5 } }}>
              <Controller
                name="emergencyContact"
                control={control}
                defaultValue=""
                render={({
                  field: { ref, ...fields },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    sx={{ mb: 4 }}
                    label="Emergency Contact Number"
                    fullWidth
                    {...fields}
                    inputRef={ref}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    onKeyUp={() => {
                      trigger("emergencyContact");
                    }}
                  />
                )}
              />
            </Grid2>
            <Grid2 item xs={12} md={6}>
              <Controller
                name="address"
                control={control}
                defaultValue=""
                render={({
                  field: { ref, ...fields },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    sx={{ mb: 4 }}
                    label="Address"
                    fullWidth
                    {...fields}
                    inputRef={ref}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    onKeyUp={() => {
                      trigger("address");
                    }}
                  />
                )}
              />
            </Grid2>
            <Grid2 item xs={12} md={6} sx={{ pl: { xs: 0, md: 5 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  ml: 1,
                  mr: 2,
                }}
              >
                <Box
                  sx={{
                    borderRadius: "100%",
                    width: "50px",
                    height: "50px",
                    color: "black",
                  }}
                >
                  {img1 && (
                    <img
                      style={{
                        borderRadius: "100%",
                        width: "50px",
                        height: "50px",
                      }}
                      src={img1}
                      alt="profile"
                    />
                  )}
                </Box>
                <Box>
                  <input
                    type="file"
                    id="profilePhoto"
                    style={{ display: "none" }}
                    onChange={onImageChange1}
                  />
                  <label
                    htmlFor={"profilePhoto"}
                    style={{ cursor: "pointer", display: "flex" }}
                  >
                    <Edit sx={{ color: "rgb(0,66,130)" }} />
                    <Typography
                      sx={{
                        fontSize: "20px",
                        fontWeight: "300",
                        color: "rgb(0,66,130)",
                        textAlign: "center",
                      }}
                    >
                      Profile Picture
                    </Typography>
                  </label>
                </Box>
              </Box>
            </Grid2>
            <Grid2 item xs={12} md={6}>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({
                  field: { ref, ...fields },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    sx={{ mt: 4 }}
                    label="Password"
                    fullWidth
                    {...fields}
                    type={state.values2 ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={handleShowNewPassword}>
                          {state.values2 === true ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      ),
                    }}
                    inputRef={ref}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    onKeyUp={() => {
                      trigger("password");
                    }}
                  />
                )}
              />
            </Grid2>
            <Grid2 item xs={12} md={6} sx={{ pl: { xs: 0, md: 5 } }}>
              <Controller
                name="confirmPassword"
                rules={{
                  required: "Confirm Password is required",
                  validate: {
                    checkIsEmpty: (e) =>
                      e === getValues("newPassword") ||
                      "Passwords must be the same",
                  },
                }}
                control={control}
                defaultValue=""
                render={({
                  field: { ref, ...fields },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    sx={{ mt: 4 }}
                    label="ConfirmPassword"
                    fullWidth
                    type={state.values3 ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={handleShowConfirmNewPassword}>
                          {state.values3 === true ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      ),
                    }}
                    {...fields}
                    inputRef={ref}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    onKeyUp={() => {
                      trigger("confirmPassword");
                    }}
                  />
                )}
              />
            </Grid2>
          </Grid2>
          <Box sx={{ textAlign: "center" }}>
            <LoadingButton
              sx={{
                mt: 2,
                mb: 2,
                width: "100%",
                height: "50px",
                backgroundColor: "blue",
              }}
              type="submit"
              variant="contained"
              loading={loading}
              onClick={handleSubmit(onSubmit)}
            >
              <span>Submit</span>
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPatient;
