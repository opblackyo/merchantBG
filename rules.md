# Augment Project Rules

本專案使用 **Vue 3 + Composition API** + 原生 Fetch 撰寫前端。

所有新增、調整、改寫，請嚴格遵守以下規範。

---

# 1. 專案架構規範

```
/src
  /components
  /views
    /merchant
      Orders.vue          ← 商家接單畫面（原 order.html / js / css）
      Menu.vue            ← 商家菜單管理
      Dashboard.vue       ← 商家儀表板
  /assets
    /css
      order.css
      menu.css
      dashboard.css
  /apis
    cart.js
    order.js
    merchant.js
    menu.js
    ai.js
  /utils
    fetcher.js
App.vue
main.js

```

---

# 2. API 呼叫規範

所有 API 一律使用下列格式：

```jsx
import { apiGet, apiPost } from "@/utils/fetcher"

await apiPost("/api/order/create", { ... })

```

baseURL：

```
http://127.0.0.1:2323

```

JWT 一律從：

```
localStorage.getItem("token")

```

放進 header：

```jsx
Authorization: `Bearer ${token}`

```

---

# 3. Vue 組件規範

每個 Vue Component 一律使用：

- `<script setup>`
- `<template>`
- `<style scoped>`
- CSS 放進 `/assets/css/xxx.css`（Augment 可調整引用方式）
- API 呼叫集中於 `/apis/xxx.js`

---

# 4. 命名規範

- 檔名：PascalCase.vue
- 方法：camelCase
- 常數：UPPER_CASE
- API 函式：`getCart() / addToCart()` 等語意化命名

---

# 5. Augment 工作風格

Augment 需要遵守：

1. 所有程式碼皆 **乾淨、一致、可維護**
2. 能修改你的舊檔案（例如 order.html → Orders.vue）
3. 可自動補上缺的 API 呼叫 code
4. 若遇到模糊指令，會先詢問你
5. 自動維持 DDD-like 的 File Structure（views / apis / utils）

---

# 6. 特別指示 — 商家後台

商家後台包含三個畫面：

- Orders.vue（原本的接單看板，請 Augment 自動轉成 Vue + API）
- Menu.vue（菜單管理）
- Dashboard.vue（後台主頁）

Augment 需：

1. 自動拆分 UI Component
2. 保留你原本 HTML / CSS 的視覺風格
3. 改寫成 Vue（含 reactive state + API fetch）
4. 導入 router（若你已有 router.js）

---

# 7. API 參考文件

本案使用的 API 來自：第二週 API 文件（購物車 訂單 商家後台 ）.md

- 購物車
- 訂單
- 商家後台
- AI 模組
- 餐廳 & 菜單

請 Augment 自動產生每個 API 的封裝 (`apis/*.js`)。

---

# 8. 若缺少資料或你未提供的部分

Augment 可以：

- 自動推測變數名稱
- 自動調整 CSS path
- 將大型函式拆分模組化
- 自動完成 async loading / error handling
- 若遇到不明 UI 行為，會先提出 2～3 種合理選擇讓你選

---

（以上即為完整 `rules.md`）

---

# ✅ 2. 給 Augment 的最終任務指令（直接複製給 Augment）

以下是你要丟給 Augment 的任務內容：

---

## **Augment 指令：**

請依照 `rules.md` 將以下內容完成重構：

### **1. 將我現有的商家後台接單看板**

- order.html
- order.css
- order.js

轉換成：

```
/src/views/merchant/Orders.vue

```

要求：

- 使用 Vue 3 `<script setup>`
- 保留原本視覺效果
- 所有 API 呼叫改為使用 `/apis/merchant.js`
- 串接以下 API：

| 功能 | API |
| --- | --- |
| 取得待接訂單 | GET /api/merchant/orders/pending |
| 接單 | POST /api/merchant/orders/accept |
| 拒單 | POST /api/merchant/orders/reject |

---

### **2. 自動建立檔案**

請生成並填入程式碼：

```
/apis/merchant.js

```

內容需包含：

- getPendingOrders()
- acceptOrder()
- rejectOrder()

---

### **3. 準備第二階段工作檔案**

請預留空白模板：

```
/src/views/merchant/Menu.vue
/src/views/merchant/Dashboard.vue

```

格式：

```
<script setup>
</script>

<template>
  <div></div>
</template>

<style scoped>
</style>

```

---

你可以開始進行重構。

---

# ✅ 3. 你的舊檔案應該放在哪？

### 原始 HTML / CSS / JS 放在：

```
/src/raw/merchant-order/
   order.html
   order.css
   order.js

```

這樣 Augment 才能知道原本的 UI 是什麼。

Augment 看到後就能：

- 讀你的原始 HTML
- 抽出結構
- 轉成 Vue Component
- 製作 `Orders.vue`