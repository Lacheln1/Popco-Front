import { Outlet } from "react-router-dom";
import Footer from "../components/common/footer";
const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
