import React, { useEffect } from "react";
import "./About.css";
import { Link } from "react-router-dom";
import profileImage from "../../assets/img.jpg";
import {
  FaBullseye, FaUserTie, FaGraduationCap, FaChalkboardTeacher,
  FaRocket, FaLightbulb, FaHeart, FaShieldAlt, FaUsers,
  FaStar, FaClock, FaArrowRight, FaBrain, FaAward,
} from "react-icons/fa";

/* ── Scroll Reveal ──────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".ab-reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("ab-in"); io.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Data ───────────────────────────────────────────────────── */
const STATS = [
  { icon: FaUsers,        num: "12,000+", lbl: "Students Enrolled" },
  { icon: FaClock,        num: "5+ Yrs",  lbl: "Teaching Experience" },
  { icon: FaStar,         num: "4.9★",    lbl: "Avg Rating" },
  { icon: FaAward,        num: "500+",    lbl: "Students Mentored" },
];

const MISSION_CARDS = [
  { icon: FaLightbulb, color: "#fbbf24", title: "Conceptual Clarity", desc: "We break down complex topics into simple, memorable steps." },
  { icon: FaBrain,     color: "#a855f7", title: "AI-Powered Tools",  desc: "Smart quizzes & formula generators tailored to each learner." },
  { icon: FaRocket,    color: "#3b82f6", title: "Fast Progress",     desc: "Structured paths help students move from basics to mastery." },
  { icon: FaHeart,     color: "#ec4899", title: "Student First",     desc: "Every decision we make puts student success at the center." },
];

const VALUES = [
  { icon: FaBullseye,        color: "#a855f7", title: "Excellence",    desc: "We hold ourselves to the highest academic and ethical standards in everything we deliver." },
  { icon: FaLightbulb,       color: "#fbbf24", title: "Innovation",    desc: "We embrace technology and AI to make learning more engaging, effective and personalized." },
  { icon: FaHeart,           color: "#ec4899", title: "Empathy",       desc: "We understand every student's journey is unique and tailor our support accordingly." },
  { icon: FaShieldAlt,       color: "#10b981", title: "Integrity",     desc: "Honest, transparent and trustworthy in how we teach, price, and communicate." },
  { icon: FaUsers,           color: "#3b82f6", title: "Community",     desc: "Building a vibrant, supportive community of math learners across India." },
  { icon: FaGraduationCap,   color: "#6366f1", title: "Accessibility", desc: "Quality math education should be available to every student regardless of background." },
];

