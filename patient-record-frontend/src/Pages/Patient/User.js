import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import NotFound from "../NotFound";
import BookAppointment from "./BookAppointment";
import Faq from "./Faq";
import MyAppointments from "./MyAppointments";
import Profile from "./Profile";

const User = () => {
  return (
    <>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Navigate to="my-appointments" replace />} />
        {/* <Route exact path="faq" element={<Faq />} /> */}
        <Route exact path="book-appointment" element={<BookAppointment />} />
        <Route exact path="my-appointments" element={<MyAppointments />} />
        <Route exact path="profile" element={<Profile />} />
        <Route exact path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default User;
