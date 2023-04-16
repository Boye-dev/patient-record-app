import {
  Box,
  Button,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const Faq = () => {
  return (
    <Box sx={{ ml: { xs: "0", md: "240px" }, mt: 10 }}>
      <Box sx={{ pl: { xs: 3, md: 10 }, pr: { xs: 3, md: 10 }, mb: 5 }}>
        <TextField fullWidth />
        <Typography
          sx={{
            color: "rgb(0,66,130)",
            fontWeight: "700",
            fontSize: "30px",
            mt: 2,
          }}
        >
          FAQ
        </Typography>
      </Box>
    </Box>
  );
};

export default Faq;
