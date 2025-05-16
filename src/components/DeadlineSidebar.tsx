import { useState } from "react";
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  courseCategory: string;
  priority: "low" | "medium" | "high";
  description?: string;
  color?: string;
};

type DeadlineSidebarProps = {
  events: Event[];
  onEventClick: (event: Event) => void;
};

export default function DeadlineSidebar({
  events,
  onEventClick,
}: DeadlineSidebarProps) {
  const [filter, setFilter] = useState<string>("all");

  // Get the date string for display
  const getDateString = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      // Calculate days difference
      const diffTime = date.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days`;
    }
  };

  // Filter events based on selected tab
  const filteredEvents = events.filter((event) => {
    if (filter === "all") {
      return true;
    } else if (filter === "assignments") {
      return event.title.toLowerCase().includes("assignment");
    } else if (filter === "exams") {
      return event.title.toLowerCase().includes("exam");
    } else if (filter === "events") {
      return !event.title.toLowerCase().includes("assignment") && 
             !event.title.toLowerCase().includes("exam");
    }
    return true;
  });

  // Sort events by date
  const sortedEvents = [...filteredEvents].sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Upcoming Deadlines</h2>
        <Badge variant="outline" className="text-xs">
          {sortedEvents.length}
        </Badge>
      </div>

      {/* Improved filter tabs with equal spacing */}
      <div className="mb-4">
        <Tabs 
          value={filter} 
          onValueChange={setFilter} 
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full h-10">
            <TabsTrigger 
              value="all" 
              className="text-xs sm:text-sm px-1 sm:px-2"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="assignments" 
              className="text-xs sm:text-sm px-1 sm:px-2"
            >
              Assignments
            </TabsTrigger>
            <TabsTrigger 
              value="exams" 
              className="text-xs sm:text-sm px-1 sm:px-2"
            >
              Exams
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="text-xs sm:text-sm px-1 sm:px-2"
            >
              Events
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Deadline list */}
      <div className="space-y-4">
        {sortedEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onEventClick(event)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{event.title}</h3>
                <p className="text-sm text-gray-500">{event.courseCategory}</p>
              </div>
              <Badge
                className={`
                  ${event.priority === "low" ? "bg-green-100 text-green-800" : ""}
                  ${event.priority === "medium" ? "bg-amber-100 text-amber-800" : ""}
                  ${event.priority === "high" ? "bg-red-100 text-red-800" : ""}
                `}
              >
                {event.priority}
              </Badge>
            </div>
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                {event.start.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}{" "}
                at {event.start.toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="mt-2 text-right">
              <Badge variant="outline" className="bg-gray-50">
                {getDateString(event.start)}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}