
import Footer from "./user.layouts.ts/footer";
import { Outlet } from "react-router-dom";
import Navbar from "./user.layouts.ts/navbar";


const MainLayouts = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayouts;
