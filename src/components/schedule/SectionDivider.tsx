import React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { SectionDividerProps } from "./types";

/**
 * 分類標題分隔線組件
 */
export function SectionDivider({ title, className }: SectionDividerProps) {
  return (
    <div className={cn("my-8", className)}>
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900 whitespace-nowrap">
          {title}
        </h2>
        <Separator className="flex-1" />
      </div>
    </div>
  );
}
