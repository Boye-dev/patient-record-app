import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SidebarAdmin from "../../Components/SidebarAdmin";
import NotFound from "../NotFound";
import Appointments from "./Appointments";

import Patients from "./Patients";
import Profile from "./Profile";
import RegisterPatient from "./RegisterPatient";
import SingleExeat from "./SingleExeat";
const Admin = () => {
  return (
    <>
      <SidebarAdmin />
      <Routes>
        <Route path="/" element={<Navigate to="patients" replace />} />
        <Route exact path="patients" element={<Patients />} />
        <Route exact path="appointments" element={<Appointments />} />
        <Route exact path="register-patient" element={<RegisterPatient />} />
        <Route exact path="profile" element={<Profile />} />
        <Route exact path="patients/:id" element={<SingleExeat />} />

        <Route exact path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default Admin;
