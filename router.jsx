import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./src/assets/auth/page/login";
import RegisterPage from "./src/assets/auth/page/register";
import AuthPage from "./src/assets/auth";
import AdminPage from "./src/assets/admin";
import Courses from "./src/assets/admin/pages/Courses";
import Lesson from "./src/assets/admin/pages/lesson";
import Quiz from "./src/assets/admin/pages/Quiz";
import ChatbotPage from "./src/assets/admin/pages/Chatbot";
import PlaceholderPage from "./src/assets/admin/components/PlaceholderPage";
import DashboardPage from "./src/assets/admin/pages/dashBoard";

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
        { path: "courses", element: <Courses /> },
        { path: "lessons", element: <Lesson /> },
        { path: "quiz", element: <Quiz /> },
        { path: "chat-bot", element: <ChatbotPage /> },
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
