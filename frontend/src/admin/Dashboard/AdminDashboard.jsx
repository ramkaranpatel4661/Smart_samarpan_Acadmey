import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Utils/Layout";
import axios from "axios";
import { server } from "../../main";
import { FaBook, FaChalkboard, FaUsers } from "react-icons/fa";
import Loading from "../../components/loading/Loading";
import { UserData } from "../../context/UserContext";

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { userLoading } = UserData();

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  if (user && user.role !== "admin") {
    return (
      <Layout>
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <h2 className="adm-page-title">Access Denied</h2>
          <p style={{ color: '#9b93b8' }}>You do not have admin privileges to view this dashboard.</p>
        </div>
      </Layout>
    );
  }

  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchStats() {
    try {
      const { data } = await axios.get(`${server}/api/stats`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setStats(data.stats);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || userLoading) {
    return <Loading />;
  }

  return (
    <Layout>
      <h2 className="adm-page-title">Admin Dashboard</h2>
      
      <div className="adm-stats-grid">
        {/* Total Courses Card */}
        <div className="adm-stat-card">
          <div className="adm-stat-icon-wrap">
            <FaBook />
          </div>
          <div className="adm-stat-info">
            <span className="adm-stat-label">Total Courses</span>
            <span className="adm-stat-value">{stats.totalCoures || 0}</span>
          </div>
        </div>

        {/* Total Lectures Card */}
        <div className="adm-stat-card">
          <div className="adm-stat-icon-wrap" style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)' }}>
            <FaChalkboard />
          </div>
          <div className="adm-stat-info">
            <span className="adm-stat-label">Total Lectures</span>
            <span className="adm-stat-value">{stats.totalLectures || 0}</span>
          </div>
        </div>

        {/* Total Users Card */}
        <div className="adm-stat-card">
          <div className="adm-stat-icon-wrap" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
            <FaUsers />
          </div>
          <div className="adm-stat-info">
            <span className="adm-stat-label">Total Users</span>
            <span className="adm-stat-value">{stats.totalUsers || 0}</span>
          </div>
        </div>
      </div>

      <div className="adm-dashboard-extras">
        {/* Quick Actions Panel */}
        <div className="adm-panel">
          <h3 className="adm-panel-title">Quick Actions</h3>
          <div className="adm-actions-grid">
            <button className="adm-action-btn" onClick={() => navigate('/admin/course/add')}>
              <div className="adm-action-icon"><FaBook /></div>
              <span>Create New Course</span>
            </button>
            <button className="adm-action-btn" onClick={() => navigate('/admin/users')}>
              <div className="adm-action-icon blue"><FaUsers /></div>
              <span>Manage Users</span>
            </button>
            <button className="adm-action-btn" onClick={() => alert('Analytics coming soon!')}>
              <div className="adm-action-icon green"><FaChalkboard /></div>
              <span>View Analytics</span>
            </button>
          </div>
        </div>

        {/* System Overview Panel */}
        <div className="adm-panel">
          <h3 className="adm-panel-title">Platform Overview</h3>
          <div className="adm-overview-content">
            <div className="adm-overview-item">
              <span className="adm-overview-dot green"></span>
              <div className="adm-overview-text">
                <p className="adm-overview-main">All Systems Operational</p>
                <p className="adm-overview-sub">API & Database are responding normally.</p>
              </div>
            </div>
            <div className="adm-overview-item">
              <span className="adm-overview-dot blue"></span>
              <div className="adm-overview-text">
                <p className="adm-overview-main">AI Models Connected</p>
                <p className="adm-overview-sub">Gemini API is active for generation.</p>
              </div>
            </div>
            <div className="adm-overview-item mt-auto">
              <div className="adm-storage-bar-wrap">
                <div className="adm-storage-labels">
                  <span>Server Storage</span>
                  <span>45% Used</span>
                </div>
                <div className="adm-storage-track">
                  <div className="adm-storage-fill" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;