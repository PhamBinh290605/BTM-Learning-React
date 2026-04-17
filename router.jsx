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
    { path: "/home", element: <div>Home</div> },
    { path: "/category", element: <div>Category</div> },
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
      ],
    },
    { path: "*", element: <PlaceholderPage /> },
  ];

  const renderRoutes = (routes) => {
    return routes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element}>
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
