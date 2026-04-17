import { Outlet } from "react-router-dom";
import Header from "./layout/header";
import Footer from "./layout/footer";

const UserPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserPage;
