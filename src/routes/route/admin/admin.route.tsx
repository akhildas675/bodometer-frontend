import { Route } from "react-router-dom";
import ProtectedRoute from "@/routes/guard.routes/protected.route";
import AdminDashboardPage from "@/pages/admin/admin-dashboard.page";
import AdminUsersPage from "@/pages/admin/admin-users.page";
import AdminTrainersPage from "@/pages/admin/admin-trainers.page";

import AdminTrainerOnboardingPage from "@/pages/admin/admin-trainer-onboarding.page";
import AdminAppointmentDetailsPage from "@/pages/admin/admin.appointment-details.page";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";

import MainSidebarLayout from "@/components/layouts/main-sidebar.layout";
import AdminCategoryListPage from "@/pages/admin/admin.category-list.page";
import AdminCategoryFormPage from "@/pages/admin/admin.category-form.page";


export const adminRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
    <Route element={<MainSidebarLayout/>}>

    <Route path={ADMIN_UI_ROUTES.DASHBOARD} element={<AdminDashboardPage />} />
    <Route path={ADMIN_UI_ROUTES.USERS} element={<AdminUsersPage />} />
    <Route path={ADMIN_UI_ROUTES.TRAINERS} element={<AdminTrainersPage />} />
    <Route path={ADMIN_UI_ROUTES.TRAINER_APPOINTMENT_LIST} element={<AdminTrainerOnboardingPage />} />
    <Route path={ADMIN_UI_ROUTES.APPOINTMENT_DETAILS_PATH} element={<AdminAppointmentDetailsPage />} />
    <Route path={ADMIN_UI_ROUTES.CATEGORY} element={<AdminCategoryListPage />} />
    <Route path={ADMIN_UI_ROUTES.CATEGORY_CREATE} element={<AdminCategoryFormPage />} />
    <Route path={ADMIN_UI_ROUTES.CATEGORY_EDIT_PATH} element={<AdminCategoryFormPage />} />


    </Route>
  </Route>
);