import React from "react";
import Sidebar from "./Sidebar";
import "./Admin.css";

const Layout = ({ children }) => {
  return (
    <div className="adm-layout">
      {/* Background decorations for the entire admin area */}
      <div className="adm-bg-glow" />
      <div className="adm-bg-grid" />

      {/* Glassmorphism Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="adm-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;