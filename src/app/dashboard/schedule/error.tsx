"use client";

import React from "react";
import { Button } from "@/components/ui/button";

/**
 * 排班頁面錯誤處理
 */
interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ScheduleError({ error, reset }: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* 頁面標題 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          排班管理儀表板
        </h1>
        <p className="text-gray-600">美髮沙龍助理排班一覽</p>
      </div>

      {/* 錯誤訊息 */}
      <div className="flex items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-red-900 mb-4">
            載入排班資料時發生錯誤
          </h2>
          <p className="text-red-700 mb-6">
            {error.message || "未知錯誤，請稍後再試"}
          </p>
          <Button onClick={reset} className="bg-red-600 hover:bg-red-700">
            重新載入
          </Button>
        </div>
      </div>
    </div>
  );
}
