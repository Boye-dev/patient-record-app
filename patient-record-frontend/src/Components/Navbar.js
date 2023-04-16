import { Box, Typography, IconButton } from "@mui/material";
import React from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import AuthService from "../auth_service";

const Navbar = ({ setMobileOpen, mobileOpen }) => {
  const navigate = useNavigate();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const { logout } = AuthService;

  return (
    <>
      <Box sx={{ position: "sticky", top: "0", zIndex: "200" }}>
        <Box
          sx={{
            // width: { md: `calc(100% - ${240}px)` },
            // ml: { md: `${240}px` },

            height: "80px",
            zIndex: "200",
            backgroundColor: "rgb(0,66,130)",
            display: "flex",
            justifyContent: { xs: "space-between", md: "flex-end" },
            alignItems: "center",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ ml: 5, display: { md: "none" }, color: "white" }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            onClick={() => {
              logout();
              navigate("/login");
            }}
            sx={{
              mr: 5,

              color: "white",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <LogoutIcon sx={{ color: "white" }} />
            <Typography sx={{ fontWeight: "600" }}>Logout</Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Navbar;
