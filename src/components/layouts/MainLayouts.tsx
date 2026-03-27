import Footer from "./user.layouts.ts/footer";
import { Outlet } from "react-router-dom";
import Navbar from "./user.layouts.ts/navbar";
import Sidebar from "@/components/ui/app.sidebar/sidebar";
import { useAuthStore } from "@/stores/auth.store";
import type { SidebarRole } from "@/config/sidebar.config";
 
const MainLayouts = () => {
  const user = useAuthStore((state) => state.user);
 
  return (
    <div className="min-h-screen flex flex-col bg-[#050017]">
      {/* Fixed top navbar */}
      <Navbar />
 
      {/* pt-[88px] clears the fixed navbar */}
      <div className="flex flex-1 pt-[88px]">
        <Sidebar role={(user?.role as SidebarRole)} />
        <main className="flex-1 overflow-y-auto p-10">
          <Outlet />
        </main>
      </div>
 
      <Footer />
    </div>
  );
};
 
export default MainLayouts;
 