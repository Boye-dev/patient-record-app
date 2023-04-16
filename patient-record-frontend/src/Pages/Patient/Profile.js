import { ArrowBack, Edit } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Checkbox,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../auth_service";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import * as yup from "yup";
import { useMutation } from "react-query";
import api from "../../api/api";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ExeatContext from "../../ExeatContext";
import UpdatePassword from "../../Components/UpdatePassword";
const Profile = () => {
  const { getCurrentUser, setWithExpiry } = AuthService;
  const navigate = useNavigate();
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [variants, setVariants] = useState([]);
  const [img1, setImage1] = useState(getCurrentUser()?.profilePhoto);
  const [picture, setImageFile1] = useState(null);
  const [err1, setErr1] = useState();
  const [er1, setEr1] = useState(true);
  const { setIsSnackOpen, setSnackMessage, setSnackColor } =
    useContext(ExeatContext);
  const [variantName, setVariantName] = React.useState(null);
  const schema = yup.object().shape({
    email: yup.string().required("Email Is Required"),
    firstname: yup.string().required("Firstname Is Required"),
    lastname: yup.string().required("Lastname Is Required"),
    phonenumber: yup.string().required("Phone Number Is Required"),
    username: yup.string().required("Username Is Required"),
  });
  const { handleSubmit, trigger, control, reset, setValue } = useForm({
    resolver: yupResolver(schema),
  });
  const [loadingArea, setLoadingArea] = useState(false);

  const currentUser = getCurrentUser();

  const loggIn = async ({ data }) => {
    return api
      .put(`/api/editStaff/${getCurrentUser()?._id}`, data)
      .then((res) => res.data);
  };
  const { mutate, isLoading } = useMutation(loggIn, {
    onError: (error) => {
      setSnackColor("red");
      setIsSnackOpen(true);
      setSnackMessage(
        error.response.data.actualError
          ? error.response.data.actualError
          : "Something Went Wrong"
      );
    },
    onSuccess: (data) => {
      setWithExpiry("user", data.Staff);
      setSnackColor("green");
      setIsSnackOpen(true);
      setSnackMessage("Editted Successfully");
    },
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

  const onSubmit = (payload) => {
    let formData = new FormData();

    payload = {
      ...payload,
      picture,
    };

    formData.append("firstname", payload.firstname);
    formData.append("lastname", payload.lastname);
    formData.append("email", payload.email);
    formData.append("phonenumber", payload.phonenumber);
    formData.append("username", payload.username);
    if (picture) {
      formData.append("profilePhoto", payload.picture);
    }

    const data = formData;

    mutate({ data });
  };
  return (
    <>
      <Box sx={{ ml: { xs: "0", md: "240px" }, mt: 10 }}>
        <Box sx={{ pl: { xs: 3, md: 10 }, pr: { xs: 3, md: 10 }, mb: 5 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 5 }}>
            <Typography
              sx={{
                fontSize: "30px",
                fontWeight: "700",
                color: "rgb(0,66,130)",
                pl: 2,
              }}
            >
              Edit Profile
            </Typography>
          </Box>
          <Box
            sx={{
              display: { xs: "block", md: "" },

              width: { xs: "100%" },
            }}
          >
            <Box
              sx={{
                width: {
                  xs: "100%",
                },
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  borderRadius: "100%",
                  width: "250px",
                  height: "250px",
                  color: "black",
                }}
              >
                <img
                  style={{
                    borderRadius: "100%",
                    width: "250px",
                    height: "250px",
                  }}
                  src={img1}
                  alt="profile"
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 5,
                mt: 3,
              }}
            >
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
                  Change Profile Picture
                </Typography>
              </label>
            </Box>
            <Box
              sx={{
                width: { xs: "100%" },
                textAlign: { xs: "center", md: "center" },
                mt: 5,
              }}
            >
              <Controller
                name="firstname"
                control={control}
                defaultValue={getCurrentUser()?.firstname}
                render={({
                  field: { ref, ...fields },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    sx={{ width: { xs: "100%", md: "60%" }, mb: 3 }}
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
              <Controller
                name="lastname"
                control={control}
                defaultValue={getCurrentUser()?.lastname}
                render={({
                  field: { ref, ...fields },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    sx={{ width: { xs: "100%", md: "60%" }, mb: 3 }}
                    label="Lastame"
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
              <Controller
                name="username"
                control={control}
                defaultValue={getCurrentUser()?.username}
                render={({
                  field: { ref, ...fields },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    sx={{ width: { xs: "100%", md: "60%" }, mb: 3 }}
                    label="Username"
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

              <Controller
                name="email"
                control={control}
                defaultValue={getCurrentUser()?.email}
                render={({
                  field: { ref, ...fields },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    sx={{ width: { xs: "100%", md: "60%" }, mb: 3 }}
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
              <Controller
                name="phonenumber"
                control={control}
                defaultValue={getCurrentUser()?.phonenumber}
                render={({
                  field: { ref, ...fields },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    sx={{ width: { xs: "100%", md: "60%" }, mb: 3 }}
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

              <Box sx={{ textAlign: "center" }}>
                <LoadingButton
                  sx={{
                    mb: 4,

                    height: "50px",
                    transition: "opacity 0.3s",
                    ":hover": {
                      bgcolor: "rgb(0,66,130)",
                      color: "white",
                      opacity: "0.8",
                    },
                    opacity: "1",
                    backgroundColor: "rgb(0,66,130)",

                    width: { xs: "100%", md: "60%" },
                  }}
                  type="submit"
                  variant="contained"
                  loading={isLoading}
                  onClick={handleSubmit(onSubmit)}
                >
                  <span>Edit </span>
                </LoadingButton>
              </Box>
              <UpdatePassword />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Profile;
