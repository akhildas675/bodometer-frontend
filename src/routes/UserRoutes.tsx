import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayouts from "../components/layouts/MainLayouts";
import Home from "../pages/user/Home";

const UserRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayouts />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default UserRoutes