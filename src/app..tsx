import { Toaster } from "sonner";
import AppRoutes from "./routes/route/app.routes";

const App = () => {
  return (
    <>
      <Toaster 
      position="top-right" 
      expand={false}
      duration={3000}
      toastOptions={{
        style: {
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          color: '#e0e7ff',
          fontSize: '14px',
          fontWeight: '500',
        },
        className: 'toast-custom',
      }}
    />
      <AppRoutes />
    </>
  );
};

export default App;
