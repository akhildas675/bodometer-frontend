import Footer from "@/components/layout/Footer";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { useAuthStore } from "@/stores/auth.store";
import type { SidebarRole } from "@/config/sidebar.config";
import SidebarLayout from "@/components/layout/SidebarLayout";

const MainLayouts = () => {
  const user = useAuthStore((state) => state.user);

  const isUser = user?.role === "user";
  const showNavbar = !user || isUser;
  const { pathname } = useLocation();
  // Home hero is full-bleed — navbar floats over it, no top offset
  const isHome = pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-[#050017]">
      {/* Fixed top navbar */}
      {showNavbar && <Navbar />}

      <div
        className={`flex flex-1 min-h-0 ${
          showNavbar && !isHome ? "pt-[72px] sm:pt-[88px] md:pt-[88px]" : ""
        }`}
      >
        <SidebarLayout role={(user?.role as SidebarRole) || "user"}>
          <Outlet />
        </SidebarLayout>
      </div>

      <Footer />
    </div>
  );
};

export default MainLayouts;