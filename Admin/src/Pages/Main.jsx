import React from "react";
import Header from "../components/layouts/Header";
import Sidebar from "../components/layouts/Sidebar";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar on the left */}
      <Sidebar />
      
      {/* Main content area with header and content */}
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-6 bg-[#EFF6F8]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Main;