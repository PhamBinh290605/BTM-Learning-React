import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./src/assets/auth/page/login";
import RegisterPage from "./src/assets/auth/page/register";
import AuthPage from "./src/assets/auth";
import AdminPage from "./src/assets/admin";
import PlaceholderPage from "./src/assets/admin/components/PlaceholderPage";
import DashboardPage from "./src/assets/admin/pages/dashBoard";
import QuizSystem from "./src/assets/admin/pages/Quiz";
import QuestionEditor from "./src/assets/admin/pages/Question";
import CreateLesson from "./src/assets/admin/pages/lesson";
import CourseManagement from "./src/assets/admin/pages/Courses";
import CreateCourse from "./src/assets/admin/pages/CreateCourse";
import UserManagement from "./src/assets/admin/pages/Student";
import NotificationManagement from "./src/assets/admin/pages/Notification";
import UserPage from "./src/assets/user";
import HomePage from "./src/assets/user/pages/HomePage";
import MyCourses from "./src/assets/user/pages/MyCourse";
import LandingPage from "./src/assets/user/pages/LandingPage";
import ChatbotPage from "./src/assets/components/Chatbot";
import CertificateManagement from "./src/assets/admin/pages/Certificate";
import MyCertificates from "./src/assets/user/pages/Certificate";
import MyProfile from "./src/assets/components/MyProfile";

const AppRouter = () => {
  const appRoutes = [
    {
      path: "/auth",
      element: <AuthPage />,
      children: [
        { path: "login", element: <LoginPage /> },
        { path: "register", element: <RegisterPage /> },
      ],
    },
    {
      path: "/",
      element: <UserPage />,
      children: [
        {
          index: true,
          element: <LandingPage />,
        },
        { path: "home", element: <HomePage /> },
        { path: "courses", element: <MyCourses /> },
        { path: "/ai", element: <ChatbotPage /> },
        { path: "/certificates", element: <MyCertificates /> },
        { path: "/profile", element: <MyProfile /> },
      ],
    },
    {
      path: "/admin",
      element: <AdminPage />,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: "dashboard", element: <DashboardPage /> },
        { path: "courses", element: <CourseManagement /> },
        { path: "courses/update/:id", element: <CreateCourse /> },
        { path: "lessons", element: <CreateLesson /> },
        { path: "quiz", element: <QuizSystem /> },
        { path: "quiz/questions", element: <QuestionEditor /> },
        { path: "chat-bot", element: <ChatbotPage /> },
        { path: "student", element: <UserManagement /> },
        { path: "certificate", element: <CertificateManagement /> },
        { path: "notifications", element: <NotificationManagement /> },
        { path: "profile", element: <MyProfile /> },
      ],
    },
    { path: "*", element: <PlaceholderPage /> },
  ];

  const renderRoutes = (routes) => {
    return routes.map((route, i) => (
      <Route
        key={i}
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
