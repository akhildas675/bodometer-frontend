import { Toaster } from "sonner";
import AppRoutes from "./routes/route/app.routes";
import { ErrorBoundary } from "./ui.components/ui/error.boundary";
import { Suspense } from "react";
import { ScreenLoader } from "./ui.components/ui/screen-loader";
import { SocketProvider } from "./infrastructure/socket/socket.provider";
import { useAuthStore } from "./stores/auth.store";
import IncomingCallBanner from "./features/video.session/components/incoming-call.banner";

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <ErrorBoundary>
      <SocketProvider isAuthenticated={isAuthenticated}>
        <Toaster 
          position="top-right" 
          expand={false}
          duration={3000}
          theme="dark"
          toastOptions={{
            style: {
              background: '#13112c',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
            },
            classNames: {
              toast: 'bg-[#13112c] border border-violet-500/40 text-white rounded-xl shadow-2xl p-4',
              title: 'text-white font-bold text-sm',
              description: 'text-slate-300 text-xs font-normal mt-1',
            },
            className: 'toast-custom text-white',
          }}
        />
        <IncomingCallBanner />
        <Suspense fallback={<ScreenLoader />}>
          <AppRoutes />
        </Suspense>
      </SocketProvider>
    </ErrorBoundary>
  );
};

export default App;
