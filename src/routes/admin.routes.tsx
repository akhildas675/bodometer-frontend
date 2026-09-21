import { Route } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "@/routes/guards/ProtectedRoute";
import AdminDashboardPage from "@/features/admin/dashboard/pages/AdminDashboardPage";
import AdminUsersPage from "@/features/admin/users/pages/AdminUsersPage";
import AdminTrainersPage from "@/features/admin/trainers/pages/AdminTrainersPage";
import AdminTrainerOnboardingPage from "@/features/admin/trainers/pages/AdminTrainerOnboardingPage";
import AdminAppointmentDetailsPage from "@/features/admin/trainers/pages/AdminAppointmentDetailsPage";
import { ADMIN_UI_ROUTES } from "@/constants/routes/admin.routes";
import MainSidebarLayout from "@/components/layout/MainSidebarLayout";
import AdminCategoryListPage from "@/features/admin/categories/pages/AdminCategoryListPage";
import AdminCategoryFormPage from "@/features/admin/categories/pages/AdminCategoryFormPage";
import AdminCoachingListPage from "@/features/admin/coaching/pages/AdminCoachingListPage";
import AdminCoachingFormPage from "@/features/admin/coaching/pages/AdminCoachingFormPage";
import AdminSubscriptionFeatureListPage from "@/features/admin/subscriptions/pages/AdminSubscriptionFeatureListPage";
import AdminSubscriptionFeatureFormPage from "@/features/admin/subscriptions/pages/AdminSubscriptionFeatureFormPage";
import AdminSubscriptionPlanListPage from "@/features/admin/subscriptions/pages/AdminSubscriptionPlanListPage";
import AdminSubscriptionPlanFormPage from "@/features/admin/subscriptions/pages/AdminSubscriptionPlanFormPage";
import AdminSubscriptionTransactionListPage from "@/features/admin/subscriptions/pages/AdminSubscriptionTransactionListPage";
import AdminQuestionGroupListPage from "@/features/admin/onboarding/pages/AdminQuestionGroupListPage";
import AdminQuestionGroupFormPage from "@/features/admin/onboarding/pages/AdminQuestionGroupFormPage";
import AdminQuestionListPage from "@/features/admin/onboarding/pages/AdminQuestionListPage";
import AdminQuestionFormPage from "@/features/admin/onboarding/pages/AdminQuestionFormPage";
import AdminEquipmentListPage from "@/features/admin/equipment/pages/AdminEquipmentListPage";
import AdminEquipmentFormPage from "@/features/admin/equipment/pages/AdminEquipmentFormPage";
import AdminMealCategoryListPage from "@/features/admin/meal-categories/pages/AdminMealCategoryListPage";
import AdminMealCategoryFormPage from "@/features/admin/meal-categories/pages/AdminMealCategoryFormPage";
import AdminNotificationPage from "@/features/notification/pages/AdminNotificationPage";
const AdminTargetMuscleListPage = lazy(() => import("@/features/admin/target-muscles/pages/AdminTargetMuscleListPage"));
const AdminTargetMuscleFormPage = lazy(() => import("@/features/admin/target-muscles/pages/AdminTargetMuscleFormPage"));
const AdminExerciseListPage = lazy(() => import("@/features/admin/exercises/pages/AdminExerciseListPage"));
const AdminExerciseFormPage = lazy(() => import("@/features/admin/exercises/pages/AdminExerciseFormPage"));

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

      <Route path={ADMIN_UI_ROUTES.NOTIFICATIONS} element={<AdminNotificationPage />} />
    </Route>
  </Route>
);
