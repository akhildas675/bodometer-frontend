import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import type { SidebarRole } from "@/config/sidebar.config";
import SidebarLayout from "@/components/layout/SidebarLayout";
import Navbar from "@/components/layout/Navbar";

const MessagesLayout = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen flex flex-col bg-[#050017]">
      {/* Fixed top navbar */}
      {user?.role === "user" && <Navbar />}

      <div
        className={`flex flex-1 min-h-0 ${
          user?.role === "user" ? "pt-[88px] md:pt-[88px]" : ""
        }`}
      >
        <SidebarLayout role={(user?.role as SidebarRole) || "user"}>
          <Outlet />
        </SidebarLayout>
      </div>
    </div>
  );
};

export default MessagesLayout;
