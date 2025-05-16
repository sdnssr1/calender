import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import type { Event } from "../types/events";
import CalendarGrid from "./CalendarGrid";
import CalendarRightSidebar from "./CalendarRightSidebar";
import EventModal from "./EventModal";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

type ViewType = "day" | "week" | "month";

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("week");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isEventModalOpen, setIsEventModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState<number>(320); // Default width 320px
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  // Sample events data
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Math Assignment",
      start: new Date(new Date().setHours(10, 0)),
      end: new Date(new Date().setHours(11, 30)),
      courseCategory: "Mathematics",
      priority: "high",
      color: "#4f46e5",
    },
    {
      id: "2",
      title: "Physics Lab",
      start: new Date(new Date().setHours(13, 0)),
      end: new Date(new Date().setHours(15, 0)),
      courseCategory: "Physics",
      priority: "medium",
      color: "#10b981",
    },
    {
      id: "3",
      title: "Literature Review",
      start: new Date(new Date().setDate(new Date().getDate() + 1)),
      end: new Date(new Date().setDate(new Date().getDate() + 1)),
      courseCategory: "English",
      priority: "low",
      color: "#f59e0b",
    },
  ]);

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (currentView === "day") {
      newDate.setDate(newDate.getDate() - 1);
    } else if (currentView === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (currentView === "day") {
      newDate.setDate(newDate.getDate() + 1);
    } else if (currentView === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setIsEventModalOpen(true);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (event: Event) => {
    if (selectedEvent) {
      // Update existing event
      setEvents(events.map((e) => (e.id === event.id ? event : e)));
    } else {
      // Add new event
      setEvents([...events, { ...event, id: Date.now().toString() }]);
    }
    setIsEventModalOpen(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((e) => e.id !== eventId));
    setIsEventModalOpen(false);
  };

  const formatDateRange = () => {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
    };

    if (currentView === "day") {
      return currentDate.toLocaleDateString(undefined, options);
    } else if (currentView === "week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return `${startOfWeek.toLocaleDateString(undefined, { month: "long", day: "numeric" })} - ${endOfWeek.toLocaleDateString(undefined, options)}`;
    } else {
      return currentDate.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      });
    }
  };

  // Handle sidebar resizing
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    resizingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = sidebarWidth;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResizing);
    document.body.style.cursor = "col-resize";
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!resizingRef.current) return;
    const delta = startXRef.current - e.clientX;
    const newWidth = Math.max(
      280,
      Math.min(startWidthRef.current + delta, 500),
    );
    setSidebarWidth(newWidth);
  };

  const stopResizing = () => {
    resizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResizing);
    document.body.style.cursor = "default";
  };

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopResizing);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Welcome Banner */}
      <div className="bg-blue-100 p-4 text-blue-800 text-center font-medium border-b border-blue-200">
        Welcome to the Student Calendar Dashboard
      </div>

      {/* Header */}
      <header className="border-b p-4 bg-card shadow-sm">
        <div className="container mx-auto flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Canvas Calendar</h1>
          </div>

          {/* Date navigation section - improved spacing */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="rounded-r-none"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToday}
                className="px-4 rounded-none border-x-0"
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="rounded-l-none"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="px-3 py-1 border text-sm font-medium min-w-40 text-center rounded-md">
              {formatDateRange()}
            </div>

            {/* Improved tab spacing */}
            <Tabs
              value={currentView}
              onValueChange={(value) => setCurrentView(value as ViewType)}
              className="ml-2"
            >
              <TabsList className="grid grid-cols-3 w-48">
                <TabsTrigger value="day" className="px-4">
                  Day
                </TabsTrigger>
                <TabsTrigger value="week" className="px-4">
                  Week
                </TabsTrigger>
                <TabsTrigger value="month" className="px-4">
                  Month
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Main Calendar Area */}
        <div className="flex-1 overflow-auto p-4">
          <CalendarGrid
            view={currentView}
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
            onDateClick={(date) => setCurrentDate(date)}
          />
        </div>

        {/* Right Sidebar - Fixed width, always visible */}
        <aside className="w-[320px] flex-shrink-0 border-l border-gray-200 bg-white shadow-lg">
          <CalendarRightSidebar
            events={events}
            onEventClick={handleEventClick}
            onCreateEvent={handleCreateEvent}
          />
        </aside>
      </div>

      {/* Event Modal */}
      <EventModal
        events={events}
        onEventClick={handleEventClick}
        onCreateEvent={handleCreateEvent}
      />
    </div>
  );
}
