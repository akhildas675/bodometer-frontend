import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { ROLES } from '@/constants/role';
import { VERIFICATION_STATUS } from '@/constants/verification.status';
import { useEffect, useState } from 'react';
import { trainerService } from "@/modules/trainer/service/trainer.service";
import authInitService from '@/modules/auth/service/auth-init.service';

const TrainerStatusRoute = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [checking, setChecking] = useState(true);
  const [redirect, setRedirect] = useState<string | null>(null);

  useEffect(() => {
    if (user?.verificationStatus) {
      setChecking(false);
      return;
    }

    const verify = async () => {
      try {
        const result = await trainerService.getTrainerProfileStatus();
        const status = result?.data?.verificationStatus;

        if (status === VERIFICATION_STATUS.APPROVED) {
         
          try { await authInitService.logout(); } catch (e: unknown) { console.error(e); }
          useAuthStore.getState().clearAuth();
          setRedirect("/");
        } else if (!status) {
        
          setRedirect("/trainer/onboarding/intro");
        } else {
       
          useAuthStore.getState().setVerificationStatus(status);
        }
      } catch (e: unknown) {
        console.error(e);
      } finally {
        setChecking(false);
      }
    };

    verify();
  }, []);

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (user.role !== ROLES.TRAINER) return <Navigate to="/" replace />;

  if (user.verificationStatus === VERIFICATION_STATUS.APPROVED) {
    return <Navigate to="/trainer" replace />;
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#050017] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (redirect) return <Navigate to={redirect} replace />;

  return <Outlet />;
};

export default TrainerStatusRoute;
