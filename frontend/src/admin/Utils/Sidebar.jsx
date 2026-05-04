import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AiFillHome, AiOutlineLogout } from "react-icons/ai";
import { FaBook, FaUserAlt, FaPlus } from "react-icons/fa";
import { UserData } from "../../context/UserContext";

const Sidebar = () => {
  const { user } = UserData();
  const location = useLocation();

  const navLinks = [
    { to: "/admin/dashboard", icon: AiFillHome, text: "Dashboard", role: "all" },
    { to: "/admin/course", icon: FaBook, text: "Manage Courses", role: "all" },
    { to: "/admin/course/add", icon: FaPlus, text: "Add Course", role: "all" },
    { to: "/admin/users", icon: FaUserAlt, text: "Manage Users", role: "all" },
  ];

  return (
    <aside className="adm-sidebar">
      {/* Brand */}
      <div className="adm-sidebar-brand">
        Samarpan Admin
      </div>

      {/* Nav Links */}
      <ul className="adm-nav-list">
        {navLinks.map((link, index) => {
          if (link.role === "superadmin" && user && user.mainrole !== "superadmin") {
            return null;
          }
          const isActive = location.pathname === link.to;
          return (
            <li key={index}>
              <Link to={link.to} className={`adm-nav-link ${isActive ? 'active' : ''}`}>
                <link.icon className="adm-nav-icon" />
                {link.text}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Footer / Logout */}
      <div className="adm-sidebar-footer">
        <Link to="/account" className="adm-nav-link logout">
          <AiOutlineLogout className="adm-nav-icon" />
          Logout
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;