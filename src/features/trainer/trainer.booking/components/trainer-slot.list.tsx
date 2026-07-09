// File: src/pages/trainer/trainer.slot-listing.page.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";


import { parseApiError } from "@/api/error.helper";

import DataTable from "@/ui.components/ui/table/data.table";
import type { TableColumn, TableAction } from "@/ui.components/ui/table/table.types";
import Pagination from "@/features/controls/pagination/pagination";
import SortDropdown, { SortConfig } from "@/features/controls/sort/sort";
import { ScreenLoader } from "@/ui.components/ui/screen-loader";
import ConfirmationModal from "@/ui.components/ui/confirm.dialog";


import { PaginationMeta } from "@/interface/common.interface";
import { SLOT_STATUS } from "@/modules/booking/constant/constant.types/booking.constant";
import { TrainerSlot } from "@/modules/booking/types/booking.interface";
import { bookingService } from "@/modules/booking/service/booking.service";


const STATUS_BADGE_CLASS: Record<string, string> = {
  [SLOT_STATUS.AVAILABLE]: "bg-green-500/20 text-green-400",
  [SLOT_STATUS.BOOKED]: "bg-blue-500/20 text-blue-400",
  [SLOT_STATUS.EXPIRED]: "bg-white/10 text-white/50",
  [SLOT_STATUS.BLOCKED]: "bg-red-500/20 text-red-400",
};

interface TrainerSlotListProps {
  isSubSection?: boolean;
}

const TrainerSlotList: React.FC<TrainerSlotListProps> = ({ isSubSection }) => {
  const navigate = useNavigate();

  const [slots, setSlots] = useState<TrainerSlot[]>([]);
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: "danger" | "primary" | "purple";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState<SortConfig>({ field: "startTime", order: "asc" });
  const [status, setStatus] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  const fetchSlots = async () => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit,
        sortBy: sort.field,
        sortOrder: sort.order,
        status: status || undefined,
        date: dateFilter || undefined,
      };
      const res = await bookingService.getMySlots(params);
      if (res.success && res.data) {
        setSlots(res.data);
        setPagination(res.pagination);
      }
    } catch (error) {
      toast.error(parseApiError(error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, sort, status, dateFilter]);

  const handleBlockSlot = async (slotId: string) => {
    try {
      const res = await bookingService.blockSlot(slotId);
      if (res.success) {
        toast.success("Slot blocked successfully.");
        fetchSlots();
      }
    } catch (err) {
      toast.error(parseApiError(err).message);
    }
  };

  const handleUnblockSlot = async (slotId: string) => {
    try {
      const res = await bookingService.unblockSlot(slotId);
      if (res.success) {
        toast.success("Slot unblocked successfully.");
        fetchSlots();
      }
    } catch (err) {
      toast.error(parseApiError(err).message);
    }
  };


  const columns: TableColumn<TrainerSlot>[] = [
    {
      key: "startTime",
      label: "Date",
      render: (row) => format(new Date(row.startTime), "MMM dd, yyyy"),
    },
    {
      key: "time",
      label: "Time",
      render: (row) =>
        `${format(new Date(row.startTime), "hh:mm a")} - ${format(new Date(row.endTime), "hh:mm a")}`,
    },
    {
      key: "duration",
      label: "Duration",
      render: (row) => {
        const minutes = Math.round(
          (new Date(row.endTime).getTime() - new Date(row.startTime).getTime()) / 60000
        );
        return `${minutes} min`;
      },
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            STATUS_BADGE_CLASS[row.status] ?? "bg-white/10 text-white/50"
          }`}
        >
          {row.status.charAt(0) + row.status.slice(1).toLowerCase()}
        </span>
      ),
    },
    {
      key: "pendingBookingsCount",
      label: "Requests",
      render: (row) =>
        row.pendingBookingsCount && row.pendingBookingsCount > 0 ? (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
            {row.pendingBookingsCount} pending
          </span>
        ) : (
          <span className="text-white/40 text-xs">-</span>
        ),
    },
  ];

  const actions: TableAction<TrainerSlot>[] = [
    {
      label: "View Requests",
      onClick: (row) => navigate(`/trainer/bookings?slotId=${row.id || row._id}`),
      variant: "primary",
      visible: (row) => !!row.pendingBookingsCount && row.pendingBookingsCount > 0,
    },
    {
      label: "Block",
      onClick: (row) => setConfirmConfig({
        isOpen: true,
        title: "Block Slot",
        message: "Are you sure you want to block this slot? No bookings can be made while it is blocked.",
        variant: "danger",
        onConfirm: () => handleBlockSlot(row.id),
      }),
      variant: "danger",
      visible: (row) => row.status === SLOT_STATUS.AVAILABLE && (!row.pendingBookingsCount || row.pendingBookingsCount === 0),
    },
    {
      label: "Unblock",
      onClick: (row) => setConfirmConfig({
        isOpen: true,
        title: "Unblock Slot",
        message: "Are you sure you want to unblock this slot? Users will be able to book sessions during this time again.",
        variant: "primary",
        onConfirm: () => handleUnblockSlot(row.id),
      }),
      variant: "primary",
      visible: (row) => row.status === SLOT_STATUS.BLOCKED,
    },
  ];

  if (isLoading) {
    if (isSubSection) {
      return (
        <div className="bg-white/5 rounded-2xl border border-white/10 p-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }
    return <ScreenLoader />;
  }

  return (
    <div className={isSubSection ? "space-y-6" : "p-6 md:p-10 max-w-7xl mx-auto space-y-6"}>
      {!isSubSection && (
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">My Slots</h1>
          <p className="text-white/60">
            Slots generated from your availability. Booking requests are handled from the Bookings page.
          </p>
        </div>
      )}

      {isSubSection && (
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">My Slots</h2>
          <p className="text-white/60">
            All generated slots currently in the system. Use filters to narrow down.
          </p>
        </div>
      )}

      <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
        {(slots.length > 0 || status || dateFilter) && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full">
              <div className="w-full md:w-64">
                <SortDropdown
                  options={[
                    { label: "Start Time", value: "startTime" },
                    { label: "Status", value: "status" },
                  ]}
                  value={sort}
                  onSortChange={(val) => setSort(val as SortConfig)}
                />
              </div>
              <div className="w-full md:w-auto">
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                  className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-[42px]"
                >
                  <option value="">All Statuses</option>
                  <option value={SLOT_STATUS.AVAILABLE}>Available</option>
                  <option value={SLOT_STATUS.BOOKED}>Booked</option>
                  <option value={SLOT_STATUS.EXPIRED}>Expired</option>
                </select>
              </div>
              <div className="w-full md:w-auto">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setPage(1);
                  }}
                  className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-[42px]"
                  aria-label="Filter by date"
                />
              </div>
            </div>

            {!isSubSection && (
              <button
                onClick={() => navigate("/trainer/availability/create")}
                className="w-full md:w-auto whitespace-nowrap px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
              >
                + Add Availability
              </button>
            )}
          </div>
        )}

        {slots.length > 0 ? (
          <div className="space-y-4">
            <DataTable columns={columns} data={slots} actions={actions} />
            {pagination && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={setPage}
                onItemsPerPageChange={setLimit}
              />
            )}
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <p className="text-white/60">No slots yet. Create availability to generate bookable slots.</p>
            {!isSubSection && (
              <button
                onClick={() => navigate("/trainer/availability/create")}
                className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
              >
                + Add Availability
              </button>
            )}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        variant={confirmConfig.variant}
      />
    </div>
  );
};


export default TrainerSlotList;