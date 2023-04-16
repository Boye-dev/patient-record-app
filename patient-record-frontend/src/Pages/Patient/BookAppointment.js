import { Box, TextField, Typography } from "@mui/material";
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

const BookAppointment = () => {
  const { setSnackMessage, setIsSnackOpen } = useContext(ExeatContext);
  const { getCurrentAdmin } = AuthService;
  const navigate = useNavigate();
  const schema = yup.object().shape({
    doctorName: yup.string().required("Host Is Required"),
    appointmentNotes: yup.string(),
    appointmentEndTime: yup.string().required("End Time IsRequired"),
    appointmentStartTime: yup.string().required("Start Time Is Required"),
    appointmentDate: yup.date().required("Appointment Date Is Required"),
  });
  const { handleSubmit, trigger, control } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const onSubmit = async (data) => {
    const date = new Date(data.appointmentDate);

    data = {
      ...data,
      appointmentDate: `${date.getFullYear()}-${
        date.getMonth().toString().length === 1
          ? `0${date.getMonth() + 1}`
          : date.getMonth() + 1
      }-${
        date.getDate().toString().length === 1
          ? `0${date.getDate() + 1}`
          : date.getDate() + 1
      }`,
      patientId: getCurrentAdmin()._id,
    };
    console.log(data);
    setLoading(true);
    try {
      setLoading(true);

      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };
      const body = data;

      const res = await api.post("/api/appointments", body, config);
      if (res.data) {
        navigate("/patient/my-appointments");
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
      <Box sx={{ pl: { xs: 3, md: 5 }, pr: { xs: 3, md: 5 }, mb: 5 }}>
        <Typography
          sx={{
            color: "rgb(0,66,130)",
            fontWeight: "700",
            fontSize: "30px",
            pb: 5,
          }}
        >
          Schedule An Appointment
        </Typography>
        <Box sx={{ pl: { xs: 0, md: 10 }, pr: { xs: 0, md: 10 } }}>
          <Grid2 container>
            <Grid2 item xs={12} md={6}>
              <Controller
                name="doctorName"
                control={control}
                defaultValue=""
                render={({
                  field: { ref, ...fields },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    sx={{ mb: 4 }}
                    label="Doctor Name"
                    fullWidth
                    {...fields}
                    inputRef={ref}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    onKeyUp={() => {
                      trigger("doctorName");
                    }}
                  />
                )}
              />
            </Grid2>
            <Grid2 item xs={12} md={6} sx={{ pl: { xs: 0, md: 5 } }}>
              <Controller
                name="appointmentDate"
                control={control}
                defaultValue=""
                render={({
                  field: { ref, ...fields },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    sx={{ mb: 4 }}
                    label="Appointment Date"
                    fullWidth
                    type="date"
                    {...fields}
                    inputRef={ref}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    onKeyUp={() => {
                      trigger("appointmentDate");
                    }}
                  />
                )}
              />
            </Grid2>{" "}
            <Grid2 item xs={12} md={6}>
              <Controller
                name="appointmentStartTime"
                control={control}
                defaultValue=""
                render={({
                  field: { ref, ...fields },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    sx={{ mb: 4 }}
                    label="Start Time"
                    fullWidth
                    {...fields}
                    inputRef={ref}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    onKeyUp={() => {
                      trigger("appointmentStartTime");
                    }}
                  />
                )}
              />
            </Grid2>{" "}
            <Grid2 item xs={12} md={6} sx={{ pl: { xs: 0, md: 5 } }}>
              <Controller
                name="appointmentEndTime"
                control={control}
                defaultValue=""
                render={({
                  field: { ref, ...fields },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    sx={{ mb: 4 }}
                    label="End Time"
                    fullWidth
                    {...fields}
                    inputRef={ref}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    onKeyUp={() => {
                      trigger("appointmentEndTime");
                    }}
                  />
                )}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <Controller
                name="appointmentNotes"
                control={control}
                defaultValue=""
                render={({
                  field: { ref, ...fields },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    sx={{ mb: 4 }}
                    label="Appointment Notes"
                    fullWidth
                    {...fields}
                    inputRef={ref}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                    onKeyUp={() => {
                      trigger("appointmentNotes");
                    }}
                  />
                )}
              />
            </Grid2>
          </Grid2>
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
              <span>Submit</span>
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BookAppointment;
