import { Box, Button, LinearProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import api from "../../api/api";

const Patients = () => {
  const columns = [
    {
      field: "username",
      headerName: "Patient ID",
      width: 110,
    },
    {
      field: "firstname",
      headerName: "Firstname",
      width: 150,
    },
    {
      field: "lastname",
      headerName: "Lastname",
      width: 120,
    },
    {
      field: "phonenumber",
      headerName: "Phonenumber",
      width: 120,
    },
    {
      field: "occupation",
      headerName: "Occupation",
      width: 120,
    },
    {
      field: "email",
      headerName: "Email",
      width: 150,
    },
    {
      field: "view",
      headerName: "View Details",
      width: 150,
      renderCell: (cellValues) => (
        <Link to={`${cellValues.row._id}`} style={{ textDecoration: "none" }}>
          <Button sx={{}} variant="contained" color="primary">
            View Details
          </Button>
        </Link>
      ),
    },
  ];
  const [isLoading, setLoading] = useState(true);
  const [exeats, setExeats] = useState();
  const rows = exeats;
  const fetchApplications = async () => {
    try {
      const response = await api.get("/api/patients");
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
  }, []);

  return (
    <Box sx={{ ml: { xs: "0", md: "240px" }, mt: 10 }}>
      <Box sx={{ pl: { xs: 3, md: 10 }, pr: { xs: 3, md: 10 }, mb: 5 }}>
        <Typography
          sx={{ color: "rgb(0,66,130)", fontWeight: "700", fontSize: "30px" }}
        >
          Patients
        </Typography>
        {isLoading ? (
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <LinearProgress color="primary" />
          </Box>
        ) : exeats.length === 0 ? (
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Typography>No Patient Available </Typography>
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

export default Patients;
