import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SidebarLayout from "../../ui/app.sidebar/sidebar.layout";
import DataTable from "../../ui/table/data.table";
import { useAuthStore } from "../../../stores/auth.store";
import { AdminGetSubscriptionResponse } from "@/interface/subscription.interface";
import { TableAction } from "@/components/ui/table/table.types";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";
import adminServices from "@/services/admin/admin.services";

const AdminSubscriptionList = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [subscriptions, setSubscriptions] = useState<AdminGetSubscriptionResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await adminServices.getAllSubscriptions();
      setSubscriptions(response.data);
    } catch {
      toast.error("Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // const handleDelete = async (id: string) => {
  //   if (!window.confirm("Are you sure you want to delete this subscription?")) return;
  //   try {
  //     await adminSubscriptionService.deleteSubscription(id);
  //     toast.success("Subscription deleted successfully");
  //     fetchSubscriptions();
  //   } catch {
  //     toast.error("Failed to delete subscription");
  //   }
  // };

const handleToggle = async (id: string) => {
  try {
    const response = await adminServices.toggleSubscriptionStatus(id);
    toast.success(response.message);
    fetchSubscriptions();
  } catch {
    toast.error("Failed to update subscription status");
  }
};

  const columns = [
    { key: "subscriptionName", label: "Plan Name" },
    { key: "planType", label: "Type" },
    { key: "price", label: "Price (₹)" },
    { key: "durationDays", label: "Duration (days)" },
    { key: "liveSessionCount", label: "Live Sessions" },
    {
      key: "isActive",
      label: "Status",
      render: (row: AdminGetSubscriptionResponse) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          row.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
        }`}>
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

 const actions: TableAction<AdminGetSubscriptionResponse>[] = [
  {
    label: "Edit",
    variant: "primary",
    onClick: (row) => navigate(ADMIN_UI_ROUTES.SUBSCRIPTIONS_EDIT(row.id)),
  },
  {
    label: "Activate",
    variant: "primary",
    visible: (row) => !row.isActive,
    onClick: (row) => handleToggle(row.id), 
  },
  {
    label: "Deactivate",
    variant: "danger",
    visible: (row) => row.isActive,
    onClick: (row) => handleToggle(row.id),   
  },
  // {
  //   label: "Delete",
  //   variant: "danger",
  //   onClick: (row) => handleDelete(row.id),
  // },
];
  if (!user) return <div className="text-white">Loading...</div>;

  return (
    <SidebarLayout role={user.role}>
      <div className="text-white">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-semibold">Subscription Management</h1>
          <button
           onClick={() => navigate(ADMIN_UI_ROUTES.SUBSCRIPTIONS_CREATE)}
            className="px-5 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
          >
            Create Plan
          </button>
        </div>
        {loading ? (
          <div className="text-center text-purple-300 py-10">Loading subscriptions...</div>
        ) : (
          <DataTable columns={columns} data={subscriptions} actions={actions} />
        )}
      </div>
    </SidebarLayout>
  );
};

export default AdminSubscriptionList;