/* ── Component ──────────────────────────────────────────────── */
const About = () => {
  useReveal();

  return (
    <div className="ab-page">

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="ab-hero">
        <div className="ab-hero-bg" />
        <div className="ab-hero-grid" />
        <div className="ab-orb ab-orb-1" />
        <div className="ab-orb ab-orb-2" />
        <div className="ab-orb ab-orb-3" />

        <div className="ab-hero-inner">
          <div className="ab-hero-pill">
            <FaGraduationCap /> About Us
          </div>
          <h1 className="ab-hero-title">
            The Story Behind<br />
            <span>Samarpan Academy</span>
          </h1>
          <p className="ab-hero-sub">
            Dedicated to fostering a love for mathematics and empowering every
            student to unlock their full academic potential through innovation,
            empathy, and AI-powered learning.
          </p>

        </div>
      </section>

      {/* ══ STATS STRIP ══════════════════════════════════════ */}
      <div className="ab-stats-strip">
        <div className="ab-stats-inner">
          {STATS.map(({ icon: Icon, num, lbl }, i) => (
            <div
              key={lbl}
              className="ab-stat ab-reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <Icon className="ab-stat-icon" />
              <span className="ab-stat-num">{num}</span>
              <span className="ab-stat-lbl">{lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ MISSION ══════════════════════════════════════════ */}
      <section className="ab-section">
        <div className="ab-inner">
          <div className="ab-reveal">
            <span className="ab-pill">Our Mission</span>
            <h2 className="ab-section-title">
              Why We <span>Exist</span>
            </h2>
            <p className="ab-section-sub">
              We believe every student deserves access to world-class math education —
              not just those in top cities or elite schools.
            </p>
          </div>

          <div className="ab-mission-grid">
            <p
              className="ab-mission-text ab-reveal ab-reveal-left"
              style={{ transitionDelay: "0.1s" }}
            >
              Our mission is to provide high-quality, accessible, and personalized
              math education to students across India. We leverage innovative
              technology — including our AI-powered quiz and formula tools — to
              create an engaging learning environment that builds confidence and
              deep understanding of mathematics.
              <br /><br />
              We believe that with the right guidance, every student can go from
              fearing numbers to loving them. Samarpan Academy is that bridge.
            </p>

            <div className="ab-mission-cards">
              {MISSION_CARDS.map(({ icon: Icon, color, title, desc }, i) => (
                <div
                  key={title}
                  className="ab-mission-card ab-reveal ab-reveal-right"
                  style={{ transitionDelay: `${0.1 + i * 0.1}s` }}
                >
                  <div className="ab-mission-card-icon" style={{ color }}>
                    <Icon />
                  </div>
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOUNDER ══════════════════════════════════════════ */}
      <section className="ab-section ab-section-dark">
        <div className="ab-inner">
          <div className="ab-reveal">
            <span className="ab-pill">Meet the Founder</span>
            <h2 className="ab-section-title">
              The <span>Visionary</span> Behind It All
            </h2>
          </div>

          <div className="ab-founder-wrap">
            {/* Photo card */}
            <div className="ab-photo-card ab-reveal ab-reveal-zoom" style={{ transitionDelay: "0.15s" }}>
              <div className="ab-photo-ring">
                <img src={profileImage} alt="M.K YADAV" className="ab-photo-img" />
              </div>
              <h3 className="ab-founder-name">M.K YADAV</h3>
              <p className="ab-founder-role">Founder &amp; Lead Educator</p>
              <div className="ab-founder-badges">
                <span className="ab-badge">M.Sc. Mathematics</span>
                <span className="ab-badge">5+ Years</span>
                <span className="ab-badge">500+ Students</span>
              </div>
            </div>

            {/* Bio */}
            <div className="ab-founder-bio ab-reveal" style={{ transitionDelay: "0.25s" }}>
              <div className="ab-quote">
                <span className="ab-quote-mark">"</span>
                I started Samarpan Math Academy with a simple vision: to make
                quality math education accessible to every student. Growing up
                in Saharsa, Bihar, I understood the challenges students face.
                My goal is to bridge that gap through technology and a passion
                for teaching, creating a platform where curiosity is nurtured
                and potential is fully realized.
              </div>

              <div className="ab-cred-list">
                <div className="ab-cred">
                  <div
                    className="ab-cred-icon"
                    style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", color: "#6366f1" }}
                  >
                    <FaGraduationCap />
                  </div>
                  <div className="ab-cred-body">
                    <h5>Educational Qualifications</h5>
                    <p>B.Sc. Mathematics — T.N.B. College, Bhagalpur</p>
                    <p>M.Sc. Mathematics — B.N.M.U. University</p>
                  </div>
                </div>

                <div className="ab-cred">
                  <div
                    className="ab-cred-icon"
                    style={{ background: "rgba(236,72,153,0.15)", border: "1px solid rgba(236,72,153,0.25)", color: "#ec4899" }}
                  >
                    <FaChalkboardTeacher />
                  </div>
                  <div className="ab-cred-body">
                    <h5>Teaching Experience</h5>
                    <p>5+ years of dedicated classroom & online teaching</p>
                    <p>Mentored 500+ students for competitive exams</p>
                  </div>
                </div>

                <div className="ab-cred">
                  <div
                    className="ab-cred-icon"
                    style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981" }}
                  >
                    <FaUserTie />
                  </div>
                  <div className="ab-cred-body">
                    <h5>Leadership &amp; Vision</h5>
                    <p>Founded Samarpan Academy to democratize math education</p>
                    <p>Built India's first AI-powered vernacular math platform</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ VALUES ═══════════════════════════════════════════ */}
      <section className="ab-section">
        <div className="ab-inner">
          <div className="ab-reveal" style={{ textAlign: "center" }}>
            <span className="ab-pill">Our Values</span>
            <h2 className="ab-section-title" style={{ textAlign: "center" }}>
              What We <span>Stand For</span>
            </h2>
            <p className="ab-section-sub" style={{ margin: "0 auto" }}>
              These principles guide every course, every feature, and every
              interaction at Samarpan Academy.
            </p>
          </div>

          <div className="ab-values-grid">
            {VALUES.map(({ icon: Icon, color, title, desc }, i) => (
              <div
                key={title}
                className="ab-value-card ab-reveal"
                style={{
                  "--val-color": color,
                  transitionDelay: `${i * 0.1}s`,
                }}
              >
                <div className="ab-value-icon" style={{ color }}>
                  <Icon />
                </div>
                <h3 className="ab-value-title">{title}</h3>
                <p className="ab-value-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════ */}
      <section className="ab-cta">
        <div className="ab-cta-glow" />
        <div className="ab-cta-inner">
          <div className="ab-reveal ab-reveal-zoom">
            <span className="ab-pill">Join Us</span>
            <h2 className="ab-cta-title">
              Ready to Start Your<br />
              <span>Math Journey?</span>
            </h2>
            <p className="ab-cta-sub">
              Thousands of students have already transformed their understanding
              of mathematics. Join them today.
            </p>
            <Link to="/courses" className="ab-cta-btn">
              Browse All Courses <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
