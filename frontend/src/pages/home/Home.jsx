import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Home.css";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Testimonials from "../../components/testimonials/Testimonials";
import {
  FaGraduationCap, FaRobot, FaLaptopCode, FaEye,
  FaLightbulb, FaCrosshairs, FaChartLine, FaBookOpen,
  FaRocket, FaStar, FaArrowRight, FaPlay,
  FaUsers, FaAward, FaBrain, FaInfinity,
  FaCheckCircle, FaShieldAlt, FaClock,
} from "react-icons/fa";

/* ─────────────────────────────────────────────────────────────
   useScrollReveal — adds .sma-revealed when element enters viewport
───────────────────────────────────────────────────────────── */
function useScrollReveal(options = {}) {
  useEffect(() => {
    const targets = document.querySelectorAll(".sma-reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("sma-revealed");
          observer.unobserve(entry.target); // fire once
        }
      });
    }, { threshold: 0.12, ...options });
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─────────────────────────────────────────────────────────────
   Animated Counter Hook
───────────────────────────────────────────────────────────── */
function useCountUp(target, duration = 2200, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ─────────────────────────────────────────────────────────────
   Typing Headline Hook
───────────────────────────────────────────────────────────── */
function useTypewriter(words, speed = 90, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout;
    if (!deleting && charIdx <= current.length) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIdx));
        setCharIdx((c) => c + 1);
      }, speed);
    } else if (!deleting && charIdx > current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx >= 0) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIdx));
        setCharIdx((c) => c - 1);
      }, speed / 2);
    } else {
      setDeleting(false);
      setWordIdx((w) => (w + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

/* ─────────────────────────────────────────────────────────────
   Floating Particle
───────────────────────────────────────────────────────────── */
function Particle({ style }) {
  return <div className="sma-particle" style={style} />;
}

/* ─────────────────────────────────────────────────────────────
   Stats Counter Card
───────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, target, suffix, label, started, delay }) {
  const count = useCountUp(target, 2200, started);
  return (
    <div className="sma-stat-card sma-reveal sma-reveal-up" style={{ transitionDelay: delay }}>
      <div className="sma-stat-icon-wrap">
        <Icon />
      </div>
      <div className="sma-stat-number">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="sma-stat-label">{label}</div>
      <div className="sma-stat-shine" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Feature Card
───────────────────────────────────────────────────────────── */
function FeatureCard({ icon: Icon, title, description, accent, index, onClick, btnLabel }) {
  return (
    <div
      className="sma-feature-card sma-reveal sma-reveal-up"
      style={{ "--accent": accent, transitionDelay: `${index * 0.12}s` }}
    >
      {/* animated border top */}
      <div className="sma-card-border-top" />
      {/* bg glow on hover */}
      <div className="sma-card-hover-glow" />

      <div className="sma-feature-icon-wrap">
        <Icon className="sma-feature-icon" />
      </div>
      <h3 className="sma-feature-title">{title}</h3>
      <p className="sma-feature-desc">{description}</p>
      {onClick && (
        <button className="sma-feature-btn" onClick={onClick}>
          {btnLabel} <FaArrowRight style={{ marginLeft: 6 }} />
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Pillar Card
───────────────────────────────────────────────────────────── */
function PillarCard({ icon: Icon, title, description, color, index }) {
  return (
    <div
      className="sma-pillar-card sma-reveal sma-reveal-up"
      style={{ transitionDelay: `${index * 0.13}s` }}
    >
      <div className="sma-pillar-icon-ring" style={{ background: color }}>
        <Icon />
      </div>
      <h4 className="sma-pillar-title">{title}</h4>
      <p className="sma-pillar-desc">{description}</p>
      <div className="sma-pillar-check">
        <FaCheckCircle style={{ color: "#a855f7" }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────── */
const Home = ({ isAuth, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  /* Typed words for hero */
  const typedWord = useTypewriter(["Algebra", "Calculus", "Geometry", "Statistics", "Trigonometry"]);

  /* Scroll reveal hook */
  useScrollReveal();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  /* Intersection Observer for stats counter */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  /* Mouse parallax on hero */
  const handleMouseMove = useCallback((e) => {
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (e.clientX / innerWidth - 0.5) * 20,
      y: (e.clientY / innerHeight - 0.5) * 20,
    });
  }, []);

  /* Floating particles */
  const particles = useRef(
    Array.from({ length: 22 }, () => ({
      width:  `${Math.random() * 12 + 3}px`,
      height: `${Math.random() * 12 + 3}px`,
      left:   `${Math.random() * 100}%`,
      top:    `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 10 + 7}s`,
      animationDelay:    `${Math.random() * 6}s`,
      opacity: Math.random() * 0.45 + 0.08,
    }))
  ).current;

  return (
    <div className="sma-home">

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="sma-hero" onMouseMove={handleMouseMove}>
        <div className="sma-hero-bg" />
        <div className="sma-hero-grid" />

        {/* Moving orbs follow mouse */}
        <div
          className="sma-hero-orb sma-orb-a"
          style={{ transform: `translate(${mousePos.x * 1.2}px, ${mousePos.y * 1.2}px)` }}
        />
        <div
          className="sma-hero-orb sma-orb-b"
          style={{ transform: `translate(${-mousePos.x * 0.8}px, ${-mousePos.y * 0.8}px)` }}
        />

        {/* Particles */}
        <div className="sma-particles-container">
          {particles.map((p, i) => <Particle key={i} style={p} />)}
        </div>

        {/* Content */}
        <div className="sma-hero-content">
          {/* Badge */}
          <div className="sma-hero-badge sma-animate-badge">
            <FaStar style={{ color: "#fbbf24", marginRight: 6 }} />
            India's #1 AI-Powered Math Academy
          </div>

          {/* Headline */}
          <h1 className="sma-hero-heading sma-animate-heading">
            Master{" "}
            <span className="sma-typewriter-wrap">
              <span className="sma-typewriter">{typedWord}</span>
              <span className="sma-cursor">|</span>
            </span>
            <br />
            <span className="sma-hero-gradient-text">with Samarpan Academy</span>
          </h1>

          {/* Subtext */}
          <p className="sma-hero-subtext sma-animate-subtext">
            Master complex concepts with expert-led courses, personalized
            learning paths, and cutting-edge AI tools for quizzes &amp; formula
            generation.
          </p>

          {/* Action Buttons */}
          <div className="sma-hero-actions sma-animate-actions">
            <button className="sma-btn-primary" onClick={() => navigate("/courses")}>
              <FaRocket style={{ marginRight: 8 }} />
              Explore Courses
            </button>
            <button className="sma-btn-ghost" onClick={() => navigate("/ai-tools")}>
              <span className="sma-play-ring">
                <FaPlay style={{ fontSize: 11 }} />
              </span>
              Try AI Tools
            </button>
          </div>

          {/* Trust chips */}
          <div className="sma-hero-trust sma-animate-trust">
            {["Expert Instructors", "AI-Powered", "24/7 Access"].map((t, i) => (
              <span key={t} className="sma-trust-chip" style={{ animationDelay: `${0.9 + i * 0.15}s` }}>
                <FaCheckCircle style={{ color: "#a855f7", marginRight: 5 }} />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Floating glass cards */}
        <div className="sma-hero-float-card sma-float-card-1 sma-animate-float-card-l">
          <FaBrain style={{ color: "#a855f7", fontSize: 22 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>AI Quiz Ready</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Personalized for you</div>
          </div>
          <div className="sma-float-card-dot" />
        </div>
        <div className="sma-hero-float-card sma-float-card-2 sma-animate-float-card-r">
          <FaAward style={{ color: "#fbbf24", fontSize: 22 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Top Rated</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>★★★★★ 4.9/5</div>
          </div>
        </div>


      </section>

      {/* ══ STATS ════════════════════════════════════════════ */}
      <section className="sma-stats-section" ref={statsRef}>
        <div className="sma-section-inner">
          <div className="sma-stats-grid">
            <StatCard icon={FaUsers}    target={12000} suffix="+" label="Students Enrolled"    started={statsVisible} delay="0s" />
            <StatCard icon={FaBookOpen} target={80}    suffix="+" label="Courses Available"    started={statsVisible} delay="0.1s" />
            <StatCard icon={FaAward}    target={98}    suffix="%" label="Satisfaction Rate"    started={statsVisible} delay="0.2s" />
            <StatCard icon={FaInfinity} target={500}   suffix="+" label="AI Quizzes Generated" started={statsVisible} delay="0.3s" />
          </div>
        </div>
      </section>

      {/* ══ WHY SAMARPAN ═════════════════════════════════════ */}
      <section className="sma-section sma-section-dark">
        <div className="sma-section-inner">
          <div className="sma-section-header sma-reveal sma-reveal-up">
            <span className="sma-section-pill">Why Us</span>
            <h2 className="sma-section-title">
              Why Choose <span className="sma-purple">Samarpan</span> Math Academy?
            </h2>
            <p className="sma-section-subtitle">
              Everything you need to master mathematics — in one intelligent platform.
            </p>
          </div>
          <div className="sma-features-grid">
            <FeatureCard index={0} icon={FaGraduationCap} title="Expert-Led Courses"
              description="Learn from experienced instructors who simplify complex math topics for deep understanding and strong foundations."
              accent="#a855f7" />
            <FeatureCard index={1} icon={FaRobot} title="AI-Powered Learning"
              description="Instant quiz generation, comprehensive formula lookups, and personalized recommendations — all powered by AI."
              accent="#3b82f6" onClick={() => navigate("/ai-tools")} btnLabel="Try AI Tools" />
            <FeatureCard index={2} icon={FaLaptopCode} title="Flexible & Accessible"
              description="Study at your own pace, anytime, anywhere. Our platform is designed for your convenience and busy schedule."
              accent="#10b981" />
            <FeatureCard index={3} icon={FaShieldAlt} title="Trusted & Secure"
              description="Your data, progress, and learning journey are protected with enterprise-grade security and privacy standards."
              accent="#f59e0b" />
          </div>
        </div>
      </section>

      {/* ══ VISION ═══════════════════════════════════════════ */}
      <section className="sma-vision-section">
        <div className="sma-vision-bg-orb sma-orb-1" />
        <div className="sma-vision-bg-orb sma-orb-2" />
        {/* Rotating ring decoration */}
        <div className="sma-vision-ring" />
        <div className="sma-section-inner sma-vision-inner">
          <div className="sma-vision-icon-wrap sma-reveal sma-reveal-zoom">
            <FaEye />
          </div>
          <span className="sma-section-pill sma-reveal sma-reveal-up" style={{ transitionDelay: "0.1s" }}>Our Vision</span>
          <h2 className="sma-section-title sma-reveal sma-reveal-up" style={{ marginTop: 12, transitionDelay: "0.2s" }}>
            Redefining Math Education
          </h2>
          <p className="sma-vision-text sma-reveal sma-reveal-up" style={{ transitionDelay: "0.3s" }}>
            At Samarpan Math Academy, we envision a world where every student
            can conquer their fear of mathematics and unlock their full
            potential. We are committed to providing high-quality, accessible,
            and innovative learning experiences that foster deep understanding
            and a lifelong love for numbers.
          </p>
          <div className="sma-vision-perks sma-reveal sma-reveal-up" style={{ transitionDelay: "0.4s" }}>
            {[
              { icon: FaClock,     label: "Learn at Your Pace" },
              { icon: FaBrain,     label: "Adaptive Curriculum" },
              { icon: FaChartLine, label: "Progress Analytics" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="sma-vision-perk">
                <Icon className="sma-perk-icon" />
                <span>{label}</span>
              </div>
            ))}
          </div>
          <Link
            to="/about"
            className="sma-btn-primary sma-reveal sma-reveal-up"
            style={{ textDecoration: "none", display: "inline-flex", marginTop: 28, transitionDelay: "0.5s" }}
          >
            Learn More About Us <FaArrowRight style={{ marginLeft: 8 }} />
          </Link>
        </div>
      </section>

      {/* ══ TESTIMONIALS ═════════════════════════════════════ */}
      <section className="sma-section sma-section-dark">
        <div className="sma-section-inner">
          <div className="sma-section-header sma-reveal sma-reveal-up">
            <span className="sma-section-pill">Student Stories</span>
            <h2 className="sma-section-title">
              Hear from Our <span className="sma-purple">Students</span>
            </h2>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* ══ WHAT SETS US APART ═══════════════════════════════ */}
      <section className="sma-section" style={{ background: "#0f0c1a" }}>
        <div className="sma-section-inner">
          <div className="sma-section-header sma-reveal sma-reveal-up">
            <span className="sma-section-pill">Our Edge</span>
            <h2 className="sma-section-title">
              What <span className="sma-purple">Sets Us Apart</span>
            </h2>
            <p className="sma-section-subtitle">
              Every feature is built to accelerate your learning and results.
            </p>
          </div>
          <div className="sma-pillars-grid">
            <PillarCard index={0} icon={FaLightbulb}  color="rgba(251,191,36,0.15)"  title="Conceptual Clarity"   description="Build strong fundamentals through crystal-clear explanations and step-by-step walkthroughs." />
            <PillarCard index={1} icon={FaCrosshairs} color="rgba(239,68,68,0.15)"   title="Targeted Practice"    description="AI-tailored quizzes match your exact level so every minute of practice counts." />
            <PillarCard index={2} icon={FaChartLine}  color="rgba(99,102,241,0.15)"  title="Performance Tracking" description="Monitor your growth with detailed analytics and personalized AI-driven insights." />
            <PillarCard index={3} icon={FaBookOpen}   color="rgba(16,185,129,0.15)"  title="Rich Content Library" description="Access a vast, ever-growing collection of courses, lectures, and practice resources." />
          </div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════ */}
      <section className="sma-cta-section">
        <div className="sma-cta-glow" />
        <div className="sma-cta-particles">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="sma-cta-sparkle" style={{ animationDelay: `${i * 0.4}s`, left: `${10 + i * 11}%` }} />
          ))}
        </div>
        <div className="sma-section-inner sma-cta-inner">
          <div className="sma-cta-icon-ring sma-reveal sma-reveal-zoom">
            <FaRocket />
          </div>
          <h2 className="sma-cta-title sma-reveal sma-reveal-up" style={{ transitionDelay: "0.15s" }}>
            Ready to Transform Your
            <span className="sma-hero-gradient-text"> Math Journey?</span>
          </h2>
          <p className="sma-cta-subtitle sma-reveal sma-reveal-up" style={{ transitionDelay: "0.25s" }}>
            Join thousands of students achieving their academic goals with Samarpan Math Academy.
          </p>
          <div className="sma-reveal sma-reveal-up" style={{ transitionDelay: "0.35s" }}>
            {!isAuth ? (
              <button className="sma-btn-primary sma-cta-btn" onClick={() => navigate("/register")}>
                Sign Up Today — It's Free!
                <FaArrowRight style={{ marginLeft: 10 }} />
              </button>
            ) : (
              <button className="sma-btn-primary sma-cta-btn" onClick={() => navigate(`/${user._id}/dashboard`)}>
                Go to My Dashboard
                <FaArrowRight style={{ marginLeft: 10 }} />
              </button>
            )}
          </div>
          <p className="sma-cta-note sma-reveal sma-reveal-up" style={{ transitionDelay: "0.45s" }}>
            No credit card required &bull; Cancel anytime
          </p>
        </div>
      </section>

    </div>
  );
};

export default Home;
