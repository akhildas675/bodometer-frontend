import React, { useEffect, useState } from "react";
import trainerServices from "@/services/trainer/trainer.service";
import { parseApiError } from "@/api/error.helper";
import DataTable from "@/components/ui/table/data.table";
import type { TableColumn, TableAction } from "@/components/ui/table/table.types";
import { TrainerAvailability, TimeWindow } from "@/interface/booking.interface";
import { PaginationMeta } from "@/interface/common.interface";
import Pagination from "@/components/controls/pagination/pagination";
import SearchBar from "@/components/controls/search/search";
import SortDropdown, { SortConfig } from "@/components/controls/sort/sort";
import { format } from "date-fns";
import { toast } from "sonner";
import { ScreenLoader } from "@/components/ui/screen-loader";
import PrimaryButton from "@/components/ui/primary.button";
import InputBox from "@/components/ui/input.box";

const TrainerSlotsPage: React.FC = () => {
  const [availabilities, setAvailabilities] = useState<TrainerAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Table controls state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortConfig>({ field: "createdAt", order: "desc" });
  const [status, setStatus] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  // Availability Configuration State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timeWindows, setTimeWindows] = useState<TimeWindow[]>([{ startTime: "09:00", endTime: "17:00" }]);
  const [sessionDuration, setSessionDuration] = useState("60");
  const [isCreating, setIsCreating] = useState(false);

  const fetchAvailabilities = async () => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit,
        search,
        sortBy: sort.field,
        sortOrder: sort.order,
        status: status || undefined,
      };
      const res = await trainerServices.getAvailabilities(params);
      if (res.success && res.data) {
        setAvailabilities(res.data);
        setPagination(res.pagination);
      }
    } catch (error) {
      toast.error(parseApiError(error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailabilities();
  }, [page, limit, search, sort, status]);

  const handleAddTimeWindow = () => {
    if (timeWindows.length >= 4) {
      toast.error("Maximum of 4 time windows allowed.");
      return;
    }
    setTimeWindows([...timeWindows, { startTime: "", endTime: "" }]);
  };

  const handleRemoveTimeWindow = (index: number) => {
    if (timeWindows.length === 1) return;
    const updated = [...timeWindows];
    updated.splice(index, 1);
    setTimeWindows(updated);
  };

  const handleTimeWindowChange = (index: number, field: keyof TimeWindow, value: string) => {
    const updated = [...timeWindows];
    updated[index][field] = value;
    setTimeWindows(updated);
  };

  const handleCreateAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !sessionDuration) return;
    
    // Validate time windows
    if (timeWindows.some(tw => !tw.startTime || !tw.endTime)) {
      toast.error("Please fill in all time windows.");
      return;
    }

    setIsCreating(true);
    try {
      const res = await trainerServices.createAvailability({
        startDate,
        endDate,
        timeWindows,
        sessionDuration: Number(sessionDuration),
      });
      if (res.success) {
        toast.success(res.message || "Availability rule created successfully");
        fetchAvailabilities();
        setStartDate("");
        setEndDate("");
        setTimeWindows([{ startTime: "09:00", endTime: "17:00" }]);
      }
    } catch (error) {
      toast.error(parseApiError(error).message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleAvailabilityStatus = async (availabilityId: string, currentStatus: boolean) => {
    try {
      const res = await trainerServices.updateAvailabilityStatus(availabilityId, { isActive: !currentStatus });
      if (res.success) {
        toast.success("Availability status updated. Future unbooked slots updated accordingly.");
        fetchAvailabilities();
      }
    } catch (error) {
      toast.error(parseApiError(error).message);
    }
  };

  const availabilityColumns: TableColumn<TrainerAvailability>[] = [
    {
      key: "dateRange",
      label: "Date Range",
      render: (row) => `${format(new Date(row.startDate), "MMM dd")} - ${format(new Date(row.endDate), "MMM dd, yyyy")}`
    },
    {
      key: "timeWindows",
      label: "Time Windows",
      render: (row) => (
        <div className="flex flex-col gap-1">
          {row.timeWindows.map((tw, idx) => (
            <span key={idx} className="text-sm bg-white/10 px-2 py-1 rounded inline-block w-max">
              {tw.startTime} - {tw.endTime}
            </span>
          ))}
        </div>
      )
    },
    {
      key: "sessionDuration",
      label: "Duration",
      render: (row) => `${row.sessionDuration} mins`
    },
    {
      key: "isActive",
      label: "Status",
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {row.isActive ? "Active" : "Inactive"}
        </span>
      )
    }
  ];

  const availabilityActions: TableAction<TrainerAvailability>[] = [
    {
      label: (row) => row.isActive ? "Deactivate" : "Activate",
      onClick: (row) => handleToggleAvailabilityStatus(row._id, row.isActive),
      variant: "primary",
    }
  ];

  if (isLoading) return <ScreenLoader />;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Availability Configurations</h1>
        <p className="text-white/60">Configure your availability rules to automatically manage bookable slots.</p>
      </div>

      <div className="space-y-8">
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Create New Availability Rule</h2>
          <form onSubmit={handleCreateAvailability} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Start Date</label>
                  <InputBox
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">End Date</label>
                  <InputBox
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    min={startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Session Duration</label>
                  <select
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(e.target.value)}
                    className="w-full bg-[#19245a] border-none rounded-full px-5 py-3 shadow-md shadow-black/30 outline-none text-sm text-slate-100"
                    required
                  >
                    <option value="30">30 Minutes</option>
                    <option value="45">45 Minutes</option>
                    <option value="60">60 Minutes</option>
                    <option value="90">90 Minutes</option>
                    <option value="120">120 Minutes</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-white/80">Time Windows</label>
                {timeWindows.length < 4 && (
                  <button 
                    type="button" 
                    onClick={handleAddTimeWindow}
                    className="text-xs font-medium bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-full hover:bg-indigo-500/40 transition-colors"
                  >
                    + Add Window
                  </button>
                )}
              </div>
              
              <div className="space-y-3">
                {timeWindows.map((tw, index) => (
                  <div key={index} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10">
                    <div className="flex-1">
                      <label className="block text-xs text-white/50 mb-1">Start Time</label>
                      <InputBox
                        type="time"
                        value={tw.startTime}
                        onChange={(e) => handleTimeWindowChange(index, "startTime", e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-white/50 mb-1">End Time</label>
                      <InputBox
                        type="time"
                        value={tw.endTime}
                        onChange={(e) => handleTimeWindowChange(index, "endTime", e.target.value)}
                        required
                      />
                    </div>
                    {timeWindows.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTimeWindow(index)}
                        className="mt-5 text-red-400 hover:text-red-300 p-2"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10 w-full md:w-auto md:ml-auto">
              <div className="w-full md:w-64">
                <PrimaryButton type="submit" loading={isCreating} text="Save Availability" />
              </div>
            </div>
          </form>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-lg font-semibold text-white">Availability Rules</h2>
            {(availabilities.length > 0 || search || status) && (
              <div className="flex flex-wrap items-center gap-3">
                <div className="w-full md:w-64">
                  <SearchBar 
                    value={search} 
                    onSearch={(val) => { setSearch(val); setPage(1); }} 
                    placeholder="Search rules..." 
                  />
                </div>
                <div className="w-full md:w-64">
                  <SortDropdown
                    options={[
                      { label: "Date Created", value: "createdAt" },
                      { label: "Start Date", value: "startDate" },
                      { label: "End Date", value: "endDate" },
                      { label: "Duration", value: "sessionDuration" }
                    ]}
                    value={sort}
                    onSortChange={(val) => setSort(val as SortConfig)}
                  />
                </div>
                <div>
                  <select
                    value={status}
                    onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                    className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          {availabilities.length > 0 ? (
            <div className="space-y-4">
              <DataTable columns={availabilityColumns} data={availabilities} actions={availabilityActions} />
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
              <p className="text-white/60">No availability rules found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerSlotsPage;
