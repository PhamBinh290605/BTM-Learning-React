import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./src/assets/auth/page/login";
import RegisterPage from "./src/assets/auth/page/register";
import AuthPage from "./src/assets/auth";
import AdminPage from "./src/assets/admin";
import InstructorPage from "./src/assets/instructor";
import InstructorDashboard from "./src/assets/instructor/pages/InstructorDashboard";
import PlaceholderPage from "./src/assets/admin/components/PlaceholderPage";
import DashboardPage from "./src/assets/admin/pages/DashBoard";
import QuizSystem from "./src/assets/admin/pages/Quiz";
import QuestionEditor from "./src/assets/admin/pages/Question";
import CreateLesson from "./src/assets/admin/pages/Lesson";
import CourseManagement from "./src/assets/admin/pages/Courses";
import CreateCourse from "./src/assets/admin/pages/CreateCourse";
import UserManagement from "./src/assets/admin/pages/Student";
import NotificationManagement from "./src/assets/admin/pages/Notification";
import RevenuePage from "./src/assets/admin/pages/Revenue";
import CertificateManagement from "./src/assets/admin/pages/Certificate";
import PaymentPage from "./src/assets/admin/pages/Payment";
import CategoryManagement from "./src/assets/admin/pages/CategoryManagement";
import VoucherManagement from "./src/assets/admin/pages/VoucherManagement";
import MyProfile from "./src/assets/components/MyProfile";
import ProtectedRoute from "./src/assets/components/ProtectedRoute";

// User (Guest/Student) imports
import UserPage from "./src/assets/user";
import HomePage from "./src/assets/user/pages/HomePage";
import CourseCatalog from "./src/assets/user/pages/CourseCatalog";
import CourseDetail from "./src/assets/user/pages/CourseDetail";
import LearningPlayer from "./src/assets/user/pages/LearningPlayer";
import PaymentReturn from "./src/assets/user/pages/PaymentReturn";
import StudentDashboard from "./src/assets/user/pages/StudentDashboard";
import MyLearning from "./src/assets/user/pages/MyLearning";
import ProfilePage from "./src/assets/user/pages/ProfilePage";
import CertificatesPage from "./src/assets/user/pages/CertificatesPage";
import CertificateVerify from "./src/assets/user/pages/CertificateVerify";

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
        { path: "payment-return", element: <PaymentReturn /> },
        { path: "dashboard", element: <StudentDashboard /> },
        { path: "my-learning", element: <MyLearning /> },
        { path: "profile", element: <ProfilePage /> },
        { path: "certificates", element: <CertificatesPage /> },
        { path: "verify-certificate", element: <CertificateVerify /> },
        { path: "about", element: <PlaceholderPage /> },
      ],
    },

    // Learning Player (no header/footer - fullscreen)
    { path: "/learning/:id", element: <LearningPlayer /> },

    // Admin/Instructor routes
    {
      path: "/admin",
      element: (
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminPage />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <DashboardPage /> },
        { path: "dashboard", element: <DashboardPage /> },
        { path: "courses", element: <CourseManagement /> },
        { path: "courses/update/:id", element: <CreateCourse /> },
        { path: "lessons", element: <CreateLesson /> },
        { path: "quiz", element: <QuizSystem /> },
        { path: "quiz/questions", element: <QuestionEditor /> },
        { path: "student", element: <UserManagement /> },
        { path: "certificate", element: <CertificateManagement /> },
        { path: "categories", element: <CategoryManagement /> },
        { path: "vouchers", element: <VoucherManagement /> },
        { path: "payment", element: <PaymentPage /> },
        { path: "notifications", element: <NotificationManagement /> },
        { path: "profile", element: <MyProfile /> },
        { path: "revenue", element: <RevenuePage /> },
      ],
    },

    // Instructor routes
    {
      path: "/instructor",
      element: (
        <ProtectedRoute allowedRoles={["INSTRUCTOR", "ADMIN"]}>
          <InstructorPage />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <InstructorDashboard /> },
        { path: "dashboard", element: <InstructorDashboard /> },
        { path: "courses", element: <CourseManagement /> },
        { path: "courses/update/:id", element: <CreateCourse /> },
        { path: "lessons", element: <CreateLesson /> },
        { path: "quiz", element: <QuizSystem /> },
        { path: "quiz/questions", element: <QuestionEditor /> },
        { path: "vouchers", element: <VoucherManagement /> },
        { path: "notifications", element: <NotificationManagement /> },
        { path: "revenue", element: <RevenuePage /> },
        { path: "profile", element: <MyProfile /> },
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
