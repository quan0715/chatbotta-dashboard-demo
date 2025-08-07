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
  const [fadeKey, setFadeKey] = React.useState(0);
  const prevSectionsLen = React.useRef(sections.length);

  // 當初始資料變更時更新本地狀態
  React.useEffect(() => {
    setSections(initialSections);
    setCurrentIdx(0);
  }, [initialSections]);

  // 只在 sections.length 變動時才 reset currentIdx
  React.useEffect(() => {
    if (sections.length !== prevSectionsLen.current) {
      setCurrentIdx(0);
      prevSectionsLen.current = sections.length;
    }
  }, [sections.length]);

  // 防呆：currentIdx 不超出範圍
  const safeIdx = Math.max(0, Math.min(currentIdx, sections.length - 1));
  const section = sections[safeIdx];

  // 切換動畫 key
  React.useEffect(() => {
    setFadeKey(safeIdx);
  }, [safeIdx]);

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
    if (!section) return null;
    return (
      <div className={cn("relative", className)}>
        {/* 上方切換按鈕與班表名稱 */}
        <div className="flex items-center justify-between mb-4 px-2">
          <button
            onClick={() => setCurrentIdx((idx) => Math.max(idx - 1, 0))}
            disabled={safeIdx === 0}
            className="p-2 rounded-full bg-white shadow text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 text-center text-base font-semibold text-gray-800">
            {section.title}{" "}
            <span className="text-xs text-gray-500">
              ({safeIdx + 1}/{sections.length})
            </span>
          </div>
          <button
            onClick={() =>
              setCurrentIdx((idx) => Math.min(idx + 1, sections.length - 1))
            }
            disabled={safeIdx === sections.length - 1}
            className="p-2 rounded-full bg-white shadow text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div
          key={fadeKey}
          className="transition-opacity duration-300 opacity-100"
        >
          <DraggableScheduleSection
            section={section}
            onOrderChange={handleOrderChange}
            isMobile
          />
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
