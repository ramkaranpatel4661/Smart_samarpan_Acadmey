import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import {
  FaLightbulb, FaCalculator, FaChartLine, FaQuestionCircle,
  FaSpinner, FaBrain, FaRobot, FaStar, FaBolt, FaCheckCircle
} from 'react-icons/fa';
import axios from 'axios';
import { server } from '../../main';
import { UserData } from '../../context/UserContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import KaTeXRenderer from '../../components/utils/KaTeXRenderer';
import katex from 'katex';
import './AITools.css';

/* ── Inline Math renderer ──────────────────────────────────── */
const InlineMath = ({ text }) => {
  if (!text) return null;
  const parts = text.split('$');
  return (
    <span>
      {parts.map((part, index) => {
        if (index % 2 === 0) return <span key={index}>{part}</span>;
        try {
          return <span key={index} dangerouslySetInnerHTML={{ __html: katex.renderToString(part, { throwOnError: false, displayMode: false }) }} />;
        } catch (e) {
          return <span key={index}>${part}$</span>;
        }
      })}
    </span>
  );
};

/* ── Markdown renderer ─────────────────────────────────────── */
const MarkdownRenderer = ({ text }) => {
  if (!text) return null;
  const lines = text.split('\n').map((line, i) => {
    if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-purple-700 mt-4 mb-2">{line.substring(4)}</h3>;
    if (line.startsWith('## '))  return <h2 key={i} className="text-2xl font-bold text-purple-800 mt-6 mb-3">{line.substring(3)}</h2>;
    if (line.startsWith('**'))  return <p key={i} className="my-1"><strong>{line.replace(/\*\*/g, '')}</strong></p>;
    if (line.startsWith('* '))  return <li key={i} className="ml-6 list-disc">{line.substring(2)}</li>;
    return <p key={i} className="my-1">{line}</p>;
  });
  return <div className="text-gray-800 text-left prose max-w-none">{lines}</div>;
};

/* ══════════════════════════════════════════════════════════════
   TOOL DEFINITIONS
═══════════════════════════════════════════════════════════════ */
const TOOLS = [
  {
    id: 'quiz',
    name: 'Quiz Generator',
    hint: '10 questions · Any math topic',
    desc: 'Generate a custom 10-question quiz on any math topic. Choose difficulty — Olympiad or JEE level — and get instant AI-crafted questions with answers.',
    icon: FaQuestionCircle,
    emoji: '🧠',
    stat: '10 Qs',
    statLbl: 'Per Quiz',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.1)',
    border: 'rgba(168,85,247,0.22)',
  },
  {
    id: 'formula',
    name: 'Formula Generator',
    hint: 'Any chapter · Any grade',
    desc: 'Instantly retrieve all key formulas for any chapter and grade. Beautifully rendered with LaTeX, covering Standard, Olympiad, and JEE levels.',
    icon: FaCalculator,
    emoji: '📐',
    stat: '∞',
    statLbl: 'Formulas',
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.22)',
  },
  {
    id: 'recommendation',
    name: 'Smart Recommendations',
    hint: 'Personalised · AI-powered',
    desc: 'Get your next study step recommended by Gemini AI based on your quiz history, weak topics, and performance trends. Always personalised.',
    icon: FaLightbulb,
    emoji: '💡',
    stat: 'AI',
    statLbl: 'Powered',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.22)',
  },
  {
    id: 'analysis',
    name: 'Performance Analysis',
    hint: 'Full history · Visual charts',
    desc: 'Deep-dive into your entire quiz history with bar charts, accuracy pie charts, and a comprehensive AI-written personalised study report.',
    icon: FaChartLine,
    emoji: '📊',
    stat: '360°',
    statLbl: 'Insights',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.22)',
  },
];

/* ══════════════════════════════════════════════════════════════
   QUIZ GENERATOR
═══════════════════════════════════════════════════════════════ */
const QuizGenerator = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('9th_10th_Olympiad');
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const { user, isAuth } = UserData();

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    if (!isAuth) {
      toast.error('Please log in to generate a quiz.');
      return;
    }
    setLoading(true); setQuiz(null); setError(null);
    setStudentAnswers({}); setShowResults(false);
    try {
      const res = await axios.post(`${server}/api/generate-quiz`, { topic, difficulty, num_questions: 10 });
      if (res.data.success) { setQuiz(res.data.quiz); toast.success('Quiz ready! Select your answers.'); }
      else { setError(res.data.message || 'Failed to generate quiz.'); toast.error(res.data.message || 'Failed.'); }
    } catch (err) {
      const msg = err.response?.data?.message || 'An unexpected error occurred.';
      setError(msg); toast.error(msg);
    } finally { setLoading(false); }
  };

  const handleAnswerChange = (qi, opt) => setStudentAnswers(prev => ({ ...prev, [qi]: opt }));

  const calculateScore = () => {
    if (!quiz) return 0;
    return quiz.reduce((acc, q, i) => studentAnswers[i] === q.correct_answer ? acc + 1 : acc, 0);
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(studentAnswers).length !== quiz.length) { toast.error('Please answer all questions.'); return; }
    setShowResults(true);
    const score = calculateScore();
    const userId = user?._id;
    if (!userId) { toast.error("Please log in to save results."); return; }
    try {
      const res = await axios.post(`${server}/api/submit-quiz-result`, {
        userId, topic: quiz[0].topic || topic,
        difficulty: quiz[0].difficulty || difficulty, score, totalQuestions: quiz.length
      });
      if (res.data.success) toast.success('Results saved!');
      else toast.error(res.data.message || 'Failed to save results.');
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving results.'); }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-inner w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Generate Math Quiz</h2>
      <form onSubmit={handleGenerateQuiz} className="space-y-4 mb-8 max-w-lg mx-auto">
        <div>
          <label htmlFor="quiz-topic" className="block text-sm font-medium text-gray-700 mb-1">Topic:</label>
          <input type="text" id="quiz-topic" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., Algebra, Trigonometry" required />
        </div>
        <div>
          <label htmlFor="quiz-difficulty" className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level:</label>
          <select id="quiz-difficulty" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            <option value="9th_10th_Olympiad">9th / 10th Grade Olympiad</option>
            <option value="11th_12th_JEE">11th / 12th Grade JEE</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 flex items-center justify-center" disabled={loading}>
          {loading ? <><FaSpinner className="animate-spin mr-2" /> Generating…</> : '⚡ Generate Quiz'}
        </button>
      </form>

      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md"><p>{error}</p></div>}

      {quiz && (
        <div className="mt-8">
          {quiz.map((q, qi) => (
            <div key={qi} className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50 question-card">
              <p className="font-bold text-lg text-gray-900 mb-3">Q{qi + 1}: <InlineMath text={q.question} /></p>
              <div className="options-group space-y-2">
                {q.options.map((opt, oi) => (
                  <label key={oi} className="flex items-center gap-2 text-gray-700 option-label cursor-pointer">
                    <input type="radio" name={`q-${qi}`} value={opt.charAt(0)}
                      onChange={() => handleAnswerChange(qi, opt.charAt(0))}
                      checked={studentAnswers[qi] === opt.charAt(0)}
                      disabled={showResults} />
                    <InlineMath text={opt} />
                  </label>
                ))}
              </div>
              {showResults && (
                <div className="mt-3 text-sm space-y-1">
                  <p className={`font-semibold ${studentAnswers[qi] === q.correct_answer ? 'text-green-600' : 'text-red-600'}`}>
                    Your Answer: {studentAnswers[qi] || 'Not answered'}
                  </p>
                  <p className="text-green-600">Correct: {q.correct_answer}</p>
                </div>
              )}
            </div>
          ))}
          {!showResults && (
            <button onClick={handleSubmitQuiz} className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 mt-4 submit-quiz-button"
              disabled={Object.keys(studentAnswers).length !== quiz.length}>
              ✅ Submit Quiz
            </button>
          )}
          {showResults && (
            <div className="mt-6 p-4 bg-blue-100 text-blue-800 rounded-md text-center final-score">
              <h3 className="text-xl font-bold">🎉 Score: {calculateScore()} / {quiz.length}</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   FORMULA GENERATOR
═══════════════════════════════════════════════════════════════ */
const FormulaGenerator = () => {
  const [chapter, setChapter] = useState('');
  const [classLevel, setClassLevel] = useState('10th Grade');
  const [competitiveLevel, setCompetitiveLevel] = useState('Olympiad');
  const [loading, setLoading] = useState(false);
  const [formulas, setFormulas] = useState(null);
  const [error, setError] = useState(null);
  const { isAuth } = UserData();

  const handleGenerateFormulas = async (e) => {
    e.preventDefault();
    if (!isAuth) {
      toast.error('Please log in to generate formulas.');
      return;
    }
    setLoading(true); setFormulas(null); setError(null);
    try {
      const res = await axios.post(`${server}/api/generate-formulas`, { chapter, class_level: classLevel, competitive_level: competitiveLevel });
      if (res.data.success) { setFormulas(res.data.formulas); toast.success('Formulas generated!'); }
      else { setError(res.data.message || 'Failed.'); toast.error(res.data.message || 'Failed.'); }
    } catch (err) {
      const msg = err.response?.data?.message || 'An unexpected error occurred.';
      setError(msg); toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-inner w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Generate Math Formulas</h2>
      <form onSubmit={handleGenerateFormulas} className="space-y-4 mb-8 max-w-lg mx-auto">
        <div>
          <label htmlFor="formula-chapter" className="block text-sm font-medium text-gray-700 mb-1">Chapter:</label>
          <input type="text" id="formula-chapter" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={chapter} onChange={e => setChapter(e.target.value)} placeholder="e.g., Quadratic Equations, Trigonometry" required />
        </div>
        <div>
          <label htmlFor="formula-class" className="block text-sm font-medium text-gray-700 mb-1">Grade:</label>
          <select id="formula-class" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={classLevel} onChange={e => setClassLevel(e.target.value)}>
            <option value="9th Grade">9th Grade</option>
            <option value="10th Grade">10th Grade</option>
            <option value="11th Grade">11th Grade</option>
            <option value="12th Grade">12th Grade</option>
          </select>
        </div>
        <div>
          <label htmlFor="formula-level" className="block text-sm font-medium text-gray-700 mb-1">Competitive Level:</label>
          <select id="formula-level" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={competitiveLevel} onChange={e => setCompetitiveLevel(e.target.value)}>
            <option value="Olympiad">Olympiad Level</option>
            <option value="JEE">JEE Level</option>
            <option value="Standard">Standard School Level</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 flex items-center justify-center font-semibold" disabled={loading}>
          {loading ? <><FaSpinner className="animate-spin mr-3" /> Generating…</> : '📐 Generate Formulas'}
        </button>
      </form>
      {error && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg"><p>{error}</p></div>}
      {formulas && formulas.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Generated Formulas:</h3>
          {formulas.map((f, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-lg bg-gray-50 formula-card">
              <p className="font-bold text-md text-gray-900 mb-1">{f.name}</p>
              <KaTeXRenderer latex={f.formula} />
              <p className="text-gray-700 text-sm">{f.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   RECOMMENDATION ENGINE
═══════════════════════════════════════════════════════════════ */
const RecommendationEngine = () => {
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = UserData();

  useEffect(() => {
    const fetch = async () => {
      const userId = user?._id;
      if (!userId) { setRecommendation("Please log in to get personalised recommendations."); setLoading(false); return; }
      setLoading(true); setError(null);
      try {
        const res = await axios.get(`${server}/api/get-recommendations/${userId}`);
        if (res.data.success) setRecommendation(res.data.recommendation);
        else { setError(res.data.message || 'Failed.'); toast.error(res.data.message || 'Failed.'); }
      } catch (err) {
        const msg = err.response?.data?.message || 'Error fetching recommendations.';
        setError(msg); toast.error(msg);
      } finally { setLoading(false); }
    };
    fetch();
  }, [user]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-inner w-full recommendation-main-card">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Learning Recommendation</h2>
      <div className="p-5 bg-blue-50 rounded-lg border border-blue-200 shadow-md">
        <h3 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
          <FaLightbulb className="mr-3 text-blue-500" /> Next Step:
        </h3>
        {loading
          ? <p className="text-blue-600 flex items-center"><FaSpinner className="animate-spin mr-2" /> Loading recommendation…</p>
          : error
            ? <p className="text-red-600">Error: {error}</p>
            : <p className="text-gray-800 text-lg">{recommendation}</p>}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   PERFORMANCE ANALYSIS
═══════════════════════════════════════════════════════════════ */
const PerformanceAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const PIE_COLORS = ['#4ade80', '#f87171'];

  const handleAnalysisRequest = async () => {
    setLoading(true); setError(null); setAnalysis(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) { toast.error('You must be logged in.'); setLoading(false); return; }
      const { data } = await axios.get(`${server}/api/user/performance-analysis`, { headers: { token } });
      if (data.success) { setAnalysis(data.analysis); toast.success('Analysis complete!'); }
      else { setError(data.message || 'Failed.'); toast.error(data.message || 'Failed.'); }
    } catch (err) {
      const msg = err.response?.data?.message || 'An unexpected error occurred.';
      setError(msg); toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-inner w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">AI Performance Analyst</h2>
      <p className="text-center text-gray-600 mb-6">
        Get a detailed analysis of your quiz history, visual charts, and a personalised study plan.
      </p>
      <div className="text-center mb-8">
        <button onClick={handleAnalysisRequest} disabled={loading}
          className="bg-purple-600 text-white font-bold py-3 px-8 rounded-full hover:bg-purple-700 focus:outline-none flex items-center justify-center mx-auto disabled:bg-gray-400 disabled:cursor-not-allowed transition-all">
          {loading ? <><FaSpinner className="animate-spin mr-3" />Analysing…</> : <><FaBrain className="mr-3" />Analyse My Performance</>}
        </button>
      </div>

      {analysis && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          {analysis.chartData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">Topic Performance (%)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analysis.chartData.topicPerformance} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="topic" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="averageScore" fill="#8884d8" name="Average Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">Overall Accuracy</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={analysis.chartData.overallStats} cx="50%" cy="50%"
                      outerRadius={100} dataKey="value" nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {analysis.chartData.overallStats.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaLightbulb className="mr-3 text-yellow-500" /> Your Personalised Report
          </h3>
          <MarkdownRenderer text={analysis.textReport} />
        </div>
      )}

      {error && (
        <div className="mt-8 p-4 bg-red-100 text-red-700 rounded-lg text-center">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   COMPONENT MAP
═══════════════════════════════════════════════════════════════ */
const TOOL_COMPONENTS = {
  quiz:           <QuizGenerator />,
  formula:        <FormulaGenerator />,
  recommendation: <RecommendationEngine />,
  analysis:       <PerformanceAnalysis />,
};

/* ══════════════════════════════════════════════════════════════
   MAIN  AITools PAGE
═══════════════════════════════════════════════════════════════ */
const AITools = () => {
  const [activeTab, setActiveTab] = useState('quiz');
  const activeTool = TOOLS.find(t => t.id === activeTab);

  return (
    <div className="ai-page">
      <Toaster position="top-center" />

      {/* ── Top Nav ── */}
      <header className="ai-topnav">
        <div className="ai-topnav-logo">
          <div className="ai-topnav-logo-icon"><FaRobot /></div>
          Samarpan AI Tools
        </div>
        <div className="ai-topnav-sep" />
        <span className="ai-topnav-badge">✨ AI Powered</span>
      </header>

      {/* ── Hero ── */}
      <section className="ai-hero">
        <div className="ai-hero-bg" />
        <div className="ai-hero-grid" />
        <div className="ai-hero-inner">
          <div className="ai-hero-pill">
            <FaBolt /> Smart Math Tools
          </div>
          <h1 className="ai-hero-title">
            Your AI-Powered<br />
            <span>Math Workspace</span>
          </h1>
          <p className="ai-hero-sub">
            Pick a tool below — generate quizzes, explore formulas, get
            personalised recommendations, or analyse your performance.
          </p>
        </div>
      </section>

      {/* ── Tool Launcher Cards ── */}
      <div className="ai-launcher">
        <p className="ai-launcher-label">Choose a Tool</p>
        <div className="ai-tool-grid">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              className={`ai-tool-card ${activeTab === tool.id ? 'active' : ''}`}
              style={{
                '--card-color':  tool.color,
                '--card-glow':   tool.glow,
                '--card-border': tool.border,
              }}
              onClick={() => setActiveTab(tool.id)}
              id={`tool-btn-${tool.id}`}
            >
              {/* Background watermark emoji */}
              <span className="ai-tool-card-watermark">{tool.emoji}</span>

              {/* Active badge */}
              <span className="ai-tool-card-badge">
                <FaCheckCircle /> Active
              </span>

              {/* Icon */}
              <div className="ai-tool-card-icon">
                <tool.icon />
              </div>

              {/* Text */}
              <div className="ai-tool-card-body">
                <p className="ai-tool-card-name">{tool.name}</p>
                <p className="ai-tool-card-hint">{tool.hint}</p>
                <p className="ai-tool-card-desc">{tool.desc}</p>
              </div>

              {/* Stat */}
              <div className="ai-tool-card-stat">
                <span className="ai-tool-stat-num">{tool.stat}</span>
                <span className="ai-tool-stat-lbl">{tool.statLbl}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Active Tool Panel ── */}
      <div className="ai-panel-wrap">

        {/* Panel header */}
        <div className="ai-panel-header">
          <div
            className="ai-panel-header-icon"
            style={{ background: activeTool.glow, color: activeTool.color }}
          >
            {activeTool.emoji}
          </div>
          <div className="ai-panel-header-text">
            <h2 className="ai-panel-title">{activeTool.name}</h2>
            <p className="ai-panel-desc">{activeTool.hint} · Powered by Gemini AI</p>
          </div>
          <div className="ai-panel-stat-group">
            <div className="ai-panel-stat-box">
              <span className="ai-psb-num" style={{ color: activeTool.color }}>{activeTool.stat}</span>
              <span className="ai-psb-lbl">{activeTool.statLbl}</span>
            </div>
          </div>
        </div>

        {/* Panel body */}
        <div className="ai-panel-body" key={activeTab}>
          {TOOL_COMPONENTS[activeTab]}
        </div>

      </div>
    </div>
  );
};

export default AITools;
