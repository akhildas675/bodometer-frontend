import { Route } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "@/routes/guard.routes/protected.route";
import AdminDashboardPage from "@/features/admin/admin/pages/admin-dashboard.page";
import AdminUsersPage from "@/features/admin/admin.users/pages/admin-users.page";
import AdminTrainersPage from "@/features/admin/admin.trainer/pages/admin-trainers.page";
import AdminTrainerOnboardingPage from "@/features/admin/admin.trainer/pages/admin-trainer-onboarding.page";
import AdminAppointmentDetailsPage from "@/features/admin/admin.trainer/pages/admin.appointment-details.page";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";
import MainSidebarLayout from "@/ui.components/layouts/main-sidebar.layout";
import AdminCategoryListPage from "@/features/admin/admin.category/pages/admin.category-list.page";
import AdminCategoryFormPage from "@/features/admin/admin.category/pages/admin.category-form.page";
import AdminCoachingListPage from "@/features/admin/admin.coaching/pages/admin.coaching-list.page";
import AdminCoachingFormPage from "@/features/admin/admin.coaching/pages/admin.coaching-form.page";
import AdminSubscriptionFeatureListPage from "@/features/admin/admin.subscription/pages/admin-subscription.feature-list.page";
import AdminSubscriptionFeatureFormPage from "@/features/admin/admin.subscription/pages/admin.subscription-feature.form.page";
import AdminSubscriptionPlanListPage from "@/features/admin/admin.subscription/pages/admin-subscription.plan-list.page";
import AdminSubscriptionPlanFormPage from "@/features/admin/admin.subscription/pages/admin-subscription.plan-form.page";
import AdminSubscriptionTransactionListPage from "@/features/admin/admin.subscription/pages/admin-subscription.transaction-list.page";
import AdminQuestionGroupListPage from "@/features/admin/admin.onboarding/pages/admin-question.group-list.page";
import AdminQuestionGroupFormPage from "@/features/admin/admin.onboarding/pages/admin-question.group-form.page";
import AdminQuestionListPage from "@/features/admin/admin.onboarding/pages/admin-question.list.page";
import AdminQuestionFormPage from "@/features/admin/admin.onboarding/pages/admin-question.form.page";
import AdminEquipmentListPage from "@/features/admin/admin.equipment/pages/admin.equipment-list.page";
import AdminEquipmentFormPage from "@/features/admin/admin.equipment/pages/admin.equipment-form.page";
import AdminMealCategoryListPage from "@/features/admin/admin.meal-category/pages/admin.meal-category.list-page";
import AdminMealCategoryFormPage from "@/features/admin/admin.meal-category/pages/admin.meal-category.form-page";
const AdminTargetMuscleListPage = lazy(() => import("@/features/admin/admin.target.muscle/pages/admin-target.muscle-list.page"));
const AdminTargetMuscleFormPage = lazy(() => import("@/features/admin/admin.target.muscle/pages/admin.target-muscle.form-page"));
const AdminExerciseListPage = lazy(() => import("@/features/admin/admin.exercise/pages/admin.exercise-list.page"));
const AdminExerciseFormPage = lazy(() => import("@/features/admin/admin.exercise/pages/admin.exercise-form.page"));

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
      <Route path={ADMIN_UI_ROUTES.COACHING} element={<AdminCoachingListPage />} />
      <Route path={ADMIN_UI_ROUTES.COACHING_CREATE} element={<AdminCoachingFormPage />} />
      <Route path={ADMIN_UI_ROUTES.COACHING_EDIT_PATH} element={<AdminCoachingFormPage />} />
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

      {/* Equipment */}
      <Route path={ADMIN_UI_ROUTES.EQUIPMENT} element={<AdminEquipmentListPage />} />
      <Route path={ADMIN_UI_ROUTES.EQUIPMENT_FORM} element={<AdminEquipmentFormPage />} />

      {/* Exercises */}
      <Route path={ADMIN_UI_ROUTES.EXERCISES} element={<AdminExerciseListPage />} />
      <Route path={ADMIN_UI_ROUTES.EXERCISES_FORM} element={<AdminExerciseFormPage />} />

      <Route path={ADMIN_UI_ROUTES.MEAL_CATEGORY} element={<AdminMealCategoryListPage/>} />
      <Route path={ADMIN_UI_ROUTES.MEAL_CATEGORY_FORM} element={<AdminMealCategoryFormPage/>} />
    </Route>
  </Route>
);
