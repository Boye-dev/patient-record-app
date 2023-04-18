import LoadingButton from "@mui/lab/LoadingButton";
import { Box, LinearProgress, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import ExeatContext from "../../ExeatContext";

const SingleExeat = () => {
  const { id } = useParams();
  const { setSnackMessage, setIsSnackOpen } = useContext(ExeatContext);

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isloading, setisLoading] = useState(false);
  const handleApprove = async () => {
    setisLoading(true);
    try {
      await api.put(`/api/exeats/${id}/status`, {
        status: "Approved",
      });
      setisLoading(false);

      setIsSnackOpen(true);
      setSnackMessage("Exeat Approved Successfully");
      navigate("/admin/");
    } catch (error) {
      if (error.response) {
        setisLoading(false);
      } else {
      }
    }
  };
  const handleDecline = async () => {
    setisLoading(true);
    try {
      await api.put(`/api/exeats/${id}/status`, {
        status: "Denied",
      });
      setisLoading(false);

      setIsSnackOpen(true);
      setSnackMessage("Exeat Denied Successfully");
      navigate("/admin/");
    } catch (error) {
      if (error.response) {
        setisLoading(false);
      } else {
      }
    }
  };
  const handlePend = async () => {
    setisLoading(true);
    try {
      await api.put(`/api/exeats/${id}/status`, {
        status: "Pending",
      });
      setisLoading(false);

      setIsSnackOpen(true);
      setSnackMessage("Exeat Pend Successfully");
      navigate("/admin/");
    } catch (error) {
      if (error.response) {
        setisLoading(false);
      } else {
      }
    }
  };
  useEffect(() => {
    const fetchTalent = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/patients/${id}`);
        if (response && response.data) setLoading(false);
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        if (error.response) {
          setLoading(false);
        } else {
        }
      }
    };
    fetchTalent();
  }, [id]);
  return (
    <Box sx={{ ml: { xs: "0", md: "240px" }, mt: 10 }}>
      <Box sx={{ pl: { xs: 3, md: 10 }, pr: { xs: 3, md: 10 } }}>
        <Typography
          sx={{ color: "rgb(0,66,130)", fontWeight: "700", fontSize: "30px" }}
        >
          Patient Details
        </Typography>
        {loading ? (
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <LinearProgress color="primary" />
          </Box>
        ) : (
          <Box sx={{ height: 480, width: "100%", mt: 5, mb: 5 }}>
            <Typography sx={{ fontWeight: "400", fontSize: "20px", pb: 1 }}>
              Full Name - {data?.lastname} {data?.firstname}
            </Typography>
            <Typography sx={{ fontWeight: "400", fontSize: "20px", pb: 1 }}>
              Username - {data?.username}
            </Typography>
            <Typography sx={{ fontWeight: "400", fontSize: "20px", pb: 1 }}>
              Age - {data.age}
            </Typography>{" "}
            <Typography sx={{ fontWeight: "400", fontSize: "20px", pb: 1 }}>
              Phone Number - {data.phonenumber}
            </Typography>
            <Typography sx={{ fontWeight: "400", fontSize: "20px", pb: 1 }}>
              Address - {data.address}
            </Typography>
            <Typography sx={{ fontWeight: "400", fontSize: "20px", pb: 1 }}>
              Email - {data.email}
            </Typography>
            <Typography sx={{ fontWeight: "400", fontSize: "20px", pb: 1 }}>
              Address - {data.address}
            </Typography>
            <Typography sx={{ fontWeight: "400", fontSize: "20px", pb: 1 }}>
              Spouse Name - {data.spouseName}
            </Typography>
            <Typography sx={{ fontWeight: "400", fontSize: "20px", pb: 1 }}>
              Spouse Phone Number - {data.spousePhone}
            </Typography>
            <Typography sx={{ fontWeight: "400", fontSize: "20px", pb: 1 }}>
              Emergency Contact- {data.emergencyContact}
            </Typography>
            <Typography sx={{ fontWeight: "400", fontSize: "20px", pb: 1 }}>
              Occupation - {data.occupation}
            </Typography>
            <img src={data.profilePhoto} width="200px" height="200px" />
            {data.status === "Pending" && (
              <>
                <Box mt={5} sx={{}}>
                  <LoadingButton
                    variant="contained"
                    color="success"
                    loading={isloading}
                    onClick={handleApprove}
                  >
                    Approve
                  </LoadingButton>
                  <LoadingButton
                    variant="contained"
                    loading={isloading}
                    onClick={handleDecline}
                    color="error"
                    sx={{ ml: 5 }}
                  >
                    Decline
                  </LoadingButton>
                </Box>
              </>
            )}
            {data.status === "Approved" && (
              <>
                <Box mt={5} sx={{}}>
                  <LoadingButton
                    loading={isloading}
                    onClick={handlePend}
                    variant="contained"
                    color="secondary"
                  >
                    Pend
                  </LoadingButton>
                  <LoadingButton
                    variant="contained"
                    loading={isloading}
                    onClick={handleDecline}
                    color="error"
                    sx={{ ml: 5 }}
                  >
                    Decline
                  </LoadingButton>
                </Box>
              </>
            )}
            {data.status === "Denied" && (
              <>
                <Box mt={5} sx={{}}>
                  <LoadingButton
                    variant="contained"
                    color="success"
                    loading={isloading}
                    onClick={handleApprove}
                  >
                    Approve
                  </LoadingButton>
                  <LoadingButton
                    loading={isloading}
                    onClick={handlePend}
                    variant="contained"
                    color="secondary"
                    sx={{ ml: 5 }}
                  >
                    Pend
                  </LoadingButton>
                </Box>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SingleExeat;
