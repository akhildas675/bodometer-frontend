import { Outlet } from "react-router-dom";

const ChatLayout = () => {
  return (
    <div className="h-screen w-screen bg-[#050017] overflow-hidden">
      <Outlet />
    </div>
  );
};

export default ChatLayout;
