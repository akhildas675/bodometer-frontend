import { Toaster } from "sonner";
import AppRoutes from "@/routes/app.routes";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Suspense } from "react";
import { ScreenLoader } from "@/components/ui/ScreenLoader";
import { SocketProvider } from "@/app/providers/SocketProvider";
import { useAuthStore } from "@/stores/auth.store";
import IncomingCallBanner from "@/features/video-session/components/IncomingCallBanner";

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
