import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import AuthRoute from './auth/auth.route';
import TrainerRoute from './trainer/trainer.route';
import UserRoute from './user/user.route';
import PublicRoutes from './public/public.routes';
import AdminRoute from './admin/admin.route';

const AppRoutes = () => {
    return (
       <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            backgroundColor: "#03000D",
            color: "#fff",
            border: "1px solid #190473",
          },
        }}
      />

      <AuthRoute/>
      <TrainerRoute/>
      <UserRoute/>
      <PublicRoutes/>
      <AdminRoute/>
      
   
    </BrowserRouter>
    );
}

export default AppRoutes;
