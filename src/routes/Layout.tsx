import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../components/common/Footer";
import Header from "@/components/common/Header";
import useAuthCheck from "@/hooks/useAuthCheck";
import Spinner from "@/components/common/Spinner";

const Layout = () => {
  const { user, isLoading, logout } = useAuthCheck();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
