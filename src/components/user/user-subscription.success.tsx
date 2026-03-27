import React from 'react';
import SidebarLayout from '../ui/app.sidebar/sidebar.layout';
import { CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useNavigate } from 'react-router-dom';

const UserSubscriptionSuccess = () => {
   const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  return (
   
      <div className="flex flex-col items-center justify-center h-full text-white text-center">
        <CheckCircle size={64} className="text-green-400 mb-6" />
        <h1 className="text-3xl font-bold mb-3">Payment Successful!</h1>
        <p className="text-slate-400 mb-8">
          Your subscription is now active. Start your fitness journey!
        </p>
        <button
          onClick={() => navigate("/subscriptions")}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
        >
          View My Plan
        </button>
      </div>
   
  );
}

export default UserSubscriptionSuccess;
