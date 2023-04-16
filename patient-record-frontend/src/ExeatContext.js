import { createContext, useEffect, useRef, useState } from "react";
import { Snackbar } from "@mui/material";
import AuthService from "./auth_service";
import { io } from "socket.io-client";

const ExeatContext = createContext();
export const ExeatProvider = ({ children }) => {
  const [isSnackOpen, setIsSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackColor, setSnackColor] = useState();
  const handleClose = () => {
    setIsSnackOpen(false);
  };
  const [convoData, setConvoData] = useState(true);

  const { getCurrentUser } = AuthService;

  const currenUser = getCurrentUser();

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io("ws://localhost:3000");
  }, []);
  useEffect(() => {
    socketRef.current.emit("addUser", currenUser?._id);
    socketRef.current.on("getUsers", (users) => {});
  }, [currenUser]);
  return (
    <ExeatContext.Provider
      value={{
        setIsSnackOpen,
        setSnackMessage,
        socketRef,
        snackColor,
        setSnackColor,
        convoData,
        setConvoData,
      }}
    >
      {isSnackOpen && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={isSnackOpen}
          onClose={handleClose}
          autoHideDuration={3000}
          message={`${snackMessage}`}
          key="topcenter"
          sx={{
            color: "black !important",
            "& .MuiSnackbarContent-root": {
              backgroundColor: `${snackColor ? `${snackColor}` : "darkred"}`,
            },
          }}
        />
      )}
      {children}
    </ExeatContext.Provider>
  );
};

export default ExeatContext;
