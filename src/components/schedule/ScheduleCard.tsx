import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScheduleCardProps } from "./types";

/**
 * 排班卡片組件 - 顯示員工排班資訊
 */
export function ScheduleCard({
  employee,
  variant = "secondary",
  color,
  className,
  isDragging = false,
  ...props
}: ScheduleCardProps & {
  className?: string;
  isDragging?: boolean;
  [key: string]: any;
}) {
  const isPrimary = variant === "primary";

  const colorClasses = {
    green: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white",
    purple: "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
    blue: "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white",
    orange: "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
    red: "bg-gradient-to-r from-red-500 to-red-600 text-white",
  };

  const cardContent = (
    <CardContent className="p-4 h-full flex flex-col justify-center">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={cn(
                "font-medium truncate",
                isPrimary ? "text-white" : "text-gray-900"
              )}
            >
              {employee.employeeName}
            </h3>
            <Badge
              variant="secondary"
              className={cn(
                "text-xs px-2 py-0.5",
                isPrimary
                  ? "bg-white/20 text-white hover:bg-white/20"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-100"
              )}
            >
              {employee.order === 1 ? "頭班" : `#${employee.order}`}
            </Badge>
          </div>
          <p
            className={cn(
              "text-sm truncate",
              isPrimary ? "text-white/90" : "text-gray-600"
            )}
          >
            {employee.category}
          </p>
        </div>
      </div>
    </CardContent>
  );

  return (
    <Card
      className={cn(
        "min-w-[200px] h-20 transition-all duration-200 hover:shadow-md cursor-grab active:cursor-grabbing",
        isPrimary && color
          ? colorClasses[color]
          : "bg-white border-gray-200 hover:border-gray-300",
        isDragging && "opacity-50 transform rotate-2 shadow-lg",
        className
      )}
      {...props}
    >
      {cardContent}
    </Card>
  );
}
