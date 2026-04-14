import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle2, User } from "lucide-react";

const UserOnboardingCompletion = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Simulate a dashboard generation loading state for that premium feel
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleGoToDashboard = () => {
    navigate("/profile"); 
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#03000D] to-[#190473] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-2xl w-full bg-linear-to-b from-[#03000D]/80 to-[#190473]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center relative z-10 shadow-2xl">
        
        {loading ? (
          <div className="space-y-8 flex flex-col items-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute w-full h-full border-4 border-purple-500/20 rounded-full"></div>
              <div className="absolute w-full h-full border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
              <User className="w-8 h-8 text-purple-400 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-white text-2xl font-bold tracking-wide">
                Configuring Your Profile...
              </h2>
              <p className="text-white/50">
                Analyzing your goals, evaluating your habits, and building your premium dashboard.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in zoom-in duration-500 flex flex-col items-center">
            
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>

            <div className="space-y-4">
              <h1 className="text-white text-4xl font-bold leading-tight">
                You're All Set!
              </h1>
              <p className="text-white/60 text-lg font-light">
                Your Bodometer Premium profile has been successfully built. Get ready to transform your life.
              </p>
            </div>

            <button
              onClick={handleGoToDashboard}
              className="mt-4 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-10 py-4 rounded-full font-bold text-lg tracking-wide transition-all shadow-lg hover:shadow-purple-500/25 hover:scale-105 active:scale-95"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOnboardingCompletion;
