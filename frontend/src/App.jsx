import React from "react";
import "./App.css";
// Import BrowserRouter and add 'unstable_useBlocker' if you use it, otherwise just BrowserRouter
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Verify from "./pages/auth/Verify";
import Footer from "./components/footer/Footer";
import About from "./pages/about/About";
import Account from "./pages/account/Account";
import { UserData } from "./context/UserContext";
import Loading from "./components/loading/Loading";
import Courses from "./pages/courses/Courses";
import CourseDescription from "./pages/coursedescription/CourseDescription";
import PaymentSuccess from "./pages/paymentsuccess/PaymentSuccess";
import Dashbord from "./pages/dashboard/Dashboard";
import CourseStudy from "./pages/coursestudy/CourseStudy";
import Lecture from "./pages/lecture/Lecture";
import AdminDashbord from "./admin/Dashboard/AdminDashboard";
import AdminCourses from "./admin/Courses/AdminCourses";
import AdminUsers from "./admin/Users/AdminUsers";
import AddCourse from "./admin/Courses/AddCourse";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AITools from "./pages/aitools/AITools";
import ScrollToTop from "./components/utils/ScrollToTop"; // Import ScrollToTop

const App = () => {
  const { isAuth, user, loading } = UserData();
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        // Added future flags to BrowserRouter
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <Header isAuth={isAuth} />
          <Routes>
            <Route path="/" element={<Home isAuth={isAuth} user={user} />} /> 
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            
            <Route
              path="/ai-tools"
              element={isAuth ? <AITools /> : <Login />}
            />

            <Route
              path="/account"
              element={isAuth ? <Account user={user} /> : <Login />}
            />
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route
              path="/register"
              element={isAuth ? <Home /> : <Register />}
            />
            <Route path="/verify" element={isAuth ? <Home /> : <Verify />} />
            <Route
              path="/forgot"
              element={isAuth ? <Home /> : <ForgotPassword />}
            />
            <Route
              path="/reset-password/:token"
              element={isAuth ? <Home /> : <ResetPassword />}
            />
            <Route
              path="/course/:id"
              element={isAuth ? <CourseDescription user={user} /> : <Login />}
            />
            <Route
              path="/payment-success/:id"
              element={isAuth ? <PaymentSuccess user={user} /> : <Login />}
            />
            <Route
              path="/:id/dashboard"
              element={isAuth ? <Dashbord user={user} /> : <Login />}
            />
            <Route
              path="/course/study/:id"
              element={isAuth ? <CourseStudy user={user} /> : <Login />}
            />

            <Route
              path="/lectures/:id"
              element={isAuth ? <Lecture user={user} /> : <Login />}
            />

            <Route
              path="/admin/dashboard"
              element={isAuth ? <AdminDashbord user={user} /> : <Login />}
            />

            <Route
              path="/admin/course"
              element={isAuth ? <AdminCourses user={user} /> : <Login />}
            />
            
            <Route
              path="/admin/course/add"
              element={isAuth ? <AddCourse user={user} /> : <Login />}
            />

            <Route
              path="/admin/users"
              element={isAuth ? <AdminUsers user={user} /> : <Login />}
            />
          </Routes>
          <Footer />
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
