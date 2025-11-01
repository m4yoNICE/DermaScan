import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLoginPage from "../src/adminLoginPage.jsx";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}