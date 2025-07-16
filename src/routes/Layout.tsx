import { Outlet } from "react-router-dom";
import Footer from "../components/common/footer";
import Header from "@/components/common/Header";
const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
