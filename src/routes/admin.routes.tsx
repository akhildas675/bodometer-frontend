import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/routes/guards/ProtectedRoute";
import { ADMIN_UI_ROUTES } from "@/constants/routes/admin.routes";
import MainSidebarLayout from "@/components/layout/MainSidebarLayout";

// Lazy load all admin pages
const AdminDashboardPage = lazy(() => import("@/features/admin/dashboard/pages/AdminDashboardPage"));
const AdminUsersPage = lazy(() => import("@/features/admin/users/pages/AdminUsersPage"));
const AdminTrainersPage = lazy(() => import("@/features/admin/trainers/pages/AdminTrainersPage"));
const AdminTrainerOnboardingPage = lazy(() => import("@/features/admin/trainers/pages/AdminTrainerOnboardingPage"));
const AdminAppointmentDetailsPage = lazy(() => import("@/features/admin/trainers/pages/AdminAppointmentDetailsPage"));
const AdminCategoryListPage = lazy(() => import("@/features/admin/categories/pages/AdminCategoryListPage"));
const AdminCategoryFormPage = lazy(() => import("@/features/admin/categories/pages/AdminCategoryFormPage"));
const AdminCoachingListPage = lazy(() => import("@/features/admin/coaching/pages/AdminCoachingListPage"));
const AdminCoachingFormPage = lazy(() => import("@/features/admin/coaching/pages/AdminCoachingFormPage"));
const AdminSubscriptionFeatureListPage = lazy(() => import("@/features/admin/subscriptions/pages/AdminSubscriptionFeatureListPage"));
const AdminSubscriptionFeatureFormPage = lazy(() => import("@/features/admin/subscriptions/pages/AdminSubscriptionFeatureFormPage"));
const AdminSubscriptionPlanListPage = lazy(() => import("@/features/admin/subscriptions/pages/AdminSubscriptionPlanListPage"));
const AdminSubscriptionPlanFormPage = lazy(() => import("@/features/admin/subscriptions/pages/AdminSubscriptionPlanFormPage"));
const AdminSubscriptionTransactionListPage = lazy(() => import("@/features/admin/subscriptions/pages/AdminSubscriptionTransactionListPage"));
const AdminQuestionGroupListPage = lazy(() => import("@/features/admin/onboarding/pages/AdminQuestionGroupListPage"));
const AdminQuestionGroupFormPage = lazy(() => import("@/features/admin/onboarding/pages/AdminQuestionGroupFormPage"));
const AdminQuestionListPage = lazy(() => import("@/features/admin/onboarding/pages/AdminQuestionListPage"));
const AdminQuestionFormPage = lazy(() => import("@/features/admin/onboarding/pages/AdminQuestionFormPage"));
const AdminEquipmentListPage = lazy(() => import("@/features/admin/equipment/pages/AdminEquipmentListPage"));
const AdminEquipmentFormPage = lazy(() => import("@/features/admin/equipment/pages/AdminEquipmentFormPage"));
const AdminMealCategoryListPage = lazy(() => import("@/features/admin/meal-categories/pages/AdminMealCategoryListPage"));
const AdminMealCategoryFormPage = lazy(() => import("@/features/admin/meal-categories/pages/AdminMealCategoryFormPage"));
const AdminNotificationPage = lazy(() => import("@/features/notification/pages/AdminNotificationPage"));
const AdminTargetMuscleListPage = lazy(() => import("@/features/admin/target-muscles/pages/AdminTargetMuscleListPage"));
const AdminTargetMuscleFormPage = lazy(() => import("@/features/admin/target-muscles/pages/AdminTargetMuscleFormPage"));
const AdminExerciseListPage = lazy(() => import("@/features/admin/exercises/pages/AdminExerciseListPage"));
const AdminExerciseFormPage = lazy(() => import("@/features/admin/exercises/pages/AdminExerciseFormPage"));
const AdminFinancePage = lazy(() => import("@/features/finance/pages/AdminFinancePage"));

// Loading component for lazy loaded routes
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
  </div>
);

