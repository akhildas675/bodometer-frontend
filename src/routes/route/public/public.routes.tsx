import { Route } from "react-router-dom";
import UserHomePage from "@/pages/user/user-home.page";
import PublicGuard from "../../guard.routes/public-guard.routes";
import MainLayoutsNoSidebar from "@/components/layouts/user.layouts.ts/MainLayoutsNoSidebar";


export const publicRoutes = (
  <Route element={<PublicGuard />}>
    <Route element={<MainLayoutsNoSidebar />}>
      <Route path="/" element={<UserHomePage />} />
    </Route>
  </Route>
);
