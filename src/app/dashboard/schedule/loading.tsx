import React from "react";
import { ScheduleDashboard } from "@/components/schedule";

/**
 * 排班頁面載入狀態
 */
export default function ScheduleLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* 頁面標題 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          排班管理儀表板
        </h1>
        <p className="text-gray-600">美髮沙龍助理排班一覽</p>
      </div>

      {/* 載入中的儀表板 */}
      <ScheduleDashboard sections={[]} loading={true} error={null} />
    </div>
  );
}
