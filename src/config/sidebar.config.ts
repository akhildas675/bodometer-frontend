import type { Role } from "@/constants/role";

export type SidebarItem = {
  label: string;
  path: string;
  children?: SidebarItem[];
};

export type SidebarRole = Role;

export const sidebarConfig: Record<SidebarRole, SidebarItem[]> = {
  admin: [
    { label: "Dashboard", path: "/admin" },
    { label: "Users", path: "/admin/users" },
    { label: "Trainers", path: "/admin/trainers" },
    { label: "Trainer Appointment", path: "/admin/appointments" },
    { label: "Bookings", path: "/admin/bookings" },
  
    {
      label: "Subscription",
      path: "/admin/subscription",
      children: [
        { label: "Plans", path: "/admin/subscription/plans" },
        { label: "Features", path: "/admin/subscription/features" },
        { label: "Transactions", path: "/admin/subscription/transactions" },
      ],
    },
    {
      label: "Questions",
      path: "/admin/questions",
      children: [
        { label: "Groups", path: "/admin/questions/groups" },
        { label: "List", path: "/admin/questions/list" },
      ],
    },
    {
      label: "Fitness",
      path: "/admin/workouts",
      children: [
        { label: "Exercise", path: "/admin/exercises" },
        { label: "Equipment", path: "/admin/equipment" },
        { label: "Target Muscle", path: "/admin/target-muscles" },
        { label: "Category", path: "/admin/category" },
        { label: "Meal Category", path: "/admin/meal-category" },
      ],
    }
  ],

  trainer: [
    { label: "Dashboard", path: "/trainer" },
    { label: "Bookings", path: "/trainer/bookings" },
    { label: "Clients", path: "/trainer/clients" },
    { label: "Messages", path: "/trainer/messages" },
    { label: "Slots", path: "/trainer/slots" },
    { label: "Earnings", path: "/trainer/earnings" },
    { label: "Profile", path: "/trainer/profile" },
  ],

  user: [
    { label: "Dashboard", path: "/" },
    { label: "Fitness Profile", path: "/fitness-profile" },
    { label: "Exercises", path: "/exercises" },
    { label: "Workout Plans", path: "/workout-plans" },
    { label: "Trainers", path: "/trainers" },
    { label: "My Bookings", path: "/my-bookings" },
    { label: "BMI Calculator", path: "/bmi" },
    { label: "Food Log", path: "/food-log" },
    { label: "Health Progress", path: "/health-progress" },
    { label: "Progress", path: "/progress" },
    { label: "Profile", path: "/profile" },
  ],
};