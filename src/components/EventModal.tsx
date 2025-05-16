import React, { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

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

type FilterType = "all" | "assignments" | "exams" | "events";

type DeadlineSidebarProps = {
  events: Event[];
  onEventClick: (event: Event) => void;
};

export default function DeadlineSidebar({
  events = [],
  onEventClick,
}: DeadlineSidebarProps) {
  const [filter, setFilter] = useState<FilterType>("all");

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
      return (
        !event.title.toLowerCase().includes("assignment") &&
        !event.title.toLowerCase().includes("exam")
      );
    }
    return true;
  });

  // Sort events by date
  const sortedEvents = [...filteredEvents].sort(
    (a, b) => a.start.getTime() - b.start.getTime(),
  );

  // Count events for each filter
  const counts = {
    all: events.length,
    assignments: events.filter((e) =>
      e.title.toLowerCase().includes("assignment"),
    ).length,
    exams: events.filter((e) => e.title.toLowerCase().includes("exam")).length,
    events: events.filter(
      (e) =>
        !e.title.toLowerCase().includes("assignment") &&
        !e.title.toLowerCase().includes("exam"),
    ).length,
  };

  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "assignments", label: "Assignments" },
    { id: "exams", label: "Exams" },
    { id: "events", label: "Events" },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Upcoming Deadlines</h2>
        <Badge variant="outline" className="text-xs">
          {sortedEvents.length}
        </Badge>
      </div>

      {/* Responsive filter buttons */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((filterOption) => (
            <Button
              key={filterOption.id}
              variant={filter === filterOption.id ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(filterOption.id)}
              className={cn(
                "flex-1 min-w-0 transition-all duration-200",
                "text-xs sm:text-sm",
                "px-2 sm:px-3",
                filter === filterOption.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-muted",
              )}
            >
              <span className="truncate">{filterOption.label}</span>
              <Badge
                variant="secondary"
                className="ml-1 sm:ml-2 text-xs h-5 w-5 p-0 flex items-center justify-center"
              >
                {counts[filterOption.id]}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Deadline list */}
      <div className="space-y-3">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">
              No {filter === "all" ? "upcoming deadlines" : filter} found
            </p>
          </div>
        ) : (
          sortedEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-sm p-3 sm:p-4 cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200"
              onClick={() => onEventClick(event)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm sm:text-base truncate">
                    {event.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                    {event.courseCategory}
                  </p>
                </div>
                <Badge
                  className={cn(
                    "ml-2 text-xs shrink-0",
                    event.priority === "low" &&
                      "bg-green-100 text-green-800 hover:bg-green-200",
                    event.priority === "medium" &&
                      "bg-amber-100 text-amber-800 hover:bg-amber-200",
                    event.priority === "high" &&
                      "bg-red-100 text-red-800 hover:bg-red-200",
                  )}
                >
                  {event.priority}
                </Badge>
              </div>
              <div className="flex items-center mt-2 text-xs sm:text-sm text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0"
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
                <span className="truncate">
                  {event.start.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  at{" "}
                  {event.start.toLocaleTimeString(undefined, {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <div className="flex-1"></div>
                <Badge variant="outline" className="bg-gray-50 text-xs">
                  {getDateString(event.start)}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
