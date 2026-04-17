import React from "react";
import TopNavBar from "./components/TopNavBar";
import { Outlet, useLocation } from "react-router-dom";

const UserPage = () => {
  const location = useLocation();
  return (
    <div className="bg-[#f8fafc] h-screen font-sans flex flex-col">
      {/* --- TOP NAVIGATION BAR --- */}
      {location.pathname !== "/" && <TopNavBar />}
      {/* --- MAIN DASHBOARD CONTENT --- */}
      <div className="h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default UserPage;
