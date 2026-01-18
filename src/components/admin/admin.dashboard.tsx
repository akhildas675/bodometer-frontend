
import { useAuthStore } from "../../stores/auth.store";
import SidebarLayout from "../ui/app.sidebar/sidebar.layout";

const AdminDashboard = () => {
  const role = useAuthStore((state) => state.user?.role);

  if (!role) return null; 




  return (
    <SidebarLayout role={role}>
      <div className="text-white">
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
      </div>
    </SidebarLayout>
  );
};

export default AdminDashboard;
