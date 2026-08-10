import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { trainerService } from "@/modules/trainer/service/trainer.service";
import { TrainerDetail } from "@/interface/trainer.interface";
import { ClientBookingFlow } from "@/features/client/booking/components/client-booking.flow";

const UserBookTrainerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState<TrainerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    trainerService
      .getTrainerById(id)
      .then((res) => {
        if (res?.data) {
          setTrainer(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) {
    return (
      <div className="p-8 text-center text-white/50">
        No trainer specified.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-purple-400 hover:text-white text-sm transition px-4 sm:px-6 cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Profile
      </button>

      {loading ? (
        <div className="p-12 text-center text-purple-300">
          Loading trainer schedule setup...
        </div>
      ) : (
        <ClientBookingFlow trainerId={id} trainerName={trainer?.name || "Trainer"} />
      )}
    </div>
  );
};

export default UserBookTrainerPage;
