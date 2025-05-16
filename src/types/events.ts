export type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  courseCategory: string;
  priority: "low" | "medium" | "high";
  description?: string;
  color?: string;
};
