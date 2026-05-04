import React from "react";
import { Link } from "react-router-dom";
import logo from '../../assets/logo.jpg';
import './Header.css';
import { UserData } from "../../context/UserContext";

const Header = ({ isAuth }) => {
  const { user } = UserData();
  const isAdmin = user && user.role === "admin";

  return (
    <header className="hdr-main">
      <div className="hdr-container">
        {/* Logo and Brand Name */}
        <Link to="/" className="hdr-logo-link">
          <img src={logo} alt="Samarpan Math Academy Logo" className="hdr-logo-img" />
          <span className="hdr-brand-name">Samarpan Math Academy</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hdr-nav">
          <Link to="/" className="hdr-link">Home</Link>
          <Link to="/about" className="hdr-link">About</Link>
          
          {/* Hide Courses and AI Tools from Admin, show them to users/guests */}
          {!isAdmin && (
            <>
              <Link to="/courses" className="hdr-link">Courses</Link>
              <Link to="/ai-tools" className="hdr-link">
                AI Tools
                <span className="hdr-ai-badge">✨ New</span>
              </Link>
            </>
          )}

          {isAuth ? (
            <>
              {isAdmin && (
                <Link to="/admin/dashboard" className="hdr-link">Admin Panel</Link>
              )}
              <Link to="/account" className="hdr-link">Account</Link>
            </>
          ) : (
            <Link to="/login" className="hdr-btn-login">Login</Link>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="hdr-mobile-btn">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;
