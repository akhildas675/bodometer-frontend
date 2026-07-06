import type { SidebarRole } from "@/config/sidebar.config";
import Sidebar from "./sidebar";

type Props = {
  role: SidebarRole;
  children: React.ReactNode;
};

const SidebarLayout = ({ role, children }: Props) => {
  return (
    <div className="flex flex-1 min-h-screen bg-[#050017]">
      <Sidebar role={role} />
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
};

export default SidebarLayout;
