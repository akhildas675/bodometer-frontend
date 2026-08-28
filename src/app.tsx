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
          duration={4000}
          toastOptions={{
            style: {
              background: '#0c071e',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
            },
            descriptionClassName: '!text-slate-100 !font-medium text-xs',
            className: 'toast-custom text-white',
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
