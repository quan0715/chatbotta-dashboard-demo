/**
 * 排班系統相關的 TypeScript 型別定義
 */

export interface ScheduleItem {
  id: string;
  employeeName: string;
  order: number; // 排班順序
  category: string; // 班表分類
}

export interface ScheduleSection {
  id: string;
  title: string; // "剪髮設計師", "染髮設計師", "燙髮設計師", "剪髮助理", "燙髮助理"
  color: "green" | "purple" | "blue" | "orange" | "red";
  assistantCount: number;
  schedules: ScheduleItem[];
}

export type ScheduleColor = "green" | "purple" | "blue" | "orange" | "red";

export interface CountIndicatorProps {
  count: number;
  label: string;
  color?: ScheduleColor;
}

export interface ScheduleCardProps {
  employee: ScheduleItem;
  variant: "primary" | "secondary";
  color?: ScheduleColor;
}

export interface ScheduleSectionProps {
  section: ScheduleSection;
  className?: string;
}

export interface SectionDividerProps {
  title: string;
  className?: string;
}

export interface ScheduleDashboardProps {
  sections: ScheduleSection[];
  loading?: boolean;
  error?: string | null;
}
