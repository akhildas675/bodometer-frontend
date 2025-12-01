import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/user/Home";
import UserRegisterPage from "../pages/user/UserRegisterPage";
import MainLayouts from "../components/layouts/MainLayouts";


const UserRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes with layout (Navbar + Footer) */}
        <Route element={<MainLayouts/>}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Routes WITHOUT layout */}
        <Route path="/register" element={<UserRegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default UserRoutes;
