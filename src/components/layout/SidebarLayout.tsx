import type { SidebarRole } from "@/config/sidebar.config";
import Sidebar from "@/components/layout/AppSidebar";

type Props = {
  role: SidebarRole;
  children: React.ReactNode;
  noPadding?: boolean;
};

const SidebarLayout = ({ role, children, noPadding = false }: Props) => {
  return (
    <div className="flex flex-1 h-full min-h-0 bg-[#050017] overflow-hidden">
      <Sidebar role={role} />
      <main
        className={`flex-1 min-h-0 ${
          noPadding
            ? "p-0 h-full flex flex-col overflow-hidden"
            : "p-10 overflow-y-auto"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default SidebarLayout;
