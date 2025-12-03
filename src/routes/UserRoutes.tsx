import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayouts from "../components/layouts/MainLayouts";
import RegisterPage from "../pages/user/RegisterPage";
import HomePage from "../pages/user/HomePage";



const UserRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes with layout (Navbar + Footer) */}
        <Route element={<MainLayouts/>}>
          <Route path="/" element={<HomePage/>} />
        </Route>

        {/* Routes WITHOUT layout */}
        <Route path="/register" element={<RegisterPage/>} />
       
      </Routes>
    </BrowserRouter>
  );
};

export default UserRoutes;
