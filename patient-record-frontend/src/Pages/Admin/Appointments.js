import {
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import api from "../../api/api";
import AuthService from "../../auth_service";

const Appointments = () => {
  const [loading, setIsLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const changeStatus = async (id) => {
    setIsLoading(true);
    try {
      const response = await api.put(`/api/appointments/${id}/cancel`);
      if (response && response.data) {
        setIsLoading(false);
        setLoading(true);
        setRefetch(!refetch);
      }
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        setIsLoading(false);
      } else {
      }
    }
  };
  const columns = [
    {
      field: "username",
      headerName: "Patient ID",
      width: 110,
      renderCell: (cellValues) => (
        <Typography sx={{}}>{cellValues.row.patientId.username}</Typography>
      ),
    },
    {
      field: "doctorName",
      headerName: "Doctor Name",
      width: 110,
    },
    {
      field: "appointmentDate",
      headerName: "Appointment Date",
      width: 150,
    },
    {
      field: "appointmentStartTime",
      headerName: "Start Time",
      width: 120,
    },
    {
      field: "appointmentEndTime",
      headerName: "End Time",
      width: 120,
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      renderCell: (cellValues) => (
        <Typography
          sx={{
            backgroundColor:
              cellValues.row.status === "cancelled" ? "red" : "green",
            borderRadius: "5px",
            p: 1,
            color: "white",
            fontSize: "12px",
          }}
        >
          {cellValues.row.status}
        </Typography>
      ),
    },
    {
      field: "appointmentNotes",
      headerName: "Appointment Notes",
      width: 300,
    },
    {
      field: "view",
      headerName: "Change Status",
      width: 150,
      renderCell: (cellValues) => (
        <Button
          sx={{}}
          variant="contained"
          color="primary"
          disabled={cellValues.row.status !== "confirmed"}
          onClick={() => changeStatus(cellValues.row._id)}
          startIcon={loading && <CircularProgress size={15} />}
        >
          Change Status
        </Button>
      ),
    },
  ];
  const [isLoading, setLoading] = useState(true);
  const [exeats, setExeats] = useState();
  const rows = exeats;
  const { getCurrentAdmin } = AuthService;
  const fetchApplications = async () => {
    try {
      const response = await api.get(`/api/appointments`);
      console.log(response);
      if (response) setExeats(response.data);

      setLoading(false);
    } catch (error) {
      if (error.response) {
        //Not in 200 response range
        // console.log(error.response.data);
      } else {
        // console.log(error.message);
      }
    }
  };
  useEffect(() => {
    fetchApplications();
  }, [refetch]);

  return (
    <Box sx={{ ml: { xs: "0", md: "240px" }, mt: 10 }}>
      <Box sx={{ pl: { xs: 3, md: 10 }, pr: { xs: 3, md: 10 }, mb: 5 }}>
        <Typography
          sx={{ color: "rgb(0,66,130)", fontWeight: "700", fontSize: "30px" }}
        >
          Appointments
        </Typography>
        {isLoading ? (
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <LinearProgress color="primary" />
          </Box>
        ) : exeats.length === 0 ? (
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Typography>No Appointments Available </Typography>
          </Box>
        ) : (
          <Box sx={{ height: 480, width: "100%", mt: 5 }}>
            <DataGrid
              getRowId={(row) => row._id}
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Appointments;
