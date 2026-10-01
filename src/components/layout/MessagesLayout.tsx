import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import type { SidebarRole } from "@/config/sidebar.config";
import SidebarLayout from "@/components/layout/SidebarLayout";
import Navbar from "@/components/layout/Navbar";

const MessagesLayout = () => {
  const user = useAuthStore((state) => state.user);
  const isUser = user?.role === "user";

  return (
    <div className="h-screen max-h-screen flex flex-col bg-[#050017] overflow-hidden">
      {/* Fixed top navbar */}
      {isUser && <Navbar />}

      <div
        className={`flex flex-1 min-h-0 overflow-hidden ${
          isUser ? "pt-[88px] md:pt-[88px]" : ""
        }`}
      >
        <SidebarLayout role={(user?.role as SidebarRole) || "user"} noPadding>
          <Outlet />
        </SidebarLayout>
      </div>
    </div>
  );
};

export default MessagesLayout;
