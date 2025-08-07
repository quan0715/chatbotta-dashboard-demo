# Google Sheets API 設定指南

## 步驟 1: 建立 Google Cloud 專案

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用 Google Sheets API：
   - 在左側選單中選擇「API 和服務」→「程式庫」
   - 搜尋「Google Sheets API」
   - 點擊並啟用

## 步驟 2: 建立服務帳戶

1. 在 Google Cloud Console 中，前往「API 和服務」→「憑證」
2. 點擊「建立憑證」→「服務帳戶」
3. 輸入服務帳戶名稱和描述
4. 點擊「建立並繼續」
5. 在「角色」部分，選擇「編輯者」或「檢視者」（根據需求）
6. 點擊「完成」

## 步驟 3: 產生金鑰

1. 在憑證頁面中，找到剛建立的服務帳戶
2. 點擊服務帳戶名稱
3. 切換到「金鑰」分頁
4. 點擊「新增金鑰」→「建立新金鑰」
5. 選擇「JSON」格式
6. 下載 JSON 檔案並妥善保存

## 步驟 4: 設定環境變數

1. 在專案根目錄建立 `.env.local` 檔案
2. 從下載的 JSON 檔案中複製資訊：

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
GOOGLE_SHEET_ID=your_google_sheet_id_here
```

**注意**:

- `GOOGLE_PRIVATE_KEY` 需要包含完整的私鑰內容，包括 `-----BEGIN PRIVATE KEY-----` 和 `-----END PRIVATE KEY-----`
- 私鑰中的換行符號需要用 `\\n` 表示

## 步驟 5: 準備 Google Sheets

### 建立排班表格

建立一個 Google Sheets 檔案，包含以下簡化的欄位結構：

| A (員工姓名) | B (順序) | C (分類)   |
| ------------ | -------- | ---------- |
| 王美麗       | 1        | 剪髮設計師 |
| 李志明       | 2        | 剪髮設計師 |
| 張小華       | 3        | 剪髮設計師 |
| 趙小敏       | 1        | 染髮設計師 |
| 孫文傑       | 2        | 染髮設計師 |
| 謝雅芳       | 1        | 燙髮設計師 |
| 江小雯       | 1        | 剪髮助理   |
| 董雅婷       | 1        | 燙髮助理   |

### 分享權限設定

1. 開啟您的 Google Sheets
2. 點擊右上角的「共用」按鈕
3. 在「新增使用者和群組」中，輸入服務帳戶的電子郵件地址
4. 設定權限為「檢視者」或「編輯者」
5. 點擊「傳送」

### 取得 Sheet ID

從 Google Sheets URL 中取得 Sheet ID：

```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
```

Sheet ID 就是：`1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## 步驟 6: 測試設定

1. 重新啟動開發伺服器：`npm run dev`
2. 訪問儀表板頁面
3. 檢查右上角的資料來源標籤：
   - 🟢 **Google Sheets**: 成功連接
   - 🟡 **備用資料**: 連接失敗，使用模擬資料
   - 🔴 **模擬資料**: 未設定 Google Sheets

## 疑難排解

### 常見錯誤

1. **認證失敗**

   - 檢查環境變數是否正確設定
   - 確認私鑰格式正確（包含完整的 BEGIN/END 標記）
   - 確認服務帳戶有存取權限

2. **找不到工作表**

   - 確認 `GOOGLE_SHEET_ID` 正確
   - 確認服務帳戶有該工作表的存取權限

3. **資料格式錯誤**
   - 檢查工作表欄位順序是否正確
   - 確認資料類型符合預期格式

### 偵錯模式

開啟瀏覽器開發者工具的 Console 分頁，可以看到詳細的錯誤訊息和 API 呼叫狀態。

## 資料格式說明

### 欄位對應

- **A 欄 (員工姓名)**: 必填，員工的姓名
- **B 欄 (順序)**: 必填，該分類中的排班順序（數字，如：1, 2, 3...）
- **C 欄 (分類)**: 必填，班表分類名稱

### 支援的班表分類

- **剪髮設計師**: 負責剪髮服務的設計師
- **染髮設計師**: 負責染髮服務的設計師
- **燙髮設計師**: 負責燙髮服務的設計師
- **剪髮助理**: 協助剪髮服務的助理
- **燙髮助理**: 協助燙髮服務的助理

### 分類顏色對應

- **剪髮設計師**: 綠色
- **染髮設計師**: 紫色
- **燙髮設計師**: 藍色
- **剪髮助理**: 橘色
- **燙髮助理**: 紅色

---

完成設定後，您的儀表板將會自動從 Google Sheets 取得最新的排班資料！
