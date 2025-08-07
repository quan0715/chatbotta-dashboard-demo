"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CountIndicator } from "./CountIndicator";
import { ScheduleCard } from "./ScheduleCard";
import { SectionDivider } from "./SectionDivider";
import { ChevronRight } from "lucide-react";
import { ScheduleSectionProps, ScheduleItem } from "./types";

/**
 * 可拖拽的排班卡片組件
 */
function DraggableScheduleCard({
  employee,
  variant,
  color,
  className,
}: {
  employee: ScheduleItem;
  variant: "primary" | "secondary";
  color?: string;
  className?: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: employee.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={className}
    >
      <ScheduleCard
        employee={employee}
        variant={variant}
        color={color as any}
        isDragging={isDragging}
      />
    </div>
  );
}

/**
 * 可拖拽的排班分類區塊組件
 */
export function DraggableScheduleSection({
  section,
  className,
  onOrderChange,
  isMobile = false,
}: ScheduleSectionProps & {
  onOrderChange?: (sectionId: string, newOrder: ScheduleItem[]) => void;
  isMobile?: boolean;
}) {
  console.log("section", section);
  const { title, color, assistantCount, schedules: initialSchedules } = section;
  const [schedules, setSchedules] = useState(initialSchedules);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        delay: isMobile ? 500 : 0, // 手機版長按 500ms 啟動拖拽
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 按順序排序
  const sortedSchedules = [...schedules].sort((a, b) => a.order - b.order);

  // 第一個作為主要卡片
  const primarySchedule = sortedSchedules[0];
  // 其他作為次要卡片
  const secondarySchedules = sortedSchedules.slice(1);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedSchedules.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = sortedSchedules.findIndex((item) => item.id === over.id);

      const newOrder = arrayMove(sortedSchedules, oldIndex, newIndex);

      // 重新分配順序號碼
      const updatedSchedules = newOrder.map((item, index) => ({
        ...item,
        order: index + 1,
      }));

      setSchedules(updatedSchedules);

      // 通知父組件順序變更
      if (onOrderChange) {
        onOrderChange(section.id, updatedSchedules);
      }
    }
  }

  // 所有卡片在一行中水平排列
  const allSchedules = sortedSchedules;

  return (
    <div className={cn("mb-12", className)}>
      <SectionDivider title={title} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedSchedules.map((s) => s.id)}
          strategy={
            isMobile
              ? verticalListSortingStrategy
              : horizontalListSortingStrategy
          }
        >
          {isMobile ? (
            <div className="flex items-start gap-4">
              {/* 數量指示器 */}
              <div className="flex-shrink-0 mt-0">
                <CountIndicator
                  count={assistantCount}
                  label="人數"
                  color={color as any}
                />
              </div>
              {/* 垂直排列卡片，可捲動 */}
              <div className="flex-1 max-h-[70vh] overflow-y-auto">
                <div className="flex flex-col gap-4 pb-2">
                  {allSchedules.map((employee) => (
                    <DraggableScheduleCard
                      key={employee.id}
                      employee={employee}
                      variant={employee.order === 1 ? "primary" : "secondary"}
                      color={employee.order === 1 ? color : undefined}
                      className="w-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-6">
              {/* 數量指示器 */}
              <div className="flex-shrink-0 mt-0">
                <CountIndicator
                  count={assistantCount}
                  label="人數"
                  color={color as any}
                />
              </div>
              {/* 水平滾動的卡片容器 */}
              <div className="flex-1 overflow-x-auto">
                <div className="flex gap-4 items-center pb-4 min-w-max">
                  {allSchedules.map((employee, index) => (
                    <React.Fragment key={employee.id}>
                      <DraggableScheduleCard
                        employee={employee}
                        variant={employee.order === 1 ? "primary" : "secondary"}
                        color={employee.order === 1 ? color : undefined}
                        className="flex-shrink-0"
                      />
                      {/* 箭頭在卡片外面 */}
                      {index < allSchedules.length - 1 && (
                        <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}
        </SortableContext>
      </DndContext>
    </div>
  );
}
