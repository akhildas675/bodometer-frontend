import { bookingService } from "@/modules/booking/service/booking.service";
import React, { useEffect, useState } from "react";
import { userService } from "@/modules/user/service/user.service";
import { parseApiError } from "@/api/error.helper";
import DataTable from "@/ui.components/ui/table/data.table";
import type { TableColumn, TableAction } from "@/ui.components/ui/table/table.types";
import { TrainerBooking } from "@/interface/booking.interface";
import { PaginationMeta } from "@/interface/common.interface";
import Pagination from "@/features/controls/pagination/pagination";
import SearchBar from "@/features/controls/search/search";
import SortDropdown, { SortConfig } from "@/features/controls/sort/sort";
import { format } from "date-fns";
import { toast } from "sonner";
import { ScreenLoader } from "@/ui.components/ui/screen-loader";
import RejectionModal from "@/features/admin/admin.trainer/components/trainer.appointment-rejection.modal";

const UserMyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<TrainerBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState<{ type: 'cancel' | null, bookingId: string | null }>({ type: null, bookingId: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Table controls state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortConfig>({ field: "bookingDate", order: "desc" });
  const [status, setStatus] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit,
        search,
        sortBy: sort.field,
        sortOrder: sort.order,
        status: status || undefined,
        date: dateFilter || undefined,
      };
      const res = await bookingService.getUserBookings(params);
      if (res.success && res.data) {
        setBookings(res.data as unknown as TrainerBooking[]);
        setPagination(res.pagination);
      }
    } catch (error) {
      toast.error(parseApiError(error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, limit, search, sort, status, dateFilter]);

  const handleCancelBooking = async (reason: string) => {
    if (!modalState.bookingId) return;
    setIsSubmitting(true);
    try {
      const res = await bookingService.cancelBooking(modalState.bookingId, reason);
      if (res.success) {
        toast.success("Booking cancelled successfully");
        fetchBookings();
        setModalState({ type: null, bookingId: null });
      }
    } catch (error) {
      toast.error(parseApiError(error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: TableColumn<TrainerBooking>[] = [
    {
      key: "trainerId",
      label: "Trainer",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.trainerId?.profilePic ? (
            <img src={row.trainerId.profilePic} alt="Trainer" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-xs">{row.trainerId?.name?.charAt(0)}</span>
            </div>
          )}
          <span>{row.trainerId?.name}</span>
        </div>
      )
    },
    {
      key: "bookingDate",
      label: "Date",
      render: (row) => format(new Date(row.bookingDate), "MMM dd, yyyy")
    },
    {
      key: "startTime",
      label: "Time",
      render: (row) => `${row.startTime} - ${row.endTime}`
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
      label: "Cancel",
      onClick: (row) => setModalState({ type: 'cancel', bookingId: row._id }),
      variant: "danger",
      visible: (row) => row.status === 'pending' || row.status === 'approved',
    }
  ];

  if (isLoading) return <ScreenLoader />;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">My Bookings</h1>
        <p className="text-white/60">Manage your upcoming and past trainer sessions.</p>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
        {(bookings.length > 0 || search || status || dateFilter) && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full">
              <div className="w-full md:w-64">
                <SearchBar 
                  value={search} 
                  onSearch={(val) => { setSearch(val); setPage(1); }} 
                  placeholder="Search trainers..." 
                />
              </div>
              <div className="w-full md:w-64">
                <SortDropdown
                  options={[
                    { label: "Booking Date", value: "bookingDate" },
                    { label: "Start Time", value: "startTime" },
                    { label: "Status", value: "status" },
                    { label: "Created At", value: "createdAt" }
                  ]}
                  value={sort}
                  onSortChange={(val) => setSort(val as SortConfig)}
                />
              </div>
              <div className="w-full md:w-auto">
                <select
                  value={status}
                  onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                  className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-[42px]"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="w-full md:w-auto">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
                  className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-[42px]"
                  aria-label="Filter by date"
                />
              </div>
            </div>
          </div>
        )}

        {bookings.length > 0 ? (
          <div className="space-y-4">
            <DataTable columns={columns} data={bookings} actions={actions} />
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
          <div className="text-center py-12">
            <p className="text-white/60">You have no bookings matching the criteria.</p>
          </div>
        )}
      </div>

      {modalState.type === 'cancel' && (
        <RejectionModal
          title="Cancel Booking"
          message="Please provide a reason for cancelling this booking. The trainer will be notified."
          loading={isSubmitting}
          onClose={() => setModalState({ type: null, bookingId: null })}
          onSubmit={handleCancelBooking}
        />
      )}
    </div>
  );
};

export default UserMyBookingsPage;

