import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";

const TrainerDashboard = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const handleLogout = () => {
    clearAuth(); 
    navigate("/", { replace: true }); 
  };
  return (
    <div className="min-h-screen bg-[#050017] flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-[#1a0b3a] to-[#12062a] rounded-r-[40px] p-6 text-white flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="text-2xl font-bold text-sky-400 mb-10">
            bodo<span className="text-blue-500">meter</span>
          </div>

          {/* Profile */}
          <div className="flex flex-col items-center mb-10">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2"
              className="h-20 w-20 rounded-full object-cover border-4 border-purple-500"
              alt="profile"
            />
            <h3 className="mt-3 font-semibold">Madison Smith</h3>
            <p className="text-xs text-slate-300">Trainer</p>
          </div>

          {/* MENU */}
          <nav className="space-y-4 text-sm">
            {[
              "Dashboard",
              "Sessions",
              "Clients",
              "Messages",
              "Slots",
              "Earnings",
              "Profile",
            ].map((item) => (
              <div
                key={item}
                className={`px-4 py-2 rounded-lg cursor-pointer ${
                  item === "Dashboard" ? "bg-purple-600" : "hover:bg-white/10"
                }`}
              >
                {item}
              </div>
            ))}
          </nav>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full py-2 rounded-lg bg-red-600/80 hover:bg-red-600 transition text-sm font-semibold"
        >
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 text-white">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Trainer Dashboard</h1>
          <span className="text-sm text-green-400">Active</span>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Clients", value: "42" },
            { label: "Active Sessions", value: "8" },
            { label: "Completed Sessions", value: "250+" },
            { label: "Rating", value: "4.9 ⭐" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gradient-to-br from-[#140b3a] to-[#0a0624] rounded-2xl p-6 shadow-xl"
            >
              <p className="text-sm text-slate-300">{stat.label}</p>
              <h2 className="mt-2 text-2xl font-semibold">{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {["Create Workout Plan", "View Today Sessions", "Manage Slots"].map(
            (action) => (
              <div
                key={action}
                className="bg-[#1c1550] rounded-2xl p-6 hover:bg-[#241c6a] transition cursor-pointer"
              >
                <h3 className="font-semibold mb-2">{action}</h3>
                <p className="text-xs text-slate-300">
                  Quick access to {action.toLowerCase()}
                </p>
              </div>
            )
          )}
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-gradient-to-br from-[#140b3a] to-[#0a0624] rounded-3xl p-8 shadow-xl">
          <h2 className="text-lg font-semibold mb-6">Recent Activity</h2>

          <div className="space-y-4 text-sm">
            {[
              "Session completed with John Doe",
              "New client assigned: Sarah",
              "Workout plan updated",
              "Payment received",
            ].map((activity, index) => (
              <div
                key={index}
                className="flex justify-between bg-[#1c1550] px-4 py-3 rounded-lg"
              >
                <span>{activity}</span>
                <span className="text-slate-400 text-xs">Today</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrainerDashboard;
