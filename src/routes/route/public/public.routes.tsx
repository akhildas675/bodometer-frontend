import { Route } from "react-router-dom";
import MainLayouts from "../../../components/layouts/MainLayouts";
import UserHomePage from "../../../pages/user/user-home.page";
import PublicGuard from "../../guard.routes/public-guard.routes";


export const publicRoutes = (
  <Route element={<PublicGuard />}>
    <Route element={<MainLayouts />}>
      <Route path="/" element={<UserHomePage />} />
    </Route>
  </Route>
);
