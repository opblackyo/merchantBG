# 商家後台 (Merchant Backend)

外送平台商家後台管理系統，使用 Vue 3 + Vite 開發。

## 📋 功能特色

- **儀表板 (Dashboard)**: 顯示商家營運統計、待處理訂單概覽
- **訂單管理 (Orders)**: 查看待處理訂單、接單/拒單操作
- **菜單管理 (Menu)**: 菜品的新增、編輯、刪除、上下架管理

## 🛠️ 技術棧

- Vue 3 (Composition API + `<script setup>`)
- Vue Router 4
- Vite 5
- 原生 CSS

## 📁 專案結構

```
/src
  /apis
    merchant.js         # 商家後台 API 模組
  /assets
    /css
      order.css         # 訂單頁面樣式
      menu.css          # 菜單管理樣式
      dashboard.css     # 儀表板樣式
  /utils
    fetcher.js          # API 呼叫工具 (apiGet/apiPost)
  /views
    /merchant
      Dashboard.vue     # 商家儀表板
      Orders.vue        # 待處理訂單
      Menu.vue          # 菜單管理
  App.vue               # 主應用程式組件
  main.js               # 應用程式入口
  router.js             # 路由配置
```

## 🚀 快速開始

### 安裝相依套件

```bash
npm install
```

### 啟動開發伺服器

```bash
npm run dev
```

開發伺服器啟動後，訪問 `http://localhost:5173/`

### 建置生產版本

```bash
npm run build
```

## 🔗 API 端點

本專案預設連接後端 API 伺服器：`http://127.0.0.1:2323`

### 訂單管理 API

| 方法 | 端點 | 說明 |
|------|------|------|
| GET | `/api/merchant/orders/pending` | 取得待處理訂單 |
| POST | `/api/merchant/orders/accept` | 接受訂單 |
| POST | `/api/merchant/orders/reject` | 拒絕訂單 |

### 菜單管理 API

| 方法 | 端點 | 說明 |
|------|------|------|
| GET | `/api/merchant/menu` | 取得菜單列表 |
| POST | `/api/merchant/menu/create` | 新增菜品 |
| POST | `/api/merchant/menu/update` | 更新菜品 |
| POST | `/api/merchant/menu/delete` | 刪除菜品 |

## 🔐 認證

所有 API 請求需要 JWT Token 認證，Token 存放於 `localStorage.getItem('token')`。

請求標頭格式：
```
Authorization: Bearer <token>
```

## 📍 路由

| 路徑 | 頁面 |
|------|------|
| `/merchant/dashboard` | 商家儀表板 |
| `/merchant/orders` | 待處理訂單 |
| `/merchant/menu` | 菜單管理 |

## 📝 原始檔案參考

原始 HTML/CSS/JS 檔案位於 `/src/raw/merchant-order/` 目錄。

