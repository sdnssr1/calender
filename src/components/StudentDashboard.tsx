import { motion } from "framer-motion";
import { Calendar, Clock, FileText, Home, Settings, User } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

// Dashboard Layout Component
const DashboardLayout = ({
  children,
  rightSidebar,
}: {
  children: React.ReactNode;
  rightSidebar?: React.ReactNode;
}) => {
  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      <NavigationSidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg shadow-lg h-full overflow-auto">
          {children}
        </div>
      </main>
      {rightSidebar && (
        <aside className="w-80 p-4 hidden lg:block">
          <div className="rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg shadow-lg h-full p-4">
            {rightSidebar}
          </div>
        </aside>
      )}
    </div>
  );
};

// Navigation Sidebar Component
const NavigationSidebar = () => {
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { id: "home", icon: <Home size={20} />, label: "Home" },
    { id: "calendar", icon: <Calendar size={20} />, label: "Calendar" },
    { id: "tasks", icon: <FileText size={20} />, label: "Tasks" },
    { id: "profile", icon: <User size={20} />, label: "Profile" },
    { id: "settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <TooltipProvider>
      <aside className="w-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-lg flex flex-col items-center py-6 z-10">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
            S
          </div>
          <div className="h-px w-8 bg-slate-200 dark:bg-slate-700" />
          {navItems.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    activeTab === item.id
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                  }`}
                >
                  {activeTab === item.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <span className="relative z-10">{item.icon}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <div className="mt-auto">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <Clock size={16} className="text-slate-500 dark:text-slate-400" />
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
};

// Main Dashboard Content
const DashboardContent = () => {
  return (
    <div className="p-6 h-full">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">
        Student Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white dark:bg-slate-800 shadow p-6">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">
            Upcoming Assignments
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50"
              >
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-300">
                    Assignment {i}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Due in {i} day{i !== 1 ? "s" : ""}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    i === 1
                      ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      : i === 2
                        ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                  }`}
                >
                  {i === 1 ? "Urgent" : i === 2 ? "Important" : "Normal"}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-white dark:bg-slate-800 shadow p-6">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">
            Study Progress
          </h2>
          <div className="space-y-4">
            {["Mathematics", "Science", "Literature"].map((subject, i) => (
              <div key={subject} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {subject}
                  </span>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {65 + i * 10}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      i === 0
                        ? "bg-blue-500"
                        : i === 1
                          ? "bg-purple-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${65 + i * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Right Sidebar Content
const RightSidebarContent = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
          Today's Schedule
        </h3>
        <div className="space-y-2">
          {[
            {
              time: "09:00 AM",
              title: "Mathematics Lecture",
              location: "Room 101",
            },
            { time: "11:30 AM", title: "Study Group", location: "Library" },
            {
              time: "02:00 PM",
              title: "Physics Lab",
              location: "Science Building",
            },
          ].map((event, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border-l-2 border-blue-500"
            >
              <p className="text-xs font-medium text-blue-500">{event.time}</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {event.title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {event.location}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
          Mood Tracker
        </h3>
        <div className="flex justify-between">
          {["😔", "😐", "🙂", "😊", "😁"].map((emoji, i) => (
            <button
              key={i}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                i === 3
                  ? "bg-blue-100 dark:bg-blue-900/30 scale-110"
                  : "hover:bg-slate-100 dark:hover:bg-slate-700/50"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main StudentDashboard Component
export default function StudentDashboard() {
  return (
    <DashboardLayout rightSidebar={<RightSidebarContent />}>
      <DashboardContent />
    </DashboardLayout>
  );
}
