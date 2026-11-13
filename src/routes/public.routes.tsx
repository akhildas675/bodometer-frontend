import { Route } from "react-router-dom";
import UserHomePage from "@/features/user/pages/UserHomePage";
import PublicGuard from "@/routes/guards/PublicGuardRoute";
import MainLayouts from "@/components/layout/MainLayout";
import UserBmiPage from "@/features/user/pages/UserBmiPage";
import UserTrainersPage from "@/features/user/pages/UserTrainersPage";
import UserTrainerDetailPage from "@/features/user/pages/UserTrainerDetailPage";
import UserCategoriesPage from "@/features/workout/pages/UserCategoriesPage";
import UserCategoryDetailPage from "@/features/workout/pages/UserCategoryDetailPage";
import UserExercisesPage from "@/features/workout/pages/UserExercisesPage";
import UserExerciseDetailPage from "@/features/workout/pages/UserExerciseDetailPage";
import { USER_UI_ROUTES } from "@/constants/routes/user.routes";
import AboutPage from "@/features/public/pages/AboutPage";
import PrivacyPolicyPage from "@/features/public/pages/PrivacyPolicyPage";
import TermsOfServicePage from "@/features/public/pages/TermsOfServicePage";

const DynamicPublicLayout = () => <MainLayouts />;


export const publicRoutes = (
  <Route element={<PublicGuard />}>
    <Route element={<DynamicPublicLayout />}>
      <Route path="/" element={<UserHomePage />} />
      <Route path={USER_UI_ROUTES.USER_BMI} element={<UserBmiPage />} />
      <Route path={USER_UI_ROUTES.USER_TRAINERS} element={<UserTrainersPage />} />
      <Route path={USER_UI_ROUTES.USER_TRAINER_DETAILS} element={<UserTrainerDetailPage />} />
      <Route path={USER_UI_ROUTES.USER_CATEGORIES} element={<UserCategoriesPage />} />
      <Route path={USER_UI_ROUTES.USER_CATEGORY_DETAILS} element={<UserCategoryDetailPage />} />
      <Route path={USER_UI_ROUTES.USER_EXERCISES} element={<UserExercisesPage />} />
      <Route path={USER_UI_ROUTES.USER_EXERCISE_DETAIL} element={<UserExerciseDetailPage />} />
    </Route>
    {/* Footer Pages - No Layout (Full Pages) */}
    <Route path="/about" element={<AboutPage />} />
    <Route path="/privacy" element={<PrivacyPolicyPage />} />
    <Route path="/terms" element={<TermsOfServicePage />} />
  </Route>
);
