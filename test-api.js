#!/usr/bin/env node

/**
 * 快速測試 API 回應的腳本
 * 使用方法: node test-api.js
 */

const http = require("http");

function testAPI() {
  console.log("🧪 測試排班 API...\n");

  const req = http.get("http://localhost:3000/api/schedule", (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      try {
        const response = JSON.parse(data);

        console.log(`✅ API 狀態: ${response.success ? "成功" : "失敗"}`);
        console.log(`📊 資料來源: ${getSourceLabel(response.source)}`);
        console.log(
          `📅 最後更新: ${
            response.lastUpdated
              ? new Date(response.lastUpdated).toLocaleString("zh-TW")
              : "未知"
          }`
        );

        if (response.error) {
          console.log(`⚠️  警告: ${response.error}`);
        }

        console.log(`\n📋 班表分類 (共 ${response.data.length} 個):`);

        response.data.forEach((section, index) => {
          const colorEmoji = getColorEmoji(section.color);
          console.log(
            `\n${colorEmoji} ${section.title} (${section.assistantCount}人)`
          );

          // 顯示前 5 個員工
          const displayCount = Math.min(section.schedules.length, 5);
          section.schedules.slice(0, displayCount).forEach((employee) => {
            console.log(`   ${employee.order}. ${employee.employeeName}`);
          });

          if (section.schedules.length > 5) {
            console.log(`   ... 還有 ${section.schedules.length - 5} 人`);
          }
        });

        console.log("\n🎉 測試完成！");

        // 驗證資料完整性
        validateData(response.data);
      } catch (error) {
        console.error("❌ 解析 JSON 失敗:", error.message);
        console.log("原始回應:", data);
      }
    });
  });

  req.on("error", (error) => {
    console.error("❌ API 請求失敗:", error.message);
    console.log("請確認開發伺服器是否在 http://localhost:3000 運行");
  });

  req.setTimeout(5000, () => {
    console.error("❌ 請求超時");
    req.destroy();
  });
}

function getSourceLabel(source) {
  const labels = {
    "google-sheets": "🟢 Google Sheets",
    mock: "🟡 模擬資料",
    "mock-fallback": "🟠 備用資料",
    "error-fallback": "🔴 錯誤回退",
  };
  return labels[source] || source;
}

function getColorEmoji(color) {
  const emojis = {
    green: "🟢",
    purple: "🟣",
    blue: "🔵",
    orange: "🟠",
    red: "🔴",
  };
  return emojis[color] || "⚪";
}

function validateData(sections) {
  console.log("\n🔍 資料驗證:");

  const expectedCategories = [
    { name: "剪髮設計師", color: "green", expectedCount: 8 },
    { name: "染髮設計師", color: "purple", expectedCount: 6 },
    { name: "燙髮設計師", color: "blue", expectedCount: 5 },
    { name: "剪髮助理", color: "orange", expectedCount: 10 },
    { name: "燙髮助理", color: "red", expectedCount: 7 },
  ];

  // 支援帶有後綴的分類名稱
  const findSection = (expectedName) => {
    return sections.find(
      (s) => s.title === expectedName || s.title === `${expectedName}排班`
    );
  };

  let allValid = true;

  expectedCategories.forEach((expected) => {
    const section = findSection(expected.name);

    if (!section) {
      console.log(`❌ 缺少分類: ${expected.name}`);
      allValid = false;
      return;
    }

    if (section.color !== expected.color) {
      console.log(
        `❌ ${expected.name} 顏色錯誤: 預期 ${expected.color}, 實際 ${section.color}`
      );
      allValid = false;
    }

    if (section.assistantCount !== expected.expectedCount) {
      console.log(
        `⚠️  ${expected.name} 人數不符: 預期 ${expected.expectedCount}, 實際 ${section.assistantCount}`
      );
    }

    // 檢查順序是否正確
    const orders = section.schedules.map((s) => s.order).sort((a, b) => a - b);
    const expectedOrders = Array.from(
      { length: section.schedules.length },
      (_, i) => i + 1
    );

    if (JSON.stringify(orders) !== JSON.stringify(expectedOrders)) {
      console.log(`⚠️  ${expected.name} 順序不連續`);
    }
  });

  if (allValid) {
    console.log("✅ 所有資料格式正確！");
  }

  console.log(
    `\n📊 總計: ${sections.reduce(
      (sum, s) => sum + s.assistantCount,
      0
    )} 位員工`
  );
}

// 執行測試
testAPI();
