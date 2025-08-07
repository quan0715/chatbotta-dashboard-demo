import { NextResponse } from "next/server";
import { googleSheetsService } from "@/lib/googleSheets";
import { mockScheduleData } from "@/components/schedule";

/**
 * 取得排班資料 API
 */
export async function GET() {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // 檢查 Google Sheets 是否已正確設定
    if (!googleSheetsService.isConfigured() || !spreadsheetId) {
      console.warn("Google Sheets 未設定或配置不完整，使用模擬資料");
      return NextResponse.json({
        success: true,
        data: mockScheduleData,
        source: "mock",
      });
    }

    // 嘗試從 Google Sheets 取得資料
    try {
      const scheduleData = await googleSheetsService.getScheduleData(
        spreadsheetId
      );

      return NextResponse.json({
        success: true,
        data: scheduleData,
        source: "google-sheets",
        lastUpdated: new Date().toISOString(),
      });
    } catch (sheetsError) {
      console.error("Google Sheets API 錯誤:", sheetsError);

      // 如果 Google Sheets 失敗，回退到模擬資料
      return NextResponse.json({
        success: true,
        data: mockScheduleData,
        source: "mock-fallback",
        error: "Google Sheets 連線失敗，使用備用資料",
      });
    }
  } catch (error) {
    console.error("API 錯誤:", error);

    return NextResponse.json(
      {
        success: false,
        error: "取得排班資料時發生錯誤",
        data: mockScheduleData,
        source: "error-fallback",
      },
      { status: 500 }
    );
  }
}

/**
 * 取得 API 狀態和設定資訊
 */
export async function HEAD() {
  const hasGoogleConfig =
    googleSheetsService.isConfigured() && !!process.env.GOOGLE_SHEET_ID;

  return new NextResponse(null, {
    status: 200,
    headers: {
      "X-Google-Sheets-Configured": hasGoogleConfig.toString(),
      "X-API-Version": "1.0",
    },
  });
}
