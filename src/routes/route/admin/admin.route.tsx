import { Route } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "@/routes/guard.routes/protected.route";
import AdminDashboardPage from "@/pages/admin/admin-dashboard.page";
import AdminUsersPage from "@/pages/admin/admin-users.page";
import AdminTrainersPage from "@/pages/admin/admin-trainers.page";
import AdminTrainerOnboardingPage from "@/pages/admin/admin-trainer-onboarding.page";
import AdminAppointmentDetailsPage from "@/pages/admin/admin.appointment-details.page";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";
import MainSidebarLayout from "@/components/layouts/main-sidebar.layout";
import AdminCategoryListPage from "@/features/admin/pages/admin.category-list.page";
import AdminCategoryFormPage from "@/features/admin/pages/admin.category-form.page";
import AdminSubscriptionFeatureListPage from "@/pages/admin/admin-subscription.feature-list.page";
import AdminSubscriptionFeatureFormPage from "@/pages/admin/admin.subscription-feature.form.page";
import AdminSubscriptionPlanListPage from "@/pages/admin/admin-subscription.plan-list.page";
import AdminSubscriptionPlanFormPage from "@/pages/admin/admin-subscription.plan-form.page";
import AdminSubscriptionTransactionListPage from "@/pages/admin/admin-subscription.transaction-list.page";
import AdminQuestionGroupListPage from "@/pages/admin/admin-question.group-list.page";
import AdminQuestionGroupFormPage from "@/pages/admin/admin-question.group-form.page";
import AdminQuestionListPage from "@/pages/admin/admin-question.list.page";
import AdminQuestionFormPage from "@/pages/admin/admin-question.form.page";
import AdminEquipmentListPage from "@/pages/admin/admin.equipment-list.page";
import AdminEquipmentFormPage from "@/pages/admin/admin.equipment-form.page";
import AdminMealCategoryListPage from "@/pages/admin/admin.meal-category.list-page";
import AdminMealCategoryFormPage from "@/pages/admin/admin.meal-category.form-page";
const AdminTargetMuscleListPage = lazy(() => import("@/pages/admin/admin-target.muscle-list.page"));
const AdminTargetMuscleFormPage = lazy(() => import("@/pages/admin/admin.target-muscle.form-page"));
const AdminExerciseListPage = lazy(() => import("@/pages/admin/admin.exercise-list.page"));
const AdminExerciseFormPage = lazy(() => import("@/pages/admin/admin.exercise-form.page"));
const AdminBookingsPage = lazy(() => import("@/pages/admin/admin-booking/admin-bookings.page"));


export const adminRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
    <Route element={<MainSidebarLayout />}>

      <Route path={ADMIN_UI_ROUTES.DASHBOARD} element={<AdminDashboardPage />} />
      <Route path={ADMIN_UI_ROUTES.USERS} element={<AdminUsersPage />} />
      <Route path={ADMIN_UI_ROUTES.TRAINERS} element={<AdminTrainersPage />} />
      <Route path={ADMIN_UI_ROUTES.TRAINER_APPOINTMENT_LIST} element={<AdminTrainerOnboardingPage />} />
      <Route path={ADMIN_UI_ROUTES.APPOINTMENT_DETAILS_PATH} element={<AdminAppointmentDetailsPage />} />
      <Route path={ADMIN_UI_ROUTES.CATEGORY} element={<AdminCategoryListPage />} />
      <Route path={ADMIN_UI_ROUTES.CATEGORY_CREATE} element={<AdminCategoryFormPage />} />
      <Route path={ADMIN_UI_ROUTES.CATEGORY_EDIT_PATH} element={<AdminCategoryFormPage />} />
      <Route path={ADMIN_UI_ROUTES.SUBSCRIPTION_FEATURES} element={<AdminSubscriptionFeatureListPage />} />
      <Route path={ADMIN_UI_ROUTES.SUBSCRIPTION_FEATURE_CREATE} element={<AdminSubscriptionFeatureFormPage />} />
      <Route path={ADMIN_UI_ROUTES.SUBSCRIPTION_FEATURE_EDIT_PATH} element={<AdminSubscriptionFeatureFormPage />} />
      <Route path={ADMIN_UI_ROUTES.SUBSCRIPTION_PLANS} element={<AdminSubscriptionPlanListPage />} />
      <Route path={ADMIN_UI_ROUTES.SUBSCRIPTION_PLAN_CREATE} element={<AdminSubscriptionPlanFormPage />} />
      <Route path={ADMIN_UI_ROUTES.SUBSCRIPTION_PLAN_EDIT_PATH} element={<AdminSubscriptionPlanFormPage />} />
      <Route path={ADMIN_UI_ROUTES.SUBSCRIPTION_TRANSACTIONS} element={<AdminSubscriptionTransactionListPage />} />

      <Route path={ADMIN_UI_ROUTES.QUESTION_GROUPS} element={<AdminQuestionGroupListPage />} />
      <Route path={ADMIN_UI_ROUTES.QUESTION_GROUPS_CREATE} element={<AdminQuestionGroupFormPage />} />
      <Route path={ADMIN_UI_ROUTES.QUESTION_GROUPS_EDIT_PATH} element={<AdminQuestionGroupFormPage />} />

      <Route path={ADMIN_UI_ROUTES.QUESTIONS_LIST} element={<AdminQuestionListPage />} />
      <Route path={ADMIN_UI_ROUTES.QUESTION_CREATE} element={<AdminQuestionFormPage />} />
      <Route path={ADMIN_UI_ROUTES.QUESTION_EDIT_PATH} element={<AdminQuestionFormPage />} />


      {/* TargetMuscles */}

      <Route path={ADMIN_UI_ROUTES.TARGET_MUSCLES} element={<AdminTargetMuscleListPage />} />
      <Route path={ADMIN_UI_ROUTES.TARGET_MUSCLES_FORM} element={<AdminTargetMuscleFormPage />} />

      {/*Equipment*/}
      <Route path={ADMIN_UI_ROUTES.EQUIPMENT} element={<AdminEquipmentListPage />} />
      <Route path={ADMIN_UI_ROUTES.EQUIPMENT_FORM} element={<AdminEquipmentFormPage />} />

      {/* Exercises */}
      <Route path={ADMIN_UI_ROUTES.EXERCISES} element={<AdminExerciseListPage />} />
      <Route path={ADMIN_UI_ROUTES.EXERCISES_FORM} element={<AdminExerciseFormPage />} />

      <Route path={ADMIN_UI_ROUTES.MEAL_CATEGORY} element={<AdminMealCategoryListPage/>} />
      <Route path={ADMIN_UI_ROUTES.MEAL_CATEGORY_FORM} element={<AdminMealCategoryFormPage/>} />

      {/* Bookings */}
      <Route path={ADMIN_UI_ROUTES.BOOKINGS} element={<AdminBookingsPage />} />

    </Route>
  </Route>
);