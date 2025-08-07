import React from "react";
import { cn } from "@/lib/utils";
import { CountIndicatorProps } from "./types";

/**
 * 數量指示器組件 - 顯示助理數量的左側卡片
 */
export function CountIndicator({
  count,
  label,
  color,
  className,
}: CountIndicatorProps & { className?: string }) {
  const colorClasses = {
    green: "border-l-emerald-500 bg-emerald-50 text-emerald-700",
    purple: "border-l-purple-500 bg-purple-50 text-purple-700",
    blue: "border-l-cyan-500 bg-cyan-50 text-cyan-700",
    orange: "border-l-orange-500 bg-orange-50 text-orange-700",
    red: "border-l-red-500 bg-red-50 text-red-700",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "w-20 h-20 rounded-lg border-l-4 bg-white shadow-sm",
        "transition-shadow duration-200 hover:shadow-md",
        color
          ? colorClasses[color]
          : "border-l-gray-300 bg-gray-50 text-gray-700",
        className
      )}
    >
      <div className="text-2xl font-bold leading-none">{count}</div>
      <div className="text-xs font-medium mt-1 text-center leading-tight">
        {label}
      </div>
    </div>
  );
}
