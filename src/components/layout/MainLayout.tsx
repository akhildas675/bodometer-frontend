import Footer from "@/components/layout/Footer";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { useAuthStore } from "@/stores/auth.store";
import type { SidebarRole } from "@/config/sidebar.config";
import SidebarLayout from "@/components/layout/SidebarLayout";

 
const MainLayouts = () => {
  const user = useAuthStore((state) => state.user);
  const isUser = user?.role === "user";
 
  return (
    <div className="min-h-screen flex flex-col bg-[#050017]">
      {/* Fixed top navbar */}
      {isUser && <Navbar />}
 
      {/* pt-[88px] clears the fixed navbar */}
      <div className={`flex flex-1 ${isUser ? "pt-[88px]" : ""}`}>
        <SidebarLayout role={(user?.role as SidebarRole) || "user"}>
          <Outlet />
        </SidebarLayout>
      </div>
 
      <Footer />
    </div>
  );
};
 
export default MainLayouts;
 