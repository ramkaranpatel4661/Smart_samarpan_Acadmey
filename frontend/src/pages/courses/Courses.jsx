import React, { useState, useEffect } from "react";
import "./Courses.css";
import { CourseData } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";
import { server } from "../../main";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";
import axios from "axios";
import {
  FaGraduationCap, FaSearch, FaClock, FaUser,
  FaStar, FaPlay, FaTrash, FaArrowRight,
  FaThLarge, FaList, FaUsers, FaCalculator,
  FaSquareRootAlt, FaChartBar, FaInfinity,
} from "react-icons/fa";

/* ── reveal hook ─────────────────────────────────────────── */
function useReveal(selector) {
  useEffect(() => {
    const els = document.querySelectorAll(selector);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("crs-in"); io.unobserve(e.target); }
      }),
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

/* ── Grid CourseCard ─────────────────────────────────────── */
const CourseCard = ({ course, index }) => {
  const navigate = useNavigate();
  const { user, isAuth } = UserData();
  const { fetchCourses } = CourseData();
  const isSubscribed = user?.subscription?.includes(course._id);
  const isAdmin = user?.role === "admin";

  const deleteHandler = async (id) => {
    if (!confirm("Delete this course?")) return;
    try {
      const { data } = await axios.delete(`${server}/api/course/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      toast.success(data.message);
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  const handleAction = () => {
    if (!isAuth) return navigate("/login");
    if (isAdmin || isSubscribed) navigate(`/course/study/${course._id}`);
    else navigate(`/course/${course._id}`);
  };

  const initials = (course.createdBy || "S").charAt(0).toUpperCase();
  const delay = `${(index % 8) * 0.07}s`;

  return (
    <div className="crs-card" style={{ transitionDelay: delay }}>
      {/* Thumbnail */}
      <div className="crs-thumb-wrap">
        <img src={`${server}/${course.image}`} alt={course.title} className="crs-thumb" />
        <div className="crs-thumb-overlay">
          <div className="crs-play-btn"><FaPlay /></div>
        </div>
        <div className="crs-tag">
          <span className="crs-tag-pill">Math</span>
          {index === 0 && <span className="crs-tag-pill hot">🔥 Hot</span>}
          {index === 1 && <span className="crs-tag-pill new">✨ New</span>}
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
            <FaStar key={s} className={`crs-star ${s > 4 ? "dim" : ""}`} />
          ))}
          <span className="crs-rating-text">4.9 · 120 reviews</span>
        </div>

        <div className="crs-meta-row">
          <span className="crs-meta-pill"><FaClock />{course.duration} weeks</span>
          <span className="crs-meta-pill"><FaUsers />1.2k enrolled</span>
        </div>

        <div className="crs-price-row">
          <span className="crs-price">₹{course.price}</span>
          <span className="crs-enrolled"><FaUsers />1,240 students</span>
        </div>
      </div>

      {/* Actions */}
      <div className="crs-actions">
        <button className="crs-btn crs-btn-primary" onClick={handleAction}>
          {isSubscribed || isAdmin ? <FaPlay /> : <FaArrowRight />}
          {!isAuth ? "Get Started" : isAdmin || isSubscribed ? "Continue Learning" : "Enroll Now"}
        </button>
        {isAdmin && (
          <button className="crs-btn crs-btn-danger" onClick={() => deleteHandler(course._id)}>
            <FaTrash /> Delete
          </button>
        )}
      </div>
    </div>
  );
};

/* ── List CourseCard ─────────────────────────────────────── */
const ListCard = ({ course, index }) => {
  const navigate = useNavigate();
  const { user, isAuth } = UserData();
  const { fetchCourses } = CourseData();
  const isSubscribed = user?.subscription?.includes(course._id);
  const isAdmin = user?.role === "admin";

  const deleteHandler = async (id) => {
    if (!confirm("Delete this course?")) return;
    try {
      const { data } = await axios.delete(`${server}/api/course/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      toast.success(data.message);
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  const handleAction = () => {
    if (!isAuth) return navigate("/login");
    if (isAdmin || isSubscribed) navigate(`/course/study/${course._id}`);
    else navigate(`/course/${course._id}`);
  };

  const initials = (course.createdBy || "S").charAt(0).toUpperCase();
  const delay = `${index * 0.06}s`;

  return (
    <div className="crs-list-card" style={{ transitionDelay: delay }}>
      <div className="crs-list-thumb-wrap">
        <img src={`${server}/${course.image}`} alt={course.title} className="crs-list-thumb" />
      </div>
      <div className="crs-list-body">
        <div>
          <div className="crs-instructor-row">
            <div className="crs-avatar">{initials}</div>
            <span className="crs-instructor-name">{course.createdBy}</span>
            <span className="crs-tag-pill" style={{ marginLeft: "auto", position: "static" }}>Math</span>
          </div>
          <h3 className="crs-title" style={{ fontSize: "1.05rem", marginTop: 8 }}>{course.title}</h3>
          <div className="crs-stars" style={{ marginBottom: 8 }}>
            {[1,2,3,4,5].map((s) => <FaStar key={s} className={`crs-star ${s > 4 ? "dim" : ""}`} />)}
            <span className="crs-rating-text">4.9 · 120 reviews</span>
          </div>
          <div className="crs-meta-row">
            <span className="crs-meta-pill"><FaClock />{course.duration} weeks</span>
            <span className="crs-meta-pill"><FaUsers />1.2k enrolled</span>
          </div>
        </div>
        <div className="crs-list-footer">
          <span className="crs-price">₹{course.price}</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="crs-list-btn" onClick={handleAction}>
              {isSubscribed || isAdmin ? <FaPlay /> : <FaArrowRight />}
              {!isAuth ? "Get Started" : isAdmin || isSubscribed ? "Continue" : "Enroll Now"}
            </button>
            {isAdmin && (
              <button className="crs-list-delete" onClick={() => deleteHandler(course._id)}>
                <FaTrash /> Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Categories ──────────────────────────────────────────── */
const CATEGORIES = [
  { label: "All Courses",   icon: FaGraduationCap },
  { label: "Algebra",       icon: FaCalculator },
  { label: "Calculus",      icon: FaInfinity },
  { label: "Geometry",      icon: FaSquareRootAlt },
  { label: "Statistics",    icon: FaChartBar },
];

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

/* ── Main Page ───────────────────────────────────────────── */
const Courses = () => {
  const { courses, loading } = CourseData();
  const { userLoading } = UserData();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Courses");
  const [level, setLevel] = useState("All");
  const [view, setView] = useState("grid"); // "grid" | "list"

  useReveal(".crs-card, .crs-list-card");

  if (loading || userLoading) return <Loading />;

  const filtered = (courses || []).filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="crs-page">

      {/* ── Banner ── */}
      <div className="crs-banner">
        <div className="crs-banner-bg" />
        <div className="crs-banner-grid" />
        <div className="crs-banner-left">
          <div className="crs-banner-pill">
            <FaGraduationCap /> Samarpan Math Academy
          </div>
          <h1 className="crs-banner-title">
            Find Your Next<br /><span>Math Mastery</span> Course
          </h1>
          <p className="crs-banner-sub">
            Expert-led courses from algebra to advanced calculus — powered by AI, built for you.
          </p>
        </div>
        <div className="crs-banner-stats">
          <div className="crs-stat-pill">
            <span className="crs-stat-pill-num">{courses?.length || 0}+</span>
            <span className="crs-stat-pill-lbl">Courses</span>
          </div>
          <div className="crs-stat-pill">
            <span className="crs-stat-pill-num">4.9★</span>
            <span className="crs-stat-pill-lbl">Avg Rating</span>
          </div>
          <div className="crs-stat-pill">
            <span className="crs-stat-pill-num">12k+</span>
            <span className="crs-stat-pill-lbl">Students</span>
          </div>
        </div>
      </div>

      {/* ── Layout ── */}
      <div className="crs-layout">

        {/* Sidebar */}
        <aside className="crs-sidebar">
          {/* Search */}
          <div>
            <p className="crs-sidebar-section-title">Search</p>
            <div className="crs-sb-search">
              <FaSearch className="crs-sb-search-icon" />
              <input
                className="crs-sb-input"
                placeholder="Search courses..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="crs-sidebar-section-title">Category</p>
            <div className="crs-cat-list">
              {CATEGORIES.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  className={`crs-cat-btn ${category === label ? "active" : ""}`}
                  onClick={() => setCategory(label)}
                >
                  <Icon className="crs-cat-icon" />
                  {label}
                  <span className="crs-cat-count">{filtered.length}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Level */}
          <div>
            <p className="crs-sidebar-section-title">Level</p>
            <div className="crs-level-grid">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  className={`crs-level-btn ${level === l ? "active" : ""}`}
                  onClick={() => setLevel(l)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Price range visual */}
          <div>
            <p className="crs-sidebar-section-title">Price Range</p>
            <div className="crs-price-range">
              <div className="crs-price-labels">
                <span>₹0</span><span>₹5,000</span>
              </div>
              <div className="crs-range-track">
                <div className="crs-range-fill" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="crs-main">
          <div className="crs-topbar">
            <p className="crs-result-count">
              Showing <strong>{filtered.length}</strong> course{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="crs-view-toggle">
              <button
                className={`crs-view-btn ${view === "grid" ? "active" : ""}`}
                onClick={() => setView("grid")} title="Grid view"
              >
                <FaThLarge />
              </button>
              <button
                className={`crs-view-btn ${view === "list" ? "active" : ""}`}
                onClick={() => setView("list")} title="List view"
              >
                <FaList />
              </button>
            </div>
          </div>

          {view === "grid" ? (
            <div className="crs-grid">
              {filtered.length > 0
                ? filtered.map((c, i) => <CourseCard key={c._id} course={c} index={i} />)
                : (
                  <div className="crs-empty">
                    <div className="crs-empty-emoji">📚</div>
                    <p className="crs-empty-title">No courses found</p>
                    <p className="crs-empty-hint">Try a different search term</p>
                  </div>
                )}
            </div>
          ) : (
            <div className="crs-list">
              {filtered.length > 0
                ? filtered.map((c, i) => <ListCard key={c._id} course={c} index={i} />)
                : (
                  <div className="crs-empty">
                    <div className="crs-empty-emoji">📚</div>
                    <p className="crs-empty-title">No courses found</p>
                    <p className="crs-empty-hint">Try a different search term</p>
                  </div>
                )}
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default Courses;
