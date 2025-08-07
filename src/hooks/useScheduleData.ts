"use client";

import { useState, useEffect } from "react";
import { ScheduleSection } from "@/components/schedule/types";

interface UseScheduleDataResult {
  data: ScheduleSection[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  source: "google-sheets" | "mock" | "mock-fallback" | "error-fallback" | null;
  lastUpdated: string | null;
}

/**
 * 排班資料獲取 Hook
 */
export function useScheduleData(): UseScheduleDataResult {
  const [data, setData] = useState<ScheduleSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<UseScheduleDataResult["source"]>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/schedule", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setSource(result.source);
        setLastUpdated(result.lastUpdated || null);

        if (result.error) {
          setError(result.error);
        }
      } else {
        throw new Error(result.error || "取得資料失敗");
      }
    } catch (err) {
      console.error("取得排班資料時發生錯誤:", err);
      setError(err instanceof Error ? err.message : "未知錯誤");
      setSource("error-fallback");
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    source,
    lastUpdated,
  };
}
