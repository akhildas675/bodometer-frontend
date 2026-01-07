import { Outlet } from "react-router-dom";

const AuthLayouts = () => {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
};

export default AuthLayouts;
