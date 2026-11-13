import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
 
const MainLayoutsNoSidebar = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#050017]">
      <Navbar />
      <main className="flex-1 pt-[76px] sm:pt-[92px] md:pt-[100px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
 
export default MainLayoutsNoSidebar;