export const adminRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
    <Route element={<MainSidebarLayout />}>
      <Route path={ADMIN_UI_ROUTES.DASHBOARD} element={
        <Suspense fallback={<PageLoader />}>
          <AdminDashboardPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.USERS} element={
        <Suspense fallback={<PageLoader />}>
          <AdminUsersPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.TRAINERS} element={
        <Suspense fallback={<PageLoader />}>
          <AdminTrainersPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.TRAINER_APPOINTMENT_LIST} element={
        <Suspense fallback={<PageLoader />}>
          <AdminTrainerOnboardingPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.APPOINTMENT_DETAILS_PATH} element={
        <Suspense fallback={<PageLoader />}>
          <AdminAppointmentDetailsPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.CATEGORY} element={
        <Suspense fallback={<PageLoader />}>
          <AdminCategoryListPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.CATEGORY_CREATE} element={
        <Suspense fallback={<PageLoader />}>
          <AdminCategoryFormPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.CATEGORY_EDIT_PATH} element={
        <Suspense fallback={<PageLoader />}>
          <AdminCategoryFormPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.COACHING} element={
        <Suspense fallback={<PageLoader />}>
          <AdminCoachingListPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.COACHING_CREATE} element={
        <Suspense fallback={<PageLoader />}>
          <AdminCoachingFormPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.COACHING_EDIT_PATH} element={
        <Suspense fallback={<PageLoader />}>
          <AdminCoachingFormPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.SUBSCRIPTION_FEATURES} element={
        <Suspense fallback={<PageLoader />}>
          <AdminSubscriptionFeatureListPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.SUBSCRIPTION_FEATURE_CREATE} element={
        <Suspense fallback={<PageLoader />}>
          <AdminSubscriptionFeatureFormPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.SUBSCRIPTION_FEATURE_EDIT_PATH} element={
        <Suspense fallback={<PageLoader />}>
          <AdminSubscriptionFeatureFormPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.SUBSCRIPTION_PLANS} element={
        <Suspense fallback={<PageLoader />}>
          <AdminSubscriptionPlanListPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.SUBSCRIPTION_PLAN_CREATE} element={
        <Suspense fallback={<PageLoader />}>
          <AdminSubscriptionPlanFormPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.SUBSCRIPTION_PLAN_EDIT_PATH} element={
        <Suspense fallback={<PageLoader />}>
          <AdminSubscriptionPlanFormPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.SUBSCRIPTION_TRANSACTIONS} element={
        <Suspense fallback={<PageLoader />}>
          <AdminSubscriptionTransactionListPage />
        </Suspense>
      } />

      <Route path={ADMIN_UI_ROUTES.QUESTION_GROUPS} element={
        <Suspense fallback={<PageLoader />}>
          <AdminQuestionGroupListPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.QUESTION_GROUPS_CREATE} element={
        <Suspense fallback={<PageLoader />}>
          <AdminQuestionGroupFormPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.QUESTION_GROUPS_EDIT_PATH} element={
        <Suspense fallback={<PageLoader />}>
          <AdminQuestionGroupFormPage />
        </Suspense>
      } />

      <Route path={ADMIN_UI_ROUTES.QUESTIONS_LIST} element={
        <Suspense fallback={<PageLoader />}>
          <AdminQuestionListPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.QUESTION_CREATE} element={
        <Suspense fallback={<PageLoader />}>
          <AdminQuestionFormPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.QUESTION_EDIT_PATH} element={
        <Suspense fallback={<PageLoader />}>
          <AdminQuestionFormPage />
        </Suspense>
      } />

      {/* TargetMuscles */}
      <Route path={ADMIN_UI_ROUTES.TARGET_MUSCLES} element={
        <Suspense fallback={<PageLoader />}>
          <AdminTargetMuscleListPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.TARGET_MUSCLES_FORM} element={
        <Suspense fallback={<PageLoader />}>
          <AdminTargetMuscleFormPage />
        </Suspense>
      } />

      {/* Equipment */}
      <Route path={ADMIN_UI_ROUTES.EQUIPMENT} element={
        <Suspense fallback={<PageLoader />}>
          <AdminEquipmentListPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.EQUIPMENT_FORM} element={
        <Suspense fallback={<PageLoader />}>
          <AdminEquipmentFormPage />
        </Suspense>
      } />

      {/* Exercises */}
      <Route path={ADMIN_UI_ROUTES.EXERCISES} element={
        <Suspense fallback={<PageLoader />}>
          <AdminExerciseListPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.EXERCISES_FORM} element={
        <Suspense fallback={<PageLoader />}>
          <AdminExerciseFormPage />
        </Suspense>
      } />

      <Route path={ADMIN_UI_ROUTES.MEAL_CATEGORY} element={
        <Suspense fallback={<PageLoader />}>
          <AdminMealCategoryListPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.MEAL_CATEGORY_FORM} element={
        <Suspense fallback={<PageLoader />}>
          <AdminMealCategoryFormPage />
        </Suspense>
      } />

      <Route path={ADMIN_UI_ROUTES.NOTIFICATIONS} element={
        <Suspense fallback={<PageLoader />}>
          <AdminNotificationPage />
        </Suspense>
      } />
      <Route path={ADMIN_UI_ROUTES.FINANCE} element={
        <Suspense fallback={<PageLoader />}>
          <AdminFinancePage />
        </Suspense>
      } />
    </Route>
  </Route>
);
