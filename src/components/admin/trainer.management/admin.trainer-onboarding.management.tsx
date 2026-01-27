import React, { useEffect, useState } from 'react';
import { useTrainerOnboardingActions } from './admin.trainer-onboarding.actions';
import type { TrainerWithProfile } from '../../ui/table/table.types';
import { useNavigate } from 'react-router-dom';
import adminServices from '../../../services/admin/admin.services';
import { trainerOnboardingColumns } from './admin.trainer-onboarding.columns';
import DataTable from '../../ui/table/data.table';
import { toast } from 'sonner';
import SidebarLayout from '../../ui/app.sidebar/sidebar.layout';
import { useAuthStore } from '../../../stores/auth.store';

const AdminTrainerOnboardingManagement = () => {
  const [trainers, setTrainers] = useState<TrainerWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const response = await adminServices.getTrainerAppointments();
      console.log("backend response....", response);
      setTrainers(response.data);
    } catch (error) {
      toast.error("Failed to fetch trainers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleViewDetails = (trainer: TrainerWithProfile) => {
    // ✅ Use profileId instead of userId for better security
    navigate(`/admin/trainers/${trainer.profile._id}`);
  };

  const trainerActions = useTrainerOnboardingActions(handleViewDetails);

  const filteredTrainers = trainers.filter((trainer) => {
    if (filter === "all") return true;
    return trainer.profile.verificationStatus === filter;
  });

  const stats = {
    total: trainers.length,
    pending: trainers.filter((t) => t.profile.verificationStatus === "pending").length,
    approved: trainers.filter((t) => t.profile.verificationStatus === "approved").length,
    rejected: trainers.filter((t) => t.profile.verificationStatus === "rejected").length,
  };

  if (loading) {
    return (
      <SidebarLayout role={user?.role || "admin"}>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading trainers...</div>
        </div>
      </SidebarLayout>
    );
  }

  if (!user) {
    return (
      <SidebarLayout role="admin">
        <div className="text-white p-6">Loading...</div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout role={user.role}>
      <div className="max-w-7xl mx-auto py-8 px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Trainer Management</h1>
          <p className="text-slate-400">Review and manage trainer applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Trainers" value={stats.total} color="blue" />
          <StatCard label="Pending" value={stats.pending} color="yellow" />
          <StatCard label="Approved" value={stats.approved} color="green" />
          <StatCard label="Rejected" value={stats.rejected} color="red" />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(["all", "pending", "approved", "rejected"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === status
                  ? "bg-indigo-600 text-white"
                  : "bg-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        <DataTable
          columns={trainerOnboardingColumns}
          data={filteredTrainers}
          actions={trainerActions}
        />

        {filteredTrainers.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No trainers found for this filter
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => {
  const colors = {
    blue: "from-blue-600/20 to-blue-600/5 border-blue-600/30",
    yellow: "from-yellow-600/20 to-yellow-600/5 border-yellow-600/30",
    green: "from-green-600/20 to-green-600/5 border-green-600/30",
    red: "from-red-600/20 to-red-600/5 border-red-600/30",
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-6`}>
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className="text-white text-3xl font-bold">{value}</p>
    </div>
  );
};

export default AdminTrainerOnboardingManagement;
