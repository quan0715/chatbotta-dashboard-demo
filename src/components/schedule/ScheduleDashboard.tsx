"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { DraggableScheduleSection } from "./DraggableScheduleSection";
import { ScheduleDashboardProps, ScheduleItem } from "./types";
import { useSwipeable } from "react-swipeable";
import { ChevronLeft, ChevronRight } from "lucide-react";

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

/**
 * 排班儀表板主組件
 */
export function ScheduleDashboard({
  sections: initialSections,
  loading = false,
  error = null,
  className,
  onOrderChange,
}: ScheduleDashboardProps & {
  className?: string;
  onOrderChange?: (sectionId: string, newOrder: ScheduleItem[]) => void;
}) {
  const [sections, setSections] = useState(initialSections);
  const isMobile = useIsMobile();
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [swiping, setSwiping] = React.useState<null | "left" | "right">(null);

  // 當初始資料變更時更新本地狀態
  React.useEffect(() => {
    setSections(initialSections);
    setCurrentIdx(0);
  }, [initialSections]);

  const handleOrderChange = (sectionId: string, newOrder: ScheduleItem[]) => {
    // 更新本地狀態
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId ? { ...section, schedules: newOrder } : section
      )
    );

    // 通知父組件
    if (onOrderChange) {
      onOrderChange(sectionId, newOrder);
    }
  };

  // swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      setSwiping(null);
      setCurrentIdx((idx) => Math.min(idx + 1, sections.length - 1));
    },
    onSwipedRight: () => {
      setSwiping(null);
      setCurrentIdx((idx) => Math.max(idx - 1, 0));
    },
    onSwiping: (e) => {
      if (e.dir === "Left" && currentIdx < sections.length - 1)
        setSwiping("left");
      else if (e.dir === "Right" && currentIdx > 0) setSwiping("right");
      else setSwiping(null);
    },
    onSwiped: () => setSwiping(null),
    trackMouse: true,
  });

  if (loading) {
    return (
      <div className={cn("space-y-8", className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-px flex-1" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_repeat(auto-fit,minmax(200px,1fr))] gap-4 items-center">
              <Skeleton className="w-20 h-20 rounded-lg" />
              <Skeleton className="h-20 min-w-[240px] rounded-lg" />
              <Skeleton className="h-20 min-w-[200px] rounded-lg" />
              <Skeleton className="h-20 min-w-[200px] rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center p-8",
          "bg-red-50 border border-red-200 rounded-lg",
          className
        )}
      >
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-900 mb-2">
            載入排班資料時發生錯誤
          </h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!sections || sections.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center p-8",
          "bg-gray-50 border border-gray-200 rounded-lg",
          className
        )}
      >
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            暫無排班資料
          </h3>
          <p className="text-gray-600">請稍後再試或聯繫管理員</p>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div
        {...swipeHandlers}
        className={cn("relative overflow-hidden", className)}
      >
        {/* 滑動容器 */}
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(-${currentIdx * 100}%)`,
            width: `${sections.length * 100}%`,
          }}
        >
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="w-full flex-shrink-0 px-2"
              style={{ width: `${100 / sections.length}%` }}
            >
              <DraggableScheduleSection
                section={section}
                onOrderChange={handleOrderChange}
                isMobile
              />
            </div>
          ))}
        </div>

        {/* 滑動提示 icon */}
        {swiping && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            {swiping === "left" && (
              <ChevronRight className="w-16 h-16 text-blue-400 opacity-80 animate-bounce-x" />
            )}
            {swiping === "right" && (
              <ChevronLeft className="w-16 h-16 text-blue-400 opacity-80 animate-bounce-x-reverse" />
            )}
          </div>
        )}

        {/* 左右切換指示器 */}
        <div className="flex justify-between items-center mt-4 px-4">
          <button
            onClick={() => setCurrentIdx((idx) => Math.max(idx - 1, 0))}
            disabled={currentIdx === 0}
            className="p-2 rounded-full bg-white shadow-md text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            ◀
          </button>
          <div className="flex gap-1">
            {sections.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIdx(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIdx
                    ? "bg-blue-500"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() =>
              setCurrentIdx((idx) => Math.min(idx + 1, sections.length - 1))
            }
            disabled={currentIdx === sections.length - 1}
            className="p-2 rounded-full bg-white shadow-md text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            ▶
          </button>
        </div>
      </div>
    );
  }

  // 桌面維持原本多 section 顯示
  return (
    <div className={cn("space-y-2", className)}>
      {sections.map((section) => (
        <DraggableScheduleSection
          key={section.id}
          section={section}
          onOrderChange={handleOrderChange}
        />
      ))}
    </div>
  );
}
