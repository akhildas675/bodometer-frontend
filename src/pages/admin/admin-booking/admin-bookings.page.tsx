import React, { useEffect, useState } from "react";
import adminServices from "@/services/admin/admin.services";
import { parseApiError } from "@/api/error.helper";
import DataTable from "@/components/ui/table/data.table";
import type { TableColumn, TableAction } from "@/components/ui/table/table.types";
import { TrainerBooking } from "@/interface/booking.interface";
import { format } from "date-fns";
import { toast } from "sonner";
import { ScreenLoader } from "@/components/ui/screen-loader";

const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<TrainerBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await adminServices.getAllBookings();
      if (res.success && res.data) {
        setBookings(res.data as unknown as TrainerBooking[]);
      }
    } catch (error) {
      toast.error(parseApiError(error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await adminServices.cancelBooking(bookingId);
      if (res.success) {
        toast.success("Booking cancelled");
        fetchBookings();
      }
    } catch (error) {
      toast.error(parseApiError(error).message);
    }
  };

  const columns: TableColumn<TrainerBooking>[] = [
    {
      key: "userId",
      label: "Client",
      render: (row) => (
        <div>
          <p>{row.userId?.name || "Unknown"}</p>
          <p className="text-xs text-white/50">{row.userId?.email || ""}</p>
        </div>
      )
    },
    {
      key: "trainerId",
      label: "Trainer",
      render: (row) => (
        <div>
          <p>{row.trainerId?.name || "Unknown"}</p>
          <p className="text-xs text-white/50">{row.trainerId?.email || ""}</p>
        </div>
      )
    },
    {
      key: "bookingDate",
      label: "Date / Time",
      render: (row) => (
        <div>
          <p>{format(new Date(row.bookingDate), "MMM dd, yyyy")}</p>
          <p className="text-xs text-white/50">{row.startTime} - {row.endTime}</p>
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'approved' ? 'bg-green-500/20 text-green-400' :
          row.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
          row.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      )
    }
  ];

  const actions: TableAction<TrainerBooking>[] = [
    {
      label: "Force Cancel",
      onClick: (row) => handleCancel(row._id),
      variant: "danger",
      visible: (row) => row.status === 'pending' || row.status === 'approved',
    }
  ];

  if (isLoading) return <ScreenLoader />;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Platform Bookings</h1>
        <p className="text-white/60">Monitor and manage all trainer bookings across the platform.</p>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
        {bookings.length > 0 ? (
          <DataTable columns={columns} data={bookings} actions={actions} />
        ) : (
          <div className="text-center py-12">
            <p className="text-white/60">No bookings found on the platform.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookingsPage;
