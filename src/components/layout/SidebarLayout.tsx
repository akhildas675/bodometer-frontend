import type { SidebarRole } from "@/config/sidebar.config";
import Sidebar from "@/components/layout/AppSidebar";

type Props = {
  role: SidebarRole;
  children: React.ReactNode;
};

const SidebarLayout = ({ role, children }: Props) => {
  return (
    <div className="flex flex-1 h-full bg-[#050017]">
      <Sidebar role={role} />
      <main className="flex-1 min-h-0 p-10">{children}</main>
    </div>
  );
};

export default SidebarLayout;
