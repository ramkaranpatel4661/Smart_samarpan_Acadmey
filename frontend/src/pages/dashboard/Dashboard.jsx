import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";
import Loading from "../../components/loading/Loading";
import { server } from "../../main";
import { FaPlay, FaClock, FaStar, FaArrowRight } from "react-icons/fa";
import toast from "react-hot-toast";

import "./Dashboard.css";
import "../courses/Courses.css"; // Reuse the premium card styling

/* ── Enrolled Course Card ─────────────────────────────────────── */
const EnrolledCourseCard = ({ course, index }) => {
  const navigate = useNavigate();
  const delay = `${(index % 8) * 0.07}s`;
  const initials = (course.createdBy || "S").charAt(0).toUpperCase();

  const handleStudy = () => {
    navigate(`/course/study/${course._id}`);
  };

  return (
    <div className="crs-card crs-in" style={{ transitionDelay: delay, opacity: 1, transform: 'none' }}>
      {/* Thumbnail */}
      <div className="crs-thumb-wrap">
        <img src={`${server}/${course.image}`} alt={course.title} className="crs-thumb" />
        <div className="crs-thumb-overlay" onClick={handleStudy}>
          <div className="crs-play-btn"><FaPlay /></div>
        </div>
        <div className="crs-tag">
          <span className="crs-tag-pill active">Enrolled</span>
        </div>
      </div>

      {/* Body */}
      <div className="crs-body">
        <div className="crs-instructor-row">
          <div className="crs-avatar">{initials}</div>
          <span className="crs-instructor-name">{course.createdBy}</span>
        </div>
        
        <h3 className="crs-title">{course.title}</h3>

        <div className="crs-stars">
          {[1,2,3,4,5].map((s) => (
            <FaStar key={s} className="crs-star" />
          ))}
          <span className="crs-rating-text">In Progress</span>
        </div>

        <div className="crs-meta-row">
          <span className="crs-meta-pill"><FaClock />{course.duration} weeks</span>
        </div>
      </div>

      {/* Actions */}
      <div className="crs-actions">
        <button className="crs-btn crs-btn-primary" onClick={handleStudy}>
          <FaPlay /> Continue Studying
        </button>
      </div>
    </div>
  );
};

/* ── Main Dashboard Page ─────────────────────────────────────── */
const Dashboard = () => {
  const { mycourse, loading } = CourseData();
  const { userLoading } = UserData();

  if (loading || userLoading) {
    return <Loading />;
  }
  
  return (
    <div className="dash-page">
      <div className="dash-bg-glow" />
      <div className="dash-bg-grid" />

      <div className="dash-container">
        <div className="dash-header">
          <h2 className="dash-title">My Learning Dashboard</h2>
          <p className="dash-subtitle">
            Pick up right where you left off. Access all your enrolled courses, track your progress, and continue mastering math.
          </p>
        </div>

        {mycourse && mycourse.length > 0 ? (
          <div className="crs-grid">
            {mycourse.map((course, i) => (
              <EnrolledCourseCard key={course._id} course={course} index={i} />
            ))}
          </div>
        ) : (
          <div className="dash-empty">
            <div className="dash-empty-emoji">🎓</div>
            <h3 className="dash-empty-title">No Courses Enrolled Yet</h3>
            <p className="dash-empty-hint">
              You haven't enrolled in any math courses. Explore the course catalog to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;