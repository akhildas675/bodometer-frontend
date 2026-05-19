import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, FileText, XCircle } from "lucide-react";
import { parseApiError } from "@/api/error.helper";

import adminServices from "@/services/admin/admin.services";

import type { TrainerWithProfile } from "@/components/ui/table/table.types";

import RejectionModal from "./trainer.appointment-rejection.modal";
import ConfirmationModal from "@/components/ui/confirm.dialog";
import { VerificationStatus } from "@/constants/verification.status";

const AdminTrainerAppointmentDetails = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();

  const [trainer, setTrainer] = useState<TrainerWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: "danger" | "primary" | "purple";
    icon?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const fetchTrainerDetails = async () => {
    if (!profileId) return;
    try {
      setLoading(true);
      const response = await adminServices.getTrainerByProfileId(profileId);
      setTrainer(response.data);
    } catch (error) {
      const apiError = parseApiError(error);
      toast.error(apiError.message);
      navigate("/admin/trainers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileId) fetchTrainerDetails();
  }, [profileId]);

  const handleApprove = async () => {
    if (!trainer) return;
    try {
      setActionLoading(true);
      const res = await adminServices.approveTrainer(trainer.profile._id);
      toast.success(res.message);
      fetchTrainerDetails();
    } catch (error) {
      const apiError = parseApiError(error);
      toast.error(apiError.message);
    } finally {
      setActionLoading(false);
    }
  };

  const confirmApprove = () => {
    if (!trainer) return;
    setModalConfig({
      isOpen: true,
      title: "Approve Trainer Application",
      message: `Are you sure you want to approve ${trainer.user.name}'s application? This will verify their status and grant them full platform access.`,
      variant: "purple",
      icon: <CheckCircle className="w-6 h-6 text-purple-400" />,
      confirmText: "Yes, approve",
      cancelText: "Cancel",
      onConfirm: handleApprove,
    });
  };

  const handleReject = async (reason: string) => {
    if (!trainer) return;
    try {
      setActionLoading(true);
      const res = await adminServices.rejectTrainer(trainer.profile._id, reason);
      toast.success(res.message);
      fetchTrainerDetails();
    } catch (error) {
      const apiError = parseApiError(error);
      toast.error(apiError.message);
    } finally {
      setActionLoading(false);
    }
  };

  const confirmReject = (reason: string) => {
    setShowRejectModal(false);
    setModalConfig({
      isOpen: true,
      title: "Reject Trainer Application",
      message: `Are you sure you want to reject ${trainer?.user.name}'s application for the following reason: "${reason}"?`,
      variant: "danger",
      icon: <XCircle className="w-6 h-6 text-red-400" />,
      confirmText: "Yes, reject",
      cancelText: "Cancel",
      onConfirm: () => handleReject(reason),
    });
  };

  const viewCertificate = (certUrl: string) => {
    window.open(certUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0b1f] flex items-center justify-center">
        <div className="text-white text-xl">Loading trainer details...</div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-[#0d0b1f] p-6">
        <div className="text-white">Trainer not found</div>
      </div>
    );
  }

  const isPending = trainer.profile.verificationStatus === "pending";

  return (
    <div className="min-h-screen bg-[#0d0b1f]">
      <div className="max-w-5xl mx-auto py-8 px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/trainers")}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to Trainers</span>
        </button>

        {/* Header — cover photo + profile pic */}
        <div className="rounded-xl mb-6 border border-white/10">
          {/* Cover Photo */}
          <div className="relative h-44 w-full rounded-t-xl overflow-hidden">
            {trainer.profile.coverPhoto ? (
              <img
                src={trainer.profile.coverPhoto}
                alt="cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-[#1a0f3c] to-[#0a0624]" />
            )}
            <div className="absolute inset-0 bg-black/30" />

            {/* Action Buttons */}
            {isPending && (
              <div className="absolute top-4 right-4 flex gap-3">
                <button
                  onClick={confirmApprove}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50 shadow-lg"
                >
                  <CheckCircle size={18} />
                  Approve
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50 shadow-lg"
                >
                  <XCircle size={18} />
                  Reject
                </button>
              </div>
            )}
          </div>

          {/* Profile info below cover */}
          <div className="relative bg-white/5 rounded-b-xl px-6 pb-6 pt-14">
            <div className="absolute -top-10 left-6">
              <img
                src={
                  trainer.user.profilePic || "https://via.placeholder.com/100"
                }
                alt={trainer.user.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-[#0d0b1f] shadow-lg"
              />
            </div>

            <h1 className="text-2xl font-bold text-white mb-1">
              {trainer.user.name}
            </h1>
            <p className="text-slate-400 text-sm mb-2">
              @{trainer.user.userName}
            </p>
            <StatusBadge status={trainer.profile.verificationStatus} />
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">
            Contact Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="Email" value={trainer.user.email} />
            <InfoItem label="Phone" value={trainer.user.phoneNumber} />
            <InfoItem label="Gender" value={trainer.user.gender} />
            <InfoItem
              label="Date of Birth"
              value={
                trainer.user.dateOfBirth
                  ? new Date(trainer.user.dateOfBirth).toLocaleDateString()
                  : "N/A"
              }
            />
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">
            Professional Information
          </h2>
          <div className="space-y-4">
            <InfoItem
              label="Experience"
              value={`${trainer.profile.experienceInYears} years`}
            />

            <div>
              <p className="text-slate-400 text-sm mb-2">Bio</p>
              <p className="text-white bg-white/5 p-4 rounded-lg">
                {trainer.profile.bio || "No bio provided"}
              </p>
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
                      <span className="ml-auto text-xs text-indigo-400">
                        View PDF
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">
                  No certifications uploaded
                </p>
              )}
            </div>

            <div>
              <p className="text-slate-400 text-sm mb-2">Specializations</p>
              {trainer.profile.specializations && trainer.profile.specializations.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {trainer.profile.specializations.map((spec) => (
                    <span
                      key={spec._id}
                      className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-full text-sm"
                    >
                      {spec.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">
                  No specializations added
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Rejection Reason (if rejected) */}
        {trainer.profile.verificationStatus === "rejected" &&
          trainer.profile.rejectionReason && (
            <div className="bg-red-600/10 border border-red-600/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-red-400 mb-2">
                Rejection Reason
              </h2>
              <p className="text-slate-300">
                {trainer.profile.rejectionReason}
              </p>
            </div>
          )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <RejectionModal
          onClose={() => setShowRejectModal(false)}
          onSubmit={confirmReject}
          loading={actionLoading}
        />
      )}

      <ConfirmationModal
        {...modalConfig}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
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
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${colors[status]}`}
    >
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
