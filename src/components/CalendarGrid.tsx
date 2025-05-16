import React from "react";
import {
  format,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { Card } from "./ui/card";
import EventItem from "./EventItem";

interface Event {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  category: string;
  priority: "low" | "medium" | "high";
}

interface CalendarGridProps {
  view: "day" | "week" | "month";
  currentDate: Date;
  events?: Event[];
  onEventClick?: (event: Event) => void;
  onDateClick?: (date: Date) => void;
  onEventDrop?: (event: Event, date: Date) => void;
}

const CalendarGrid = ({
  view = "month",
  currentDate = new Date(),
  events = [],
  onEventClick = () => {},
  onDateClick = () => {},
  onEventDrop = () => {},
}: CalendarGridProps) => {
  // Sample events for demonstration
  const sampleEvents: Event[] = [
    {
      id: "1",
      title: "Math Assignment",
      date: new Date(),
      startTime: "10:00",
      endTime: "11:00",
      category: "math",
      priority: "high",
    },
    {
      id: "2",
      title: "Science Lab",
      date: addDays(new Date(), 2),
      startTime: "14:00",
      endTime: "16:00",
      category: "science",
      priority: "medium",
    },
    {
      id: "3",
      title: "English Essay",
      date: addDays(new Date(), -1),
      startTime: "09:00",
      endTime: "10:30",
      category: "english",
      priority: "low",
    },
  ];

  const allEvents = events.length > 0 ? events : sampleEvents;

  const renderDays = () => {
    const dateFormat = "EEE";
    const days = [];
    const startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium py-2 border-b">
          {format(addDays(startDate, i), dateFormat)}
        </div>,
      );
    }

    return <div className="grid grid-cols-7">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = startOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(day, "d");
        const dayEvents = allEvents.filter((event) =>
          isSameDay(event.date, day),
        );

        days.push(
          <div
            key={day.toString()}
            className={`min-h-[100px] p-1 border ${!isSameMonth(day, monthStart) ? "bg-gray-100 text-gray-400" : "bg-white"}`}
            onClick={() => onDateClick(cloneDay)}
          >
            <div className="text-right p-1">{formattedDate}</div>
            <div className="space-y-1">
              {dayEvents.map((event) => (
                <EventItem
                  key={event.id}
                  event={event}
                  onClick={() => onEventClick(event)}
                  onDragEnd={() => onEventDrop(event, cloneDay)}
                />
              ))}
            </div>
          </div>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>,
      );
      days = [];
    }
    return <div className="bg-white">{rows}</div>;
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayEvents = allEvents.filter((event) =>
      isSameDay(event.date, currentDate),
    );

    return (
      <div className="bg-white border rounded-md">
        <div className="text-center py-4 border-b font-medium">
          {format(currentDate, "EEEE, MMMM d, yyyy")}
        </div>
        <div className="grid grid-cols-[60px_1fr]">
          <div className="border-r">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-20 border-b text-xs text-right pr-2 pt-1"
              >
                {hour === 0
                  ? "12 AM"
                  : hour < 12
                    ? `${hour} AM`
                    : hour === 12
                      ? "12 PM"
                      : `${hour - 12} PM`}
              </div>
            ))}
          </div>
          <div className="relative">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-20 border-b"
                onClick={() =>
                  onDateClick(new Date(currentDate.setHours(hour)))
                }
              ></div>
            ))}
            {dayEvents.map((event) => {
              const startHour = parseInt(event.startTime.split(":")[0]);
              const startMinute = parseInt(event.startTime.split(":")[1]) / 60;
              const endHour = parseInt(event.endTime.split(":")[0]);
              const endMinute = parseInt(event.endTime.split(":")[1]) / 60;
              const duration = endHour + endMinute - (startHour + startMinute);

              return (
                <div
                  key={event.id}
                  className="absolute left-1 right-1"
                  style={{
                    top: `${(startHour + startMinute) * 80}px`,
                    height: `${duration * 80}px`,
                  }}
                >
                  <EventItem
                    event={event}
                    onClick={() => onEventClick(event)}
                    onDragEnd={() => onEventDrop(event, currentDate)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfTheWeek = startOfWeek(currentDate);
    const days = Array.from({ length: 7 }, (_, i) =>
      addDays(startOfTheWeek, i),
    );
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="bg-white border rounded-md">
        <div className="grid grid-cols-[60px_1fr] border-b">
          <div className="border-r"></div>
          <div className="grid grid-cols-7">
            {days.map((day, index) => (
              <div key={index} className="text-center py-2 font-medium">
                <div>{format(day, "EEE")}</div>
                <div>{format(day, "d")}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-[60px_1fr]">
          <div className="border-r">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-20 border-b text-xs text-right pr-2 pt-1"
              >
                {hour === 0
                  ? "12 AM"
                  : hour < 12
                    ? `${hour} AM`
                    : hour === 12
                      ? "12 PM"
                      : `${hour - 12} PM`}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((day, dayIndex) => {
              const dayEvents = allEvents.filter((event) =>
                isSameDay(event.date, day),
              );

              return (
                <div
                  key={dayIndex}
                  className="relative border-r last:border-r-0"
                >
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="h-20 border-b"
                      onClick={() => {
                        const newDate = new Date(day);
                        newDate.setHours(hour);
                        onDateClick(newDate);
                      }}
                    ></div>
                  ))}
                  {dayEvents.map((event) => {
                    const startHour = parseInt(event.startTime.split(":")[0]);
                    const startMinute =
                      parseInt(event.startTime.split(":")[1]) / 60;
                    const endHour = parseInt(event.endTime.split(":")[0]);
                    const endMinute =
                      parseInt(event.endTime.split(":")[1]) / 60;
                    const duration =
                      endHour + endMinute - (startHour + startMinute);

                    return (
                      <div
                        key={event.id}
                        className="absolute left-1 right-1"
                        style={{
                          top: `${(startHour + startMinute) * 80}px`,
                          height: `${duration * 80}px`,
                        }}
                      >
                        <EventItem
                          event={event}
                          onClick={() => onEventClick(event)}
                          onDragEnd={() => onEventDrop(event, day)}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="p-4 bg-background w-full h-full overflow-auto">
      <div className="overflow-auto">
        {view === "month" && (
          <>
            {renderDays()}
            {renderCells()}
          </>
        )}
        {view === "week" && renderWeekView()}
        {view === "day" && renderDayView()}
      </div>
    </Card>
  );
};

export default CalendarGrid;
