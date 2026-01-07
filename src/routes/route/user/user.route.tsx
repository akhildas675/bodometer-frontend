import { Route, Routes } from "react-router-dom";
import MainLayouts from "../../../components/layouts/MainLayouts";
import UserProfilePage from "../../../pages/user/user-profile.page";
import ProtectedRoute from "../../guard.routes/protected.route";



const UserRoute = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route element={<MainLayouts />}>
          <Route path="/user-profile" element={<UserProfilePage/>} />
        </Route>
      </Route>
    </Routes>
  );
};

export default UserRoute;
