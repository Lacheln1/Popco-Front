import { Outlet } from "react-router-dom";
import Footer from "../components/common/Footer";
const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
