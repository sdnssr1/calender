import {
  addDays,
  endOfWeek,
  format,
  startOfWeek,
  subDays
} from "date-fns";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Event } from "../types/events";
import CalendarGrid from "./CalendarGrid";
import CalendarRightSidebar from "./CalendarRightSidebar";
import EventModal from "./EventModal";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import VerticalNavSidebar from "./VerticalNavSidebar";

type ViewType = "day" | "week" | "month";

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Navigation functions
  const handlePrevious = () => {
    if (currentView === "day") {
      setCurrentDate(subDays(currentDate, 1));
    } else if (currentView === "week") {
      setCurrentDate(subDays(currentDate, 7));
    } else {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      setCurrentDate(newDate);
    }
  };

  const handleNext = () => {
    if (currentView === "day") {
      setCurrentDate(addDays(currentDate, 1));
    } else if (currentView === "week") {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
      setCurrentDate(newDate);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const formatDateRange = () => {
    if (currentView === "day") {
      return format(currentDate, "MMMM d, yyyy");
    } else if (currentView === "week") {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
    } else {
      return format(currentDate, "MMMM yyyy");
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      {/* Add the left navigation sidebar */}
      <VerticalNavSidebar />

      {/* Main content wrapper */}
      <div className="flex flex-col flex-1 pl-16">
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
              <div className="flex items-center ml-4 px-3 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                <span className="text-sm font-medium">
                  Spring Semester 2023
                </span>
              </div>
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
        <div className="flex-1 flex mt-4">
          {/* Main Calendar Area */}
          <div className="flex-1 overflow-auto px-4">
            <CalendarGrid
              view={currentView}
              currentDate={currentDate}
              events={events}
              onEventClick={handleEventClick}
              onDateClick={(date) => setCurrentDate(date)}
            />
          </div>

          {/* Right Sidebar - Fixed width, always visible */}
          <aside className="w-[320px] flex-shrink-0 border-l border-gray-200 bg-white">
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
    </div>
  );
}
