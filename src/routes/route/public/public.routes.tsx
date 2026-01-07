import { Routes, Route } from "react-router-dom";
import MainLayouts from "../../../components/layouts/MainLayouts";
import UserHomePage from "../../../pages/user/user-home.page";
import RoleRedirectRoute from "../../guard.routes/role-redirect.route";

const PublicRoutes = () => {
  return (
    <Routes>
      <Route element={<RoleRedirectRoute />}>
        <Route element={<MainLayouts />}>
          <Route path="/" element={<UserHomePage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default PublicRoutes;
