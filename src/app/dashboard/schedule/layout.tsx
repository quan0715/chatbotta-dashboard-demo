import { Metadata } from "next";

export const metadata: Metadata = {
  title: "排班管理儀表板 | Widget Dashboard",
  description: "美髮沙龍助理排班管理系統",
};

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
