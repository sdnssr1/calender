import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

interface CalendarSidebarProps {
  className?: string;
}

const CalendarSidebar = ({ className }: CalendarSidebarProps) => {
  return (
    <>
      {/* Mobile Drawer (< 1024px) */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[360px] p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sticky Sidebar (>= 1024px) */}
      <div className="hidden lg:block w-[280px] xl:w-[360px] h-full">
        <div className="sticky top-4">
          <SidebarContent className={className} />
        </div>
      </div>
    </>
  );
};

interface SidebarContentProps {
  className?: string;
}

const SidebarContent = ({ className }: SidebarContentProps) => {
  return (
    <Card className={`h-full bg-surface border-stroke ${className}`}>
      <ScrollArea className="h-full">
        <div className="p-4">
          {/* Section 1 Placeholder */}
          <div className="rounded-md border border-stroke p-4 mb-2">
            <div className="h-8 mb-2 bg-muted/20 rounded-md" />
            <div className="space-y-2">
              <div className="h-4 bg-muted/20 rounded-md w-3/4" />
              <div className="h-4 bg-muted/20 rounded-md w-1/2" />
            </div>
          </div>
          <div className="flex h-screen bg-background">
              {/* Left Sidebar */}
              <CalendarSidebar />

              {/* Main Content */}
              <div className="flex-1 flex flex-col">
                {/* ...header and calendar content... */}
              </div>
            </div>
          <Separator className="my-4" />

          {/* Section 2 Placeholder */}
          <div className="rounded-md border border-stroke p-4 mb-2">
            <div className="h-8 mb-2 bg-muted/20 rounded-md" />
            <div className="space-y-2">
              <div className="h-4 bg-muted/20 rounded-md w-full" />
              <div className="h-4 bg-muted/20 rounded-md w-2/3" />
              <div className="h-4 bg-muted/20 rounded-md w-3/4" />
            </div>
          </div>

          <Separator className="my-4" />

          {/* Section 3 Placeholder */}
          <div className="rounded-md border border-stroke p-4">
            <div className="h-8 mb-2 bg-muted/20 rounded-md" />
            <div className="grid grid-cols-2 gap-2">
              <div className="h-20 bg-muted/20 rounded-md" />
              <div className="h-20 bg-muted/20 rounded-md" />
              <div className="h-20 bg-muted/20 rounded-md" />
              <div className="h-20 bg-muted/20 rounded-md" />
            </div>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
};

export default CalendarSidebar;
