import { Route } from "react-router-dom";
import ProtectedRoute from "../../guard.routes/protected.route";
import AdminDashboardPage from "../../../pages/admin/admin-dashboard.page";
import AdminUsersPage from "../../../pages/admin/admin-users.page";
import AdminTrainersPage from "../../../pages/admin/admin-trainers.page";
import AdminWorkoutsManagement from "../../../pages/admin/admin-workouts.management";
import AdminTrainerOnboardingPage from "../../../pages/admin/admin-trainer-onboarding.page";
import AdminAppointmentDetailsPage from "../../../pages/admin/admin.appointment-details.page";


export const adminRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
    <Route path="/admin/users" element={<AdminUsersPage />} />
    <Route path="/admin/trainers" element={<AdminTrainersPage/>}/>
    <Route path="/admin/workouts" element={<AdminWorkoutsManagement/>}/>
    <Route path="/admin/trainer-appointment-list" element={<AdminTrainerOnboardingPage/>} />
    <Route path="/admin/appointment-details/:profileId" element={<AdminAppointmentDetailsPage/>}/>
  </Route>
);
