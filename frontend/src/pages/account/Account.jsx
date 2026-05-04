import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUserCircle, FaEnvelope, FaSignOutAlt, FaTachometerAlt, 
  FaShieldAlt, FaCalendarAlt, FaBookOpen, FaEdit, FaKey 
} from 'react-icons/fa';
import { UserData } from '../../context/UserContext';
import profileImage from '../../assets/user_logo.jpg';
import toast from 'react-hot-toast';
import './account.css';

const Account = ({ user }) => {
  const navigate = useNavigate();
  const { setIsAuth, setUser } = UserData();

  const logoutHandler = () => {
    localStorage.clear();
    setUser([]);
    setIsAuth(false);
    navigate("/login");
  };

  const handleComingSoon = (feature) => {
    toast(`${feature} is coming soon!`, {
      icon: '🚀',
      style: {
        borderRadius: '10px',
        background: '#1a1635',
        color: '#fff',
        border: '1px solid rgba(168, 85, 247, 0.3)',
      },
    });
  };

  if (!user) return null;

  return (
    <div className="ac-page">
      {/* Background decorations */}
      <div className="ac-bg-glow" />
      <div className="ac-bg-grid" />

      <div className="ac-card">
        {/* Banner with animated gradient */}
        <div className="ac-card-banner" />

        {/* Profile Picture with rotating ring */}
        <div className="ac-profile-pic-wrapper">
          <img 
            src={profileImage} 
            alt="User Profile" 
            className="ac-profile-pic"
          />
        </div>

        {/* User Info Header */}
        <div className="ac-user-info">
          <h2 className="ac-user-name">{user.name}</h2>
          <p className="ac-user-role">{user.role}</p>
        </div>

        {/* Detailed Info Grid */}
        <div className="ac-details-list">
          <div className="ac-detail-item">
            <div className="ac-detail-icon"><FaUserCircle /></div>
            <div className="ac-detail-text">
              <span className="ac-detail-label">Full Name</span>
              <span className="ac-detail-value">{user.name}</span>
            </div>
          </div>
          
          <div className="ac-detail-item">
            <div className="ac-detail-icon"><FaEnvelope /></div>
            <div className="ac-detail-text">
              <span className="ac-detail-label">Email Address</span>
              <span className="ac-detail-value">{user.email}</span>
            </div>
          </div>

          <div className="ac-detail-row">
            <div className={`ac-detail-item ${user.role === 'admin' ? 'full' : 'half'}`}>
              <div className="ac-detail-icon blue"><FaCalendarAlt /></div>
              <div className="ac-detail-text">
                <span className="ac-detail-label">Member Since</span>
                <span className="ac-detail-value">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '2024'}
                </span>
              </div>
            </div>

            {user.role !== "admin" && (
              <div className="ac-detail-item half">
                <div className="ac-detail-icon green"><FaBookOpen /></div>
                <div className="ac-detail-text">
                  <span className="ac-detail-label">Enrolled</span>
                  <span className="ac-detail-value">{user.subscription ? user.subscription.length : 0} Courses</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="ac-actions">
          
          <div className="ac-btn-group">
            <button onClick={() => handleComingSoon("Edit Profile")} className="ac-btn ac-btn-outline">
              <FaEdit /> Edit Profile
            </button>
            <button onClick={() => handleComingSoon("Change Password")} className="ac-btn ac-btn-outline">
              <FaKey /> Password
            </button>
          </div>

          {user.role !== "admin" && (
            <button
              onClick={() => navigate(`/${user._id}/dashboard`)}
              className="ac-btn ac-btn-dashboard"
            >
              <FaTachometerAlt />
              Student Dashboard
            </button>
          )}

          {user.role === "admin" && (
            <button
              onClick={() => navigate(`/admin/dashboard`)}
              className="ac-btn ac-btn-admin"
            >
              <FaShieldAlt />
              Admin Dashboard
            </button>
          )}

          <button
            onClick={logoutHandler}
            className="ac-btn ac-btn-logout"
          >
            <FaSignOutAlt />
            Logout Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
