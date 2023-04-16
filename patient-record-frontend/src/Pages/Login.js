import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import { IconButton, TextField, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import logo from "../Assets/babcok.jpeg";
import { useNavigate, Navigate } from "react-router-dom";

import AuthService from "../auth_service";

import api from "../api/api";
import ExeatContext from "../ExeatContext";
const Login = () => {
  const { setSnackMessage, setIsSnackOpen } = useContext(ExeatContext);

  const navigate = useNavigate();
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const schema = yup.object().shape({
    username: yup.string().required("User Number Is Required"),
    password: yup.string().required("Password Is Required"),
  });
  const { setWithExpiry, getCurrentAdmin } = AuthService;
  const { handleSubmit, trigger, control } = useForm({
    resolver: yupResolver(schema),
  });
  const handleShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      setLoading(true);

      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };
      const body = data;

      const res = await api.post("/api/patient-login", body, config);

      const adminData = res.data.patient;
      setWithExpiry("user", adminData);
      if (adminData.role === "Patient") {
        navigate("/patient/my-appointments");
      }
    } catch (err) {
      if (!err.response) {
        setLoading(false);

        setSnackMessage("Server Is Not Responding");
        setIsSnackOpen(true);
      } else if (err.response) {
        setSnackMessage(err.response.data.error);
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
    <>
      {getCurrentAdmin() ? (
        getCurrentAdmin()?.role === "Patient" ? (
          <>
            <Navigate to="/patient" replace={true} />
          </>
        ) : (
          <>
            <Navigate to="/staff" replace={true} />
          </>
        )
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",

            height: "100vh",
            pl: 3,
            pr: 3,
          }}
        >
          <img src={logo} alt="logo" style={{ marginBottom: "40px" }} />
          <Box
            sx={{
              width: {
                xs: "100%",
                md: "40%",
              },
              backgroundColor: "white",
              boxShadow: "1px 1px 15px 2px rgba(148, 147, 147, 0.404)",
              borderRadius: "8px",
            }}
          >
            <Box sx={{ p: 4 }}>
              <Typography
                sx={{
                  color: "darkblue",
                  fontWeight: "700",
                  fontSize: "50px",
                  mb: 3,
                  textAlign: "center",
                }}
              >
                Login
              </Typography>
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
                    label="User Number"
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
              />{" "}
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({
                  field: { ref, ...fields },
                  fieldState: { error },
                }) => (
                  <TextField
                    id="password"
                    label="Password"
                    sx={{ mb: 4 }}
                    type={values.showPassword ? "text" : "password"}
                    {...fields}
                    inputRef={ref}
                    fullWidth
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    onKeyUp={() => {
                      trigger("password");
                    }}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={handleShowPassword}>
                          {values.showPassword === true ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      ),
                    }}
                  />
                )}
              />
              <Box sx={{ textAlign: "center" }}>
                <LoadingButton
                  sx={{
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
                  <span>Login</span>
                </LoadingButton>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Login;
