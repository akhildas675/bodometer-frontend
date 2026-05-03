import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserSubscriptionSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#03000D] to-[#190473] flex items-center justify-center px-6">
      <div className="text-center text-white max-w-xl">
        <CheckCircle size={72} className="text-green-400 mx-auto mb-6" />

        <h1 className="text-4xl font-bold mb-4">
          Payment Successful!
        </h1>

        <p className="text-white/70 text-lg mb-10">
          Your subscription is now active. Start your fitness journey.
        </p>

        <button
          onClick={() => navigate("/intro")}
          className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition-all"
        >
          Start Onboarding
        </button>
      </div>
    </div>
  );
};

export default UserSubscriptionSuccess;