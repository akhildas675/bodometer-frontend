import { Outlet } from "react-router-dom";

const VideoCallLayout = () => {
  return (
    <div className="h-screen w-screen bg-[#03000D] overflow-hidden">
      <Outlet />
    </div>
  );
};

export default VideoCallLayout;
