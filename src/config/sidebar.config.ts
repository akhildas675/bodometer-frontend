import type { Role } from "@/constants/role";

export type SidebarItem = {
  label: string;
  path: string;
};

export type SidebarRole = Role
export const sidebarConfig: Record<SidebarRole, SidebarItem[]> = {
  admin: [
    { label: "Dashboard", path: "/admin" },
    { label: "Users", path: "/admin/users" },
    { label: "Trainers", path: "/admin/trainers" },
    { label: "Trainer Appointment", path: "/admin/appointments" },
    { label: "Manage Workouts", path: "/admin/workouts" },
  ],

  trainer: [
    { label: "Dashboard", path: "/trainer" },
    { label: "Sessions", path: "/trainer/sessions" },
    { label: "Clients", path: "/trainer/clients" },
    { label: "Messages", path: "/trainer/messages" },
    { label: "Slots", path: "/trainer/slots" },
    { label: "Earnings", path: "/trainer/earnings" },
    { label: "Profile", path: "/trainer/profile" },
  ],

  user: [
    { label: "Dashboard", path: "/" },
    { label: "Workout Plans", path: "/workouts" },
    { label: "Food Log", path: "/food-log" },
    { label: "Progress", path: "/progress" },
    { label: "Subscriptions", path: "/subscriptions" },
    { label: "Profile", path: "/profile" },
  ],
};
