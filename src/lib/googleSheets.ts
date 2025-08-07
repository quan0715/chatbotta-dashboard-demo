import { google } from "googleapis";
import { JWT } from "google-auth-library";

/**
 * Google Sheets API 整合服務
 */
export class GoogleSheetsService {
  private auth: JWT | null = null;
  private sheets: any = null;
  private configured: boolean = false;

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    // 從環境變數取得認證資訊
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!serviceAccountEmail || !privateKey) {
      console.warn("Google Sheets 認證資訊未設定，將使用模擬資料");
      this.configured = false;
      return;
    }

    try {
      this.auth = new JWT({
        email: serviceAccountEmail,
        key: privateKey,
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
      });

      this.sheets = google.sheets({ version: "v4", auth: this.auth });
      this.configured = true;
    } catch (error) {
      console.error("初始化 Google Sheets 認證時發生錯誤:", error);
      this.configured = false;
    }
  }

  isConfigured(): boolean {
    return this.configured;
  }

  /**
   * 從 Google Sheets 讀取資料
   */
  async getSheetData(spreadsheetId: string, range: string): Promise<any[][]> {
    if (!this.configured || !this.sheets) {
      throw new Error("Google Sheets 未正確設定");
    }

    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      return response.data.values || [];
    } catch (error) {
      console.error("讀取 Google Sheets 資料時發生錯誤:", error);
      throw new Error("無法讀取 Google Sheets 資料");
    }
  }

  /**
   * 取得排班資料並轉換為應用程式格式
   */
  async getScheduleData(spreadsheetId: string): Promise<any> {
    if (!this.configured) {
      throw new Error("Google Sheets 未正確設定");
    }

    try {
      // 新的工作表結構：
      // A: 員工姓名, B: 順序, C: 分類
      const rawData = await this.getSheetData(spreadsheetId, "A2:C100"); // 跳過標題行

      // 按分類分組資料
      const groupedData: { [key: string]: any[] } = {};

      rawData.forEach((row, index) => {
        if (row.length < 3) return; // 跳過不完整的行

        const [name, order, category] = row;

        if (!name || !category) return; // 跳過空行

        const scheduleItem = {
          id: `sheet-${index + 2}`, // 使用行號作為 ID
          employeeName: name,
          order: parseInt(order) || 1,
          category: category,
        };

        const categoryKey = category || "其他";
        if (!groupedData[categoryKey]) {
          groupedData[categoryKey] = [];
        }
        groupedData[categoryKey].push(scheduleItem);
      });

      // 轉換為應用程式所需的格式
      const sections = Object.entries(groupedData).map(
        ([categoryName, schedules]) => ({
          id: this.getCategoryId(categoryName),
          title: `${categoryName}排班`,
          color: this.getCategoryColor(categoryName),
          assistantCount: schedules.length,
          schedules,
        })
      );

      return sections;
    } catch (error) {
      console.error("處理排班資料時發生錯誤:", error);
      throw error;
    }
  }

  /**
   * 取得分類 ID
   */
  private getCategoryId(categoryName: string): string {
    const mapping: { [key: string]: string } = {
      剪髮設計師: "haircut-designer",
      染髮設計師: "dye-designer",
      燙髮設計師: "perm-designer",
      剪髮助理: "haircut-assistant",
      燙髮助理: "perm-assistant",
    };
    return mapping[categoryName] || "other";
  }

  /**
   * 取得分類顏色
   */
  private getCategoryColor(
    categoryName: string
  ): "green" | "purple" | "blue" | "orange" | "red" {
    const mapping: {
      [key: string]: "green" | "purple" | "blue" | "orange" | "red";
    } = {
      剪髮設計師: "green",
      染髮設計師: "purple",
      燙髮設計師: "blue",
      剪髮助理: "orange",
      燙髮助理: "red",
    };
    return mapping[categoryName] || "green";
  }
}

// 單例模式
export const googleSheetsService = new GoogleSheetsService();
