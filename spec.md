# 排班列表儀表板 - 技術規格文件

## 專案概述

基於 Next.js 15.4.6 + React 19.1.0 + TypeScript + Tailwind CSS + Shadcn/ui 技術棧，開發一個美髮沙龍排班管理儀表板。

### 更新內容

- 首頁直接重定向到儀表板頁面
- 排班卡片採用水平滾動佈局，提供更好的空間利用

## 視覺設計規範

### 整體佈局

- **背景色**: `bg-gray-50`
- **容器**: 最小高度 `min-h-screen`，內邊距 `p-4`
- **卡片流式佈局**: 響應式網格系統
- **分類顯示**: 按服務類型分組（剪髮、護髮、洗髮）

### 色彩系統

```css
/* 主要排班類別 */
剪髮助理: 綠色漸層 (emerald-500 to emerald-600)
護髮助理: 紫色漸層 (purple-500 to purple-600)
洗髮助理: 藍色漸層 (cyan-500 to cyan-600)

/* 次要卡片 */
背景: white
邊框: border-gray-200
文字: text-gray-700
```

### 卡片設計

- **數量指示器**: 80×80px，圓角 `rounded-lg`，左側彩色邊框
- **主要卡片**: 最小寬度 240px，高度 80px，彩色漸層背景
- **次要卡片**: 最小寬度 200px，高度 80px，白色背景
- **卡片間距**: `gap-4`
- **陰影**: `shadow-sm` (正常), `shadow-md` (hover)

## 技術架構

### 資料結構

```typescript
interface ScheduleSection {
  id: string;
  title: string; // "剪髮助理排班"
  color: "green" | "purple" | "blue";
  assistantCount: number;
  schedules: ScheduleItem[];
}

interface ScheduleItem {
  id: string;
  employeeName: string;
  position: string; // "洗髮助理-早班"
  isPrimary: boolean;
  isNext?: boolean; // 顯示"下一位"標籤
  shiftDetails: {
    type: string;
    startTime: string;
    endTime: string;
  };
}
```

### 組件架構

```
src/components/schedule/
├── ScheduleDashboard.tsx        # 主儀表板容器
├── ScheduleSection.tsx          # 排班分類區塊
├── CountIndicator.tsx           # 左側數量指示器
├── ScheduleCard.tsx             # 排班卡片組件
├── SectionDivider.tsx           # 分類標題分隔線
└── types.ts                     # TypeScript 型別定義
```

### 頁面結構

```
src/app/dashboard/schedule/
├── page.tsx                     # 主要儀表板頁面
├── loading.tsx                  # 載入狀態頁面
└── error.tsx                    # 錯誤處理頁面
```

## 響應式設計

### 水平滾動佈局

```css
/* 主容器 - 桌面版水平，手機版垂直 */
.schedule-container {
  display: flex;
  flex-direction: column; /* 手機版 */
  gap: 1rem;
}

@media (min-width: 1024px) {
  .schedule-container {
    flex-direction: row; /* 桌面版 */
    align-items: center;
  }
}

/* 卡片滾動區域 */
.schedule-cards {
  flex: 1;
  overflow-x: auto;
}

.schedule-cards-inner {
  display: flex;
  gap: 1rem;
  padding-bottom: 0.5rem; /* 滾動條空間 */
}
```

## 實作步驟

### Phase 1: 基礎設定

1. 安裝依賴套件
2. 新增 Shadcn/ui 組件
3. 建立 TypeScript 型別定義
4. 設定基本路由結構

### Phase 2: 組件開發

1. CountIndicator - 數量指示器
2. ScheduleCard - 排班卡片
3. ScheduleSection - 分類區塊
4. ScheduleDashboard - 主容器

### Phase 3: 頁面整合

1. 建立儀表板主頁面
2. 實作模擬資料
3. 整合所有組件
4. 響應式調整

### Phase 4: 優化完善

1. 動畫效果
2. 載入狀態
3. 錯誤處理
4. 效能優化

## 模擬資料結構

```typescript
const mockScheduleData: ScheduleSection[] = [
  {
    id: "haircut",
    title: "剪髮助理排班",
    color: "green",
    assistantCount: 11,
    schedules: [
      {
        id: "1",
        employeeName: "張大明",
        position: "洗髮助理-早班",
        isPrimary: true,
        shiftDetails: { type: "morning", startTime: "09:00", endTime: "17:00" },
      },
      {
        id: "2",
        employeeName: "張大明",
        position: "剪髮設計師",
        isPrimary: false,
        isNext: true,
        shiftDetails: {
          type: "afternoon",
          startTime: "13:00",
          endTime: "21:00",
        },
      },
      // ... 更多資料
    ],
  },
  // ... 其他分類
];
```

## 技術需求

### 新增依賴

```json
{
  "date-fns": "^3.0.0",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.3.1",
  "googleapis": "^128.0.0",
  "google-auth-library": "^9.0.0"
}
```

### Google Sheets API 整合

#### 環境變數設定

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
GOOGLE_SHEET_ID=your_google_sheet_id_here
```

#### 資料結構對應

| 欄位 | 說明     | 範例                                               |
| ---- | -------- | -------------------------------------------------- |
| A    | 員工姓名 | 王美麗                                             |
| B    | 順序     | 1, 2, 3... (該分類中的排班順序)                    |
| C    | 分類     | 剪髮設計師/染髮設計師/燙髮設計師/剪髮助理/燙髮助理 |

#### 班表分類說明

- **剪髮設計師** (綠色): 負責剪髮服務的設計師
- **染髮設計師** (紫色): 負責染髮服務的設計師
- **燙髮設計師** (藍色): 負責燙髮服務的設計師
- **剪髮助理** (橘色): 協助剪髮服務的助理
- **燙髮助理** (紅色): 協助燙髮服務的助理

### Shadcn/ui 組件

```bash
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add skeleton
npx shadcn@latest add separator
```

## 驗收標準

### 功能驗收

- [x] 顯示三個排班分類（剪髮、護髮、洗髮）
- [x] 正確顯示助理數量
- [x] 主要卡片使用對應顏色漸層
- [x] 次要卡片使用白色背景
- [x] "下一位"標籤正確顯示
- [x] 響應式設計在各裝置正常

### 視覺驗收

- [x] 符合提供的設計範例
- [x] 色彩搭配協調
- [x] 卡片間距一致
- [x] 文字層級清晰
- [x] hover 效果順暢

### 效能驗收

- [x] 頁面載入時間 < 2 秒
- [x] 組件渲染流暢
- [x] 無記憶體洩漏
- [x] 程式碼結構清晰

---

_此規格文件將作為開發的標準依據，所有實作都應遵循此文件的規範。_
