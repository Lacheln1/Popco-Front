import { Outlet } from "react-router-dom";
import Footer from "../components/common/Footer";
import Header from "@/components/common/Header";
const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <button className="animate-bounce-chatbot fixed bottom-10 right-0 z-50 w-[80px] sm:bottom-12 sm:right-10 sm:w-[130px] lg:right-28">
        <img src="/images/main/chatbot.svg" alt="chatbot" />
      </button>
      <Footer />
    </div>
  );
};

export default Layout;
