
import Sidebar from '../ui/app.sidebar/sidebar';
import { SidebarRole } from '@/config/sidebar.config';
import { Outlet } from 'react-router-dom';
import Footer from './user.layouts.ts/footer';
import { useAuthStore } from "@/stores/auth.store";
const MainSidebarLayout = () => {
     const user = useAuthStore((state) => state.user);
    return (
       <div className="min-h-screen flex flex-col bg-[#050017]">
      {/* Fixed top navbar */}
    
 
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
}

export default MainSidebarLayout;
