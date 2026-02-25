import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, FileText, XCircle } from "lucide-react";

import adminServices from "@/services/admin/admin.services";
import { useAuthStore } from "@/stores/auth.store";

import type { TrainerWithProfile } from "@/components/ui/table/table.types";

import SidebarLayout from "@/components/ui/app.sidebar/sidebar.layout";

import RejectionModal from "./trainer.appointment-rejection.modal";
import { VerificationStatus } from "@/constants/verification.status";


const AdminTrainerAppointmentDetails = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [trainer, setTrainer] = useState<TrainerWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  console.log('trainer appointment details')

  const fetchTrainerDetails = async () => {
    if (!profileId) return;

    try {
      setLoading(true);
      const response = await adminServices.getTrainerByProfileId(profileId);
      setTrainer(response.data);
    } catch (error) {
      toast.error("Failed to fetch trainer details");
      console.error(error);
      navigate("/admin/trainers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileId) {
      fetchTrainerDetails();
    }
  }, [profileId]);

  const handleApprove = async () => {
    if (!trainer) return;

    try {
      setActionLoading(true);
      await adminServices.approveTrainer(trainer.profile._id);
      toast.success("Trainer approved successfully");
      fetchTrainerDetails();
    } catch (error) {
      toast.error("Failed to approve trainer");
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (reason: string) => {
    if (!trainer) return;

    try {
      setActionLoading(true);
      await adminServices.rejectTrainer(trainer.profile._id, reason);
      toast.success("Trainer rejected");
      setShowRejectModal(false);
      fetchTrainerDetails();
    } catch (error) {
      toast.error("Failed to reject trainer");
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const viewCertificate = (certUrl: string) => {
    window.open(certUrl, "_blank");
  };

  if (loading) {
    return (
      <SidebarLayout role={user?.role || "admin"}>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading trainer details...</div>
        </div>
      </SidebarLayout>
    );
  }

  if (!trainer) {
    return (
      <SidebarLayout role={user?.role || "admin"}>
        <div className="text-white p-6">Trainer not found</div>
      </SidebarLayout>
    );
  }

  const isPending = trainer.profile.verificationStatus === "pending";

  return (
    <SidebarLayout role={user?.role || "admin"}>
      <div className="max-w-5xl mx-auto py-8 px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/trainers")}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to Trainers</span>
        </button>

        {/* Header */}
        <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <img
                src={trainer.user.profilePic || "https://via.placeholder.com/100"}
                alt={trainer.user.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500"
              />
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">{trainer.user.name}</h1>
                <p className="text-slate-400 text-sm mb-2">@{trainer.user.userName}</p>
                <StatusBadge status={trainer.profile.verificationStatus} />
              </div>
            </div>

            {/* Action Buttons */}
            {isPending && (
              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  <CheckCircle size={18} />
                  Approve
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  <XCircle size={18} />
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>

        {/* User Information */}
        <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="Email" value={trainer.user.email} />
            <InfoItem label="Phone" value={trainer.user.phoneNumber} />
            <InfoItem label="Gender" value={trainer.user.gender} />
            <InfoItem
              label="Date of Birth"
              value={trainer.user.dateOfBirth ? new Date(trainer.user.dateOfBirth).toLocaleDateString() : "N/A"}
            />
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">Professional Information</h2>
          <div className="space-y-4">
            <InfoItem label="Experience" value={`${trainer.profile.experienceInYears} years`} />

            <div>
              <p className="text-slate-400 text-sm mb-2">Bio</p>
              <p className="text-white bg-white/5 p-4 rounded-lg">{trainer.profile.bio || "No bio provided"}</p>
            </div>

            <div>
              <p className="text-slate-400 text-sm mb-2">Certifications</p>
              {trainer.profile.certifications.length > 0 ? (
                <div className="space-y-2">
                  {trainer.profile.certifications.map((cert, index) => (
                    <button
                      key={index}
                      onClick={() => viewCertificate(cert)}
                      className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white transition w-full text-left"
                    >
                      <FileText size={18} className="text-indigo-400" />
                      <span>Certificate {index + 1}</span>
                      <span className="ml-auto text-xs text-indigo-400">View PDF</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No certifications uploaded</p>
              )}
            </div>
          </div>
        </div>

        {/* Rejection Reason (if rejected) */}
        {trainer.profile.verificationStatus === "rejected" && trainer.profile.rejectionReason && (
          <div className="bg-red-600/10 border border-red-600/30 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-red-400 mb-2">Rejection Reason</h2>
            <p className="text-slate-300">{trainer.profile.rejectionReason}</p>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <RejectionModal
          onClose={() => setShowRejectModal(false)}
          onSubmit={handleReject}
          loading={actionLoading}
        />
      )}
    </SidebarLayout>
  );
};

// Helper Components
const StatusBadge = ({ status }: { status: VerificationStatus }) => {
  const colors = {
    pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    approved: "text-green-400 bg-green-400/10 border-green-400/30",
    rejected: "text-red-400 bg-red-400/10 border-red-400/30",
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${colors[status]}`}>
      {status.toUpperCase()}
    </span>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-slate-400 text-sm mb-1">{label}</p>
    <p className="text-white">{value}</p>
  </div>
);

export default AdminTrainerAppointmentDetails;