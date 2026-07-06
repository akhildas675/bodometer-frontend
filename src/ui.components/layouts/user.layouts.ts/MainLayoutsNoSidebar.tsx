import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";
 
const MainLayoutsNoSidebar = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#050017]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
 
export default MainLayoutsNoSidebar;