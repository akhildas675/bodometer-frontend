import { useLocation } from "react-router-dom";
import type { SidebarRole } from "@/config/sidebar.config";
import Sidebar from "@/components/layout/AppSidebar";

type Props = {
  role: SidebarRole;
  children: React.ReactNode;
  noPadding?: boolean;
};

const SidebarLayout = ({ role, children, noPadding = false }: Props) => {
  const { pathname } = useLocation();
  // Home hero is full-bleed — no content padding on "/"
  const isHome = pathname === "/";

  return (
    <div className="flex flex-1 h-full min-h-0 bg-[#050017] overflow-hidden relative">
      <main
        className={`flex-1 min-h-0 ${
          noPadding || isHome
            ? "p-0 overflow-y-auto"
            : "p-4 sm:p-6 lg:p-8 overflow-y-auto"
        }`}
      >
        {children}
      </main>
      <Sidebar role={role} />
    </div>
  );
};

export default SidebarLayout;
