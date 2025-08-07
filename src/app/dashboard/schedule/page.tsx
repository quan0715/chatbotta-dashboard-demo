"use client";

import React from "react";
import { ScheduleDashboard } from "@/components/schedule";
import { useScheduleData } from "@/hooks/useScheduleData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Database, AlertCircle, Save } from "lucide-react";
import { ScheduleItem } from "@/components/schedule/types";

/**
 * 排班儀表板頁面
 */
export default function SchedulePage() {
  const { data, loading, error, refetch, source, lastUpdated } =
    useScheduleData();
  const [hasChanges, setHasChanges] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const getSourceBadge = () => {
    switch (source) {
      case "google-sheets":
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 hover:bg-green-100"
          >
            <Database className="w-3 h-3 mr-1" />
            Google Sheets
          </Badge>
        );
      case "mock":
        return (
          <Badge variant="secondary">
            <AlertCircle className="w-3 h-3 mr-1" />
            模擬資料
          </Badge>
        );
      case "mock-fallback":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-800 border-yellow-200"
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            備用資料
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleOrderChange = async (
    sectionId: string,
    newOrder: ScheduleItem[]
  ) => {
    setHasChanges(true);

    // 這裡可以實作自動儲存或手動儲存邏輯
    console.log(`分類 ${sectionId} 的順序已變更:`, newOrder);
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      // 這裡可以實作將變更同步到 Google Sheets 的邏輯
      // 目前只是模擬儲存
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setHasChanges(false);
      console.log("變更已儲存");
    } catch (error) {
      console.error("儲存失敗:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頁面標題區域 */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-start gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                排班管理儀表板
              </h1>
              <p className="text-gray-600">美髮沙龍助理排班一覽</p>
            </div>
            {getSourceBadge()}
            <div className="flex flex-col gap-2 w-full max-w-xs">
              {hasChanges && (
                <Button
                  onClick={handleSaveChanges}
                  variant="default"
                  size="sm"
                  disabled={saving}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Save
                    className={`w-4 h-4 ${saving ? "animate-pulse" : ""}`}
                  />
                  {saving ? "儲存中..." : "儲存變更"}
                </Button>
              )}
              <Button
                onClick={refetch}
                variant="outline"
                size="sm"
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                重新整理
              </Button>
            </div>
          </div>

          {/* 資料來源資訊 */}
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              最後更新時間：{new Date(lastUpdated).toLocaleString("zh-TW")}
            </p>
          )}
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 錯誤訊息 */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">載入失敗</span>
            </div>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        )}

        {/* 排班儀表板 */}
        <ScheduleDashboard
          sections={data}
          loading={loading}
          error={null} // 錯誤訊息已在上方顯示
          onOrderChange={handleOrderChange}
        />
      </div>
    </div>
  );
}

// 注意：使用 "use client" 的組件無法導出 metadata
// metadata 需要在 layout.tsx 或 server component 中設定
