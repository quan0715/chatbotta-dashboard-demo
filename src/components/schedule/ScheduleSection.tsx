import React from "react";
import { cn } from "@/lib/utils";
import { CountIndicator } from "./CountIndicator";
import { ScheduleCard } from "./ScheduleCard";
import { SectionDivider } from "./SectionDivider";
import { ScheduleSectionProps } from "./types";

/**
 * 排班分類區塊組件 - 包含標題、數量指示器和排班卡片
 */
export function ScheduleSection({ section, className }: ScheduleSectionProps) {
  const { title, color, assistantCount, schedules } = section;

  // 按順序排序
  const sortedSchedules = [...schedules].sort((a, b) => a.order - b.order);
  // 第一個作為主要卡片
  const primarySchedule = sortedSchedules[0];
  // 其他作為次要卡片
  const secondarySchedules = sortedSchedules.slice(1);

  return (
    <div className={cn("mb-8", className)}>
      <SectionDivider title={title} />

      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* 數量指示器 */}
        <div className="flex-shrink-0">
          <CountIndicator count={assistantCount} label="人數" color={color} />
        </div>

        {/* 排班卡片水平滾動容器 */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 pb-2">
            {/* 主要排班卡片 */}
            {primarySchedule && (
              <ScheduleCard
                employee={primarySchedule}
                variant="primary"
                color={color}
                showArrow={secondarySchedules.length > 0}
                className="flex-shrink-0 min-w-[240px]"
              />
            )}

            {/* 次要排班卡片 */}
            {secondarySchedules.map((schedule, index) => (
              <ScheduleCard
                key={schedule.id}
                employee={schedule}
                variant="secondary"
                showArrow={index < secondarySchedules.length - 1}
                className="flex-shrink-0 min-w-[200px]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
