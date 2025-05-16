import React, { useState } from "react";

interface TooltipProps {
  children: React.ReactNode;
}

interface TooltipTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface TooltipContentProps {
  side?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
}

export const TooltipProvider: React.FC<TooltipProps> = ({ children }) => {
  return <>{children}</>;
};

export const Tooltip: React.FC<TooltipProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            isVisible,
          });
        }
        return child;
      })}
    </div>
  );
};

export const TooltipTrigger: React.FC<TooltipTriggerProps> = ({
  asChild,
  children,
  ...props
}) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, props);
  }
  return <div {...props}>{children}</div>;
};

export const TooltipContent: React.FC<
  TooltipContentProps & { isVisible?: boolean }
> = ({ side = "top", children, isVisible }) => {
  if (!isVisible) return null;

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  return (
    <div
      className={`absolute z-50 px-2 py-1 text-xs text-white bg-slate-900 rounded shadow-lg whitespace-nowrap ${positionClasses[side]}`}
    >
      {children}
    </div>
  );
};

const StudentDashboard = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
        <p>Welcome to your student dashboard!</p>
      </div>
    </div>
  );
};

export default StudentDashboard;
