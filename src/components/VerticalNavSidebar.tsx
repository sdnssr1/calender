import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckSquare,
  BarChart2,
  Clock,
  MessageSquare,
  User,
  Settings,
} from "lucide-react";

export default function VerticalNavSidebar() {
  const [activeTab, setActiveTab] = useState("calendar");

  const navItems = [
    { id: "calendar", icon: <Calendar size={20} />, label: "Calendar" },
    { id: "tasks", icon: <CheckSquare size={20} />, label: "Tasks" },
    { id: "stats", icon: <BarChart2 size={20} />, label: "Statistics" },
    { id: "clock", icon: <Clock size={20} />, label: "Time Tracking" },
    { id: "chat", icon: <MessageSquare size={20} />, label: "Messages" },
    { id: "profile", icon: <User size={20} />, label: "Profile" },
    { id: "settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-16 z-50 bg-white border-r shadow-sm flex flex-col items-center justify-between py-4">
      <div className="flex flex-col items-center space-y-1">
        {/* App logo */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold mb-4">
          S
        </div>

        {/* Navigation items */}
        <div className="w-full flex flex-col items-center space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                activeTab === item.id
                  ? "text-blue-600"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              }`}
              title={item.label}
            >
              {activeTab === item.id && (
                <motion.div
                  layoutId="activeNavTab"
                  className="absolute inset-0 bg-blue-100 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              <span className="relative z-10">{item.icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* User avatar/status at bottom */}
      <div className="mt-auto flex flex-col items-center space-y-2">
        <div className="w-px h-12 bg-slate-200 mb-2" />
        <button
          className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-all"
          title="Your Profile"
        >
          <User size={16} className="text-slate-500" />
        </button>
      </div>
    </aside>
  );
}
