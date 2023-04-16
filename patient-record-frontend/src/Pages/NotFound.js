import { Typography } from "@mui/material";
import React from "react";

const NotFound = () => {
  return (
    <div>
      <Typography
        sx={{
          fontWeight: "900",
          fontSize: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Not Found
      </Typography>
    </div>
  );
};

export default NotFound;
