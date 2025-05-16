import React, { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ScrollArea } from "./ui/scroll-area";
import { Settings, Plus, ChevronDown, Calendar, Clock } from "lucide-react";
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

interface CalendarRightSidebarProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onCreateEvent: () => void;
}

export default function CalendarRightSidebar({
  events = [],
  onEventClick,
  onCreateEvent,
}: CalendarRightSidebarProps) {
  const [deadlineFilter, setDeadlineFilter] = useState<FilterType>("all");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter today's events
  const todaysEvents = events
    .filter((event) => {
      const eventDate = new Date(event.start);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === today.getTime();
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  // Filter upcoming events (events after today)
  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(event.start);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() > today.getTime();
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  // Filter upcoming events based on selected category
  const filteredUpcomingEvents = upcomingEvents.filter((event) => {
    if (deadlineFilter === "all") {
      return true;
    } else if (deadlineFilter === "assignments") {
      return event.title.toLowerCase().includes("assignment");
    } else if (deadlineFilter === "exams") {
      return event.title.toLowerCase().includes("exam");
    } else if (deadlineFilter === "events") {
      return (
        !event.title.toLowerCase().includes("assignment") &&
        !event.title.toLowerCase().includes("exam")
      );
    }
    return true;
  });

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

  // Count events for each filter
  const counts = {
    all: upcomingEvents.length,
    assignments: upcomingEvents.filter((e) =>
      e.title.toLowerCase().includes("assignment"),
    ).length,
    exams: upcomingEvents.filter((e) => e.title.toLowerCase().includes("exam"))
      .length,
    events: upcomingEvents.filter(
      (e) =>
        !e.title.toLowerCase().includes("assignment") &&
        !e.title.toLowerCase().includes("exam"),
    ).length,
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Quick Add Event Button */}
        <div className="mb-6">
          <Button
            onClick={onCreateEvent}
            className="w-full flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Quick Add Event</span>
          </Button>
        </div>

        {/* Today's Events Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Today's Events</h2>
            <Badge variant="outline" className="text-xs">
              {todaysEvents.length}
            </Badge>
          </div>

          <div className="space-y-2">
            {todaysEvents.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">No events scheduled for today</p>
              </div>
            ) : (
              todaysEvents.map((event) => (
                <Card
                  key={event.id}
                  className="p-3 cursor-pointer hover:shadow-md transition-all duration-200"
                  onClick={() => onEventClick(event)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{event.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {event.courseCategory}
                      </p>
                    </div>
                    <Badge
                      className={cn(
                        "text-xs",
                        event.priority === "low" &&
                          "bg-green-100 text-green-800",
                        event.priority === "medium" &&
                          "bg-amber-100 text-amber-800",
                        event.priority === "high" && "bg-red-100 text-red-800",
                      )}
                    >
                      {event.priority}
                    </Badge>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {event.start.toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {event.end.toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        <Separator />

        {/* Upcoming Deadlines Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Upcoming Deadlines</h2>
            <Badge variant="outline" className="text-xs">
              {filteredUpcomingEvents.length}
            </Badge>
          </div>

          {/* Filter tabs */}
          <div className="mb-4">
            <Tabs
              value={deadlineFilter}
              onValueChange={(value) => setDeadlineFilter(value as FilterType)}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 w-full h-10">
                <TabsTrigger
                  value="all"
                  className="text-xs sm:text-sm px-1 sm:px-2"
                >
                  All
                  <Badge
                    variant="secondary"
                    className="ml-1 text-xs h-5 w-5 p-0 flex items-center justify-center"
                  >
                    {counts.all}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="assignments"
                  className="text-xs sm:text-sm px-1 sm:px-2"
                >
                  Assignments
                  <Badge
                    variant="secondary"
                    className="ml-1 text-xs h-5 w-5 p-0 flex items-center justify-center"
                  >
                    {counts.assignments}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="exams"
                  className="text-xs sm:text-sm px-1 sm:px-2"
                >
                  Exams
                  <Badge
                    variant="secondary"
                    className="ml-1 text-xs h-5 w-5 p-0 flex items-center justify-center"
                  >
                    {counts.exams}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="events"
                  className="text-xs sm:text-sm px-1 sm:px-2"
                >
                  Events
                  <Badge
                    variant="secondary"
                    className="ml-1 text-xs h-5 w-5 p-0 flex items-center justify-center"
                  >
                    {counts.events}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-2">
            {filteredUpcomingEvents.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">
                  No{" "}
                  {deadlineFilter === "all"
                    ? "upcoming deadlines"
                    : deadlineFilter}{" "}
                  found
                </p>
              </div>
            ) : (
              filteredUpcomingEvents.map((event) => (
                <Card
                  key={event.id}
                  className="p-3 cursor-pointer hover:shadow-md transition-all duration-200"
                  onClick={() => onEventClick(event)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{event.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {event.courseCategory}
                      </p>
                    </div>
                    <Badge
                      className={cn(
                        "text-xs",
                        event.priority === "low" &&
                          "bg-green-100 text-green-800",
                        event.priority === "medium" &&
                          "bg-amber-100 text-amber-800",
                        event.priority === "high" && "bg-red-100 text-red-800",
                      )}
                    >
                      {event.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center mt-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>
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
                    <div className="flex items-center text-xs">
                      <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {getDateString(event.start)}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        event.title.toLowerCase().includes("assignment") &&
                          "bg-blue-50 text-blue-700",
                        event.title.toLowerCase().includes("exam") &&
                          "bg-purple-50 text-purple-700",
                        !event.title.toLowerCase().includes("assignment") &&
                          !event.title.toLowerCase().includes("exam") &&
                          "bg-gray-50 text-gray-700",
                      )}
                    >
                      {event.title.toLowerCase().includes("assignment")
                        ? "Assignment"
                        : event.title.toLowerCase().includes("exam")
                          ? "Exam"
                          : "Event"}
                    </Badge>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        <Separator />

        {/* Calendar Settings Section */}
        <div>
          <Collapsible className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-lg font-bold">Calendar Settings</h2>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="mt-2">
              <Card className="p-3">
                <div className="space-y-4">
                  {/* View Preference */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Default View</h3>
                    <Tabs defaultValue="week" className="w-full">
                      <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="day">Day</TabsTrigger>
                        <TabsTrigger value="week">Week</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Color Coding */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Color Coding</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-xs">Mathematics</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-xs">Physics</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-xs">English</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-xs">History</span>
                      </div>
                    </div>
                  </div>

                  {/* Other Settings */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      Display Options
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Show weekends</span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">24-hour format</span>
                        <input type="checkbox" className="h-4 w-4" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Show completed events</span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </ScrollArea>
  );
}
