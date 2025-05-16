import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EventItemProps {
  id?: string;
  title?: string;
  time?: string;
  courseCategory?: string;
  priority?: "low" | "medium" | "high";
  isDragging?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

const categoryColors = {
  math: "bg-blue-100 border-blue-300 text-blue-800",
  science: "bg-green-100 border-green-300 text-green-800",
  english: "bg-purple-100 border-purple-300 text-purple-800",
  history: "bg-amber-100 border-amber-300 text-amber-800",
  art: "bg-pink-100 border-pink-300 text-pink-800",
  default: "bg-gray-100 border-gray-300 text-gray-800",
};

const priorityBadges = {
  low: { variant: "outline", className: "text-green-600 border-green-600" },
  medium: { variant: "outline", className: "text-amber-600 border-amber-600" },
  high: { variant: "outline", className: "text-red-600 border-red-600" },
};

const EventItem = ({
  id = "event-1",
  title = "Untitled Event",
  time = "10:00 AM",
  courseCategory = "default",
  priority = "low",
  isDragging = false,
  onClick = () => {},
  onDragStart = () => {},
  onDragEnd = () => {},
}: EventItemProps) => {
  const categoryColor =
    categoryColors[courseCategory as keyof typeof categoryColors] ||
    categoryColors.default;
  const priorityBadge = priorityBadges[priority];

  return (
    <Card
      className={cn(
        "w-full h-full min-h-[60px] p-2 cursor-pointer border-l-4 select-none",
        categoryColor,
        isDragging && "opacity-50 shadow-lg",
        "hover:shadow-md transition-all duration-200",
      )}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      data-event-id={id}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="font-medium text-sm truncate">{title}</div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs opacity-75">{time}</span>
          {priority && (
            <Badge
              variant={priorityBadge.variant as any}
              className={cn("text-xs", priorityBadge.className)}
            >
              {priority}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EventItem;
