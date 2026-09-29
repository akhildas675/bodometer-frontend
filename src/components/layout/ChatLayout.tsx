import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";

const ChatLayout = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="h-screen w-screen bg-[#050017] overflow-hidden">
      <Outlet />
    </div>
  );
};

export default ChatLayout;
