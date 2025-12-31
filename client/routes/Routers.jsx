import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "../src/pages/HomePage";
import LoginPage from "../src/pages/LoginPage";
import RegisterPage from "../src/pages/RegisterPage";
import EventsPage from "../src/pages/EventsPage";
import EventDetails from "../src/pages/EventDetails";
import AdminHome from "../src/pages/AdminHome";
import CreateEvent from "../src/pages/CreateEvent";
import ProtectedRoute from "../src/components/ProtectedRoute";

const Routers = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetails />} />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminHome />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-event" 
          element={
            <ProtectedRoute adminOnly={true}>
              <CreateEvent />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default Routers;
