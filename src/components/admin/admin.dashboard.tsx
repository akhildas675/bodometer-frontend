
import { useAuthStore } from "../../stores/auth.store";
import SidebarLayout from "../ui/app.sidebar/sidebar.layout";

const AdminDashboard = () => {
  const role = useAuthStore((state) => state.user?.role);

  if (!role) return null; 




  return (
    <SidebarLayout role={role}>
      <div className="text-white">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
    
        </div>

        
          
      </div>
    </SidebarLayout>
  );
};

export default AdminDashboard;
