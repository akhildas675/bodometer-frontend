import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";

const AdminDashboard = () => {
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

          {/* Admin Info */}
          <div className="flex flex-col items-center mb-10">
            <div className="h-20 w-20 rounded-full bg-purple-600 flex items-center justify-center text-2xl font-bold">
              A
            </div>
            <h3 className="mt-3 font-semibold">Admin</h3>
            <p className="text-xs text-slate-300">admin@bodometer.com</p>
          </div>

          {/* MENU */}
          <nav className="space-y-4 text-sm">
            {[
              "Users",
              "Trainers",
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
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <span className="text-sm text-green-400">System Healthy</span>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Users", value: "12,430" },
            { label: "Total Trainers", value: "320" },
            { label: "Active Subscriptions", value: "2,145" },
            { label: "Monthly Revenue", value: "₹4.2L" },
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

        {/* MANAGEMENT SHORTCUTS */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {[
            "Verify Trainers",
            "Manage Subscriptions",
            "Add Workout Category",
          ].map((action) => (
            <div
              key={action}
              className="bg-[#1c1550] rounded-2xl p-6 hover:bg-[#241c6a] transition cursor-pointer"
            >
              <h3 className="font-semibold mb-2">{action}</h3>
              <p className="text-xs text-slate-300">
                Quick access to {action.toLowerCase()}
              </p>
            </div>
          ))}
        </div>

        {/* RECENT ACTIVITY TABLE */}
        <div className="bg-gradient-to-br from-[#140b3a] to-[#0a0624] rounded-3xl p-8 shadow-xl">
          <h2 className="text-lg font-semibold mb-6">Recent Activities</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-300 border-b border-white/10">
                <tr>
                  <th className="text-left py-3">Type</th>
                  <th className="text-left py-3">Description</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Date</th>
                </tr>
              </thead>
              <tbody className="text-slate-200">
                {[
                  ["Trainer", "Trainer verification approved", "Success"],
                  ["User", "New user registered", "Pending"],
                  ["Payment", "Subscription payment received", "Success"],
                  ["Trainer", "Profile update submitted", "Review"],
                ].map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="py-3">{row[0]}</td>
                    <td className="py-3">{row[1]}</td>
                    <td className="py-3">
                      <span className="px-3 py-1 rounded-full bg-purple-600 text-xs">
                        {row[2]}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">Today</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
