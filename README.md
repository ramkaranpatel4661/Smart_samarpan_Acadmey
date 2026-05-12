<div align="center">
  <h1>🎓 Samarpan Math Academy</h1>
  <p>An intelligent, full-stack educational platform empowering students to master mathematics through AI-driven insights, interactive quizzes, and seamless course management.</p>

  <p><strong>🌐 Live Demo:</strong> <a href="https://smart-samarpan-acadmey-git-main-ramkaran-patels-projects.vercel.app/">Smart Samarpan Academy</a></p>

  <!-- Add Badges -->
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" alt="Gemini" />
  </p>
</div>

---

## 🚀 Key Features

### 🤖 AI-Powered Learning Hub
- **Dynamic Quiz Generation:** Instant, custom-generated MCQs using Google Gemini AI, tailored to specific topics and difficulty levels.
- **Formula Generator:** AI-assisted tool for generating and explaining complex mathematical formulas.
- **Smart Recommendations:** Personalized learning paths based on student performance.
- **Performance Analysis:** Deep insights into student strengths and areas for improvement.

### 📚 Comprehensive Course Management
- **Structured Curriculum:** Dedicated mathematics content tailored for Classes 9 through 12.
- **Premium Content:** Exclusive access to advanced materials and video lectures for enrolled students.
- **Progress Tracking:** Visual indicators of course completion and quiz scores.

### 👨‍💻 Modern Admin Dashboard
- **Premium UI:** A sophisticated, dark-themed glassmorphism interface for administrative tasks.
- **User Management:** Real-time search, filtering, and role-based access control (Student/Admin).
- **Course Administration:** Intuitive tools to create, update, and organize course materials seamlessly.

### 🔐 Robust Security & Authentication
- **Multi-Auth System:** Support for secure Email/Password login and one-click Google OAuth integration.
- **Role-Based Access Control (RBAC):** Distinct dashboards and permissions for administrators and students.

## 🛠️ Technology Stack

### Frontend
- **Framework:** React.js powered by Vite for lightning-fast builds.
- **Styling:** Tailwind CSS for a modern, responsive, and highly customizable UI.
- **Math Rendering:** `react-katex` for flawless mathematical formula presentation.

### Backend
- **Runtime:** Node.js with Express.js framework.
- **Database:** MongoDB for scalable, document-oriented data storage.
- **AI Integration:** Google Gemini API for dynamic content generation.

### Deployment
- **Frontend:** Hosted on Vercel for high global availability.
- **Backend:** Deployed on Render with optimized rate limiting and CORS configuration.

## 📂 Project Architecture

```text
Samarpan_math_academy/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── admin/            # Admin dashboard components
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Main application pages
│   │   └── ...
│   └── package.json
├── server/                   # Express backend
│   ├── controllers/          # Request handling logic
│   ├── database/             # MongoDB connection setup
│   ├── middlewares/          # Authentication & routing middleware
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API endpoints
│   ├── index.js              # Server entry point
│   └── package.json
└── README.md
```

## ⚙️ Local Development Setup

Follow these steps to run the application locally:

### 1. Clone the repository
```bash
git clone https://github.com/ramkaranpatel4661/Smart_samarpan_Acadmey.git
cd Smart_samarpan_Acadmey
```

### 2. Setup the Backend Server
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add your environment variables:
```env
PORT=...
MONGO_URI=...
JWT_SECRET=...
GEMINI_API_KEY=...
GOOGLE_CLIENT_ID=...
```
Start the server:
```bash
npm run dev
```

### 3. Setup the Frontend Application
Open a new terminal window:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:<YOUR_BACKEND_PORT>
VITE_GOOGLE_CLIENT_ID=...
```
Start the frontend development server:
```bash
npm run dev
```

## 🤝 Contributing

We welcome contributions! If you'd like to improve the project:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).
