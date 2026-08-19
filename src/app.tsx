import { Toaster } from "sonner";
import AppRoutes from "./routes/route/app.routes";
import { ErrorBoundary } from "./ui.components/ui/error.boundary";
import { Suspense } from "react";
import { ScreenLoader } from "./ui.components/ui/screen-loader";
import { SocketProvider } from "./infrastructure/socket/socket.provider";
import { useAuthStore } from "./stores/auth.store";

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <ErrorBoundary>
      <SocketProvider isAuthenticated={isAuthenticated}>
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
        <Suspense fallback={<ScreenLoader />}>
          <AppRoutes />
        </Suspense>
      </SocketProvider>
    </ErrorBoundary>
  );
};

export default App;
