import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./src/assets/auth/page/login";
import RegisterPage from "./src/assets/auth/page/register";
import AuthPage from "./src/assets/auth";
import AdminPage from "./src/assets/admin";
import ChatbotPage from "./src/assets/admin/pages/Chatbot";
import PlaceholderPage from "./src/assets/admin/components/PlaceholderPage";
import DashboardPage from "./src/assets/admin/pages/dashBoard";
import QuizSystem from "./src/assets/admin/pages/Quiz";
import QuestionEditor from "./src/assets/admin/pages/Question";
import CreateLesson from "./src/assets/admin/pages/lesson";
import CourseManagement from "./src/assets/admin/pages/Courses";
import CreateCourse from "./src/assets/admin/pages/CreateCourse";
import UserManagement from "./src/assets/admin/pages/Student";
import MyCertificates from "./src/assets/admin/pages/Certificate";
import NotificationManagement from "./src/assets/admin/pages/Notification";
import MyProfile from "./src/assets/admin/pages/MyProfile";
import RevenuePage from "./src/assets/admin/pages/Revenue";

// User (Guest/Student) imports
import UserPage from "./src/assets/user";
import HomePage from "./src/assets/user/pages/HomePage";
import CourseCatalog from "./src/assets/user/pages/CourseCatalog";
import CourseDetail from "./src/assets/user/pages/CourseDetail";
import LearningPlayer from "./src/assets/user/pages/LearningPlayer";
import StudentDashboard from "./src/assets/user/pages/StudentDashboard";
import MyLearning from "./src/assets/user/pages/MyLearning";
import ProfilePage from "./src/assets/user/pages/ProfilePage";
import CertificatesPage from "./src/assets/user/pages/CertificatesPage";

const AppRouter = () => {
  const appRoutes = [
    // Auth routes
    {
      path: "/auth",
      element: <AuthPage />,
      children: [
        { path: "login", element: <LoginPage /> },
        { path: "register", element: <RegisterPage /> },
      ],
    },

    // User (Guest/Student) routes
    {
      path: "/",
      element: <UserPage />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "courses", element: <CourseCatalog /> },
        { path: "course/:id", element: <CourseDetail /> },
        { path: "dashboard", element: <StudentDashboard /> },
        { path: "my-learning", element: <MyLearning /> },
        { path: "profile", element: <ProfilePage /> },
        { path: "certificates", element: <CertificatesPage /> },
        { path: "about", element: <PlaceholderPage /> },
      ],
    },

    // Learning Player (no header/footer - fullscreen)
    { path: "/learning/:id", element: <LearningPlayer /> },

    // Admin/Instructor routes
    {
      path: "/admin",
      element: <AdminPage />,
      children: [
        { path: "dashboard", element: <DashboardPage /> },
        { path: "courses", element: <CourseManagement /> },
        { path: "courses/create", element: <CreateCourse /> },
        { path: "lessons", element: <CreateLesson /> },
        { path: "quiz", element: <QuizSystem /> },
        { path: "quiz/questions", element: <QuestionEditor /> },
        { path: "chat-bot", element: <ChatbotPage /> },
        { path: "student", element: <UserManagement /> },
        { path: "certificate", element: <MyCertificates /> },
        { path: "notifications", element: <NotificationManagement /> },
        { path: "profile", element: <MyProfile /> },
        { path: "revenue", element: <RevenuePage /> },
      ],
    },

    // Fallback
    { path: "*", element: <PlaceholderPage /> },
  ];

  const renderRoutes = (routes) => {
    return routes.map((route, index) => (
      <Route
        key={index}
        path={route.path}
        element={route.element}
        index={route.index}
      >
        {route.children && renderRoutes(route.children)}
      </Route>
    ));
  };

  return (
    <BrowserRouter>
      <Routes>{renderRoutes(appRoutes)}</Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
