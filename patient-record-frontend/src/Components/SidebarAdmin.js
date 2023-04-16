import { Box, Drawer } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import MainDrawerAdmin from "./MainDrawerAdmin";
import Messages from "./Messages";
import { Chat } from "@mui/icons-material";

const drawerWidth = 240;
const SidebarAdmin = (props) => {
  const [openMessages, setOpenMessages] = useState(false);

  const { window } = props;
  const container =
    window !== undefined ? () => window().document.body : undefined;
  //   const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  return (
    <>
      <Navbar setMobileOpen={setMobileOpen} mobileOpen={mobileOpen} />
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },

          flexShrink: { md: 0 },
          backgroundColor: "rgb(0,66,130)",
          zIndex: "1",
        }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              mt: "10",
              backgroundColor: "rgb(0,66,130)",
            },
          }}
        >
          <MainDrawerAdmin
            setMobileOpen={setMobileOpen}
            mobileOpen={mobileOpen}
          />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "rgb(0,66,130)",
            },
          }}
          open
        >
          <MainDrawerAdmin />
        </Drawer>
      </Box>
      <Box
        onClick={() => setOpenMessages(true)}
        sx={{
          position: "fixed",
          cursor: "pointer",
          right: "0",
          top: "50%",
          width: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "50px",
          boxShadow: "0px 2px 10px 2px rgba(128, 128, 128, 0.452)",
          backgroundColor: "rgb(185,141,59)",
          zIndex: "200",
          borderTopLeftRadius: "30%",
          borderBottomLeftRadius: "30%",
        }}
      >
        <Chat sx={{ fontSize: "25px", color: "rgb(0,66,130)" }} />
      </Box>
      <Messages openMessages={openMessages} setOpenMessages={setOpenMessages} />
    </>
  );
};

export default SidebarAdmin;
