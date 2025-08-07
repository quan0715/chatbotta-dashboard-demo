import { ScheduleSection } from "./types";

/**
 * 模擬排班資料，支援五個班表分類
 */
export const mockScheduleData: ScheduleSection[] = [
  {
    id: "haircut-designer",
    title: "剪髮設計師",
    color: "green",
    assistantCount: 8,
    schedules: [
      {
        id: "hcd-1",
        employeeName: "王美麗",
        order: 1,
        category: "剪髮設計師",
      },
      {
        id: "hcd-2",
        employeeName: "李志明",
        order: 2,
        category: "剪髮設計師",
      },
      {
        id: "hcd-3",
        employeeName: "張小華",
        order: 3,
        category: "剪髮設計師",
      },
      {
        id: "hcd-4",
        employeeName: "陳雅婷",
        order: 4,
        category: "剪髮設計師",
      },
      {
        id: "hcd-5",
        employeeName: "林大偉",
        order: 5,
        category: "剪髮設計師",
      },
      {
        id: "hcd-6",
        employeeName: "黃淑芬",
        order: 6,
        category: "剪髮設計師",
      },
      {
        id: "hcd-7",
        employeeName: "劉建國",
        order: 7,
        category: "剪髮設計師",
      },
      {
        id: "hcd-8",
        employeeName: "吳佳玲",
        order: 8,
        category: "剪髮設計師",
      },
    ],
  },
  {
    id: "dye-designer",
    title: "染髮設計師",
    color: "purple",
    assistantCount: 6,
    schedules: [
      {
        id: "dyd-1",
        employeeName: "趙小敏",
        order: 1,
        category: "染髮設計師",
      },
      {
        id: "dyd-2",
        employeeName: "孫文傑",
        order: 2,
        category: "染髮設計師",
      },
      {
        id: "dyd-3",
        employeeName: "周雅惠",
        order: 3,
        category: "染髮設計師",
      },
      {
        id: "dyd-4",
        employeeName: "鄭志豪",
        order: 4,
        category: "染髮設計師",
      },
      {
        id: "dyd-5",
        employeeName: "許美玲",
        order: 5,
        category: "染髮設計師",
      },
      {
        id: "dyd-6",
        employeeName: "蔡俊宏",
        order: 6,
        category: "染髮設計師",
      },
    ],
  },
  {
    id: "perm-designer",
    title: "燙髮設計師",
    color: "blue",
    assistantCount: 5,
    schedules: [
      {
        id: "pmd-1",
        employeeName: "謝雅芳",
        order: 1,
        category: "燙髮設計師",
      },
      {
        id: "pmd-2",
        employeeName: "羅志成",
        order: 2,
        category: "燙髮設計師",
      },
      {
        id: "pmd-3",
        employeeName: "蘇美惠",
        order: 3,
        category: "燙髮設計師",
      },
      {
        id: "pmd-4",
        employeeName: "胡建華",
        order: 4,
        category: "燙髮設計師",
      },
      {
        id: "pmd-5",
        employeeName: "范淑娟",
        order: 5,
        category: "燙髮設計師",
      },
    ],
  },
  {
    id: "haircut-assistant",
    title: "剪髮助理",
    color: "orange",
    assistantCount: 10,
    schedules: [
      {
        id: "hca-1",
        employeeName: "江小雯",
        order: 1,
        category: "剪髮助理",
      },
      {
        id: "hca-2",
        employeeName: "何志偉",
        order: 2,
        category: "剪髮助理",
      },
      {
        id: "hca-3",
        employeeName: "沈雅琪",
        order: 3,
        category: "剪髮助理",
      },
      {
        id: "hca-4",
        employeeName: "潘文昌",
        order: 4,
        category: "剪髮助理",
      },
      {
        id: "hca-5",
        employeeName: "呂美玲",
        order: 5,
        category: "剪髮助理",
      },
      {
        id: "hca-6",
        employeeName: "高志明",
        order: 6,
        category: "剪髮助理",
      },
      {
        id: "hca-7",
        employeeName: "馬淑芬",
        order: 7,
        category: "剪髮助理",
      },
      {
        id: "hca-8",
        employeeName: "葉建國",
        order: 8,
        category: "剪髮助理",
      },
      {
        id: "hca-9",
        employeeName: "邱佳玲",
        order: 9,
        category: "剪髮助理",
      },
      {
        id: "hca-10",
        employeeName: "梁小華",
        order: 10,
        category: "剪髮助理",
      },
    ],
  },
  {
    id: "perm-assistant",
    title: "燙髮助理",
    color: "red",
    assistantCount: 7,
    schedules: [
      {
        id: "pma-1",
        employeeName: "董雅婷",
        order: 1,
        category: "燙髮助理",
      },
      {
        id: "pma-2",
        employeeName: "袁志豪",
        order: 2,
        category: "燙髮助理",
      },
      {
        id: "pma-3",
        employeeName: "薛美惠",
        order: 3,
        category: "燙髮助理",
      },
      {
        id: "pma-4",
        employeeName: "韓文傑",
        order: 4,
        category: "燙髮助理",
      },
      {
        id: "pma-5",
        employeeName: "溫淑芬",
        order: 5,
        category: "燙髮助理",
      },
      {
        id: "pma-6",
        employeeName: "姜建華",
        order: 6,
        category: "燙髮助理",
      },
      {
        id: "pma-7",
        employeeName: "戴雅琪",
        order: 7,
        category: "燙髮助理",
      },
    ],
  },
];
