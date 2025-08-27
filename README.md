# Todo List 應用程式

一個純前端的待辦事項管理應用程式，使用 HTML、CSS 和 JavaScript 開發。

## 功能特色

- ✅ 新增待辦事項（包含標題和描述）
- ✅ 刪除待辦事項
- ✅ 點擊待辦事項展開/收起描述
- ✅ 複選框標記完成狀態
- ✅ 響應式設計
- ✅ 自動滾動條
- ✅ 固定頂部區域

## 技術架構

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **套件管理**: Yarn
- **版本控制**: Git

## 安裝與執行

1. 確保已安裝 Node.js 和 Yarn
2. 克隆專案：
   ```bash
   git clone <repository-url>
   cd todo-js
   ```
3. 安裝依賴：
   ```bash
   yarn install
   ```
4. 在瀏覽器中開啟 `index.html` 檔案

## 使用說明

### 新增待辦事項
1. 在 "new todo" 輸入框中輸入標題
2. 在 "description" 文字框中輸入描述（可選）
3. 點擊 "add" 按鈕或按 Enter 鍵新增

### 管理待辦事項
- **點擊待辦事項**: 展開/收起描述
- **複選框**: 標記完成狀態
- **delete 按鈕**: 刪除待辦事項

### 鍵盤快捷鍵
- **Enter**: 在標題輸入框中新增待辦事項
- **Ctrl + Enter**: 在描述輸入框中新增待辦事項

## 專案結構

```
todo-js/
├── index.html          # 主要 HTML 檔案
├── styles.css          # CSS 樣式
├── script.js           # JavaScript 功能
├── package.json        # Yarn 套件配置
└── README.md           # 專案說明
```

## 開發說明

- 應用程式使用 ES6 類別架構
- 所有功能都是純前端實現，無需後端服務
- 資料儲存在記憶體中，重新整理頁面會回到預設狀態
- 支援響應式設計，適合各種螢幕尺寸

## 授權

此專案僅供學習和個人使用。
