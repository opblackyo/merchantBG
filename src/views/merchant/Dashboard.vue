<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPendingOrders, getMenu } from '@/apis/merchant'
import '@/assets/css/dashboard.css'

const router = useRouter()

// 響應式狀態
const pendingCount = ref(0)
const menuCount = ref(0)
const recentOrders = ref([])
const loading = ref(false)

// 統計資料
const stats = ref([
  { icon: '📋', value: 0, label: '待處理訂單', key: 'pending' },
  { icon: '🍽️', value: 0, label: '菜品數量', key: 'menu' },
  { icon: '✅', value: 0, label: '今日完成', key: 'completed' },
  { icon: '💰', value: 0, label: '今日營收', key: 'revenue' }
])

// 取得儀表板資料
async function fetchDashboardData() {
  loading.value = true
  try {
    // 取得待處理訂單
    const ordersResponse = await getPendingOrders()
    const orders = ordersResponse.orders || []
    pendingCount.value = orders.length
    recentOrders.value = orders.slice(0, 5)

    // 更新統計
    stats.value[0].value = pendingCount.value

    // 取得菜單數量
    const menuResponse = await getMenu()
    menuCount.value = (menuResponse.menu || []).length
    stats.value[1].value = menuCount.value

    // 模擬今日完成和營收（實際應該有獨立 API）
    stats.value[2].value = Math.floor(Math.random() * 20) + 5
    stats.value[3].value = Math.floor(Math.random() * 5000) + 1000

  } catch (err) {
    console.error('取得儀表板資料失敗:', err)
  } finally {
    loading.value = false
  }
}

// 導航到指定頁面
function navigateTo(path) {
  router.push(path)
}

// 生命週期
onMounted(() => {
  fetchDashboardData()
})
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-panel">
      <!-- Header -->
      <header class="dashboard-header">
        <h1>商家後台</h1>
        <span class="welcome-text">歡迎回來！</span>
      </header>

      <!-- 統計卡片 -->
      <div class="stats-grid">
        <div v-for="stat in stats" :key="stat.key" class="stat-card">
          <div class="stat-icon">{{ stat.icon }}</div>
          <div class="stat-value">
            {{ stat.key === 'revenue' ? `NT$ ${stat.value}` : stat.value }}
          </div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>

      <!-- 快速操作 -->
      <div class="quick-actions">
        <h2>快速操作</h2>
        <div class="action-grid">
          <div class="action-btn" @click="navigateTo('/merchant/orders')">
            <span class="icon">📋</span>
            <span class="label">處理訂單</span>
          </div>
          <div class="action-btn" @click="navigateTo('/merchant/menu')">
            <span class="icon">🍽️</span>
            <span class="label">管理菜單</span>
          </div>
          <div class="action-btn" @click="fetchDashboardData">
            <span class="icon">🔄</span>
            <span class="label">刷新資料</span>
          </div>
        </div>
      </div>

      <!-- 最近訂單 -->
      <div class="recent-orders">
        <h2>最近待處理訂單</h2>
        <div v-if="recentOrders.length === 0" class="empty-state">
          目前沒有待處理的訂單
        </div>
        <div v-else>
          <div v-for="order in recentOrders" :key="order.order_id" class="order-item">
            <div class="order-brief">
              <span class="order-number">#{{ order.order_id }}</span>
              <span class="order-time">{{ order.customer_name }}</span>
            </div>
            <span class="order-amount">NT$ {{ order.total }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 使用外部 CSS，此處可放置組件專屬樣式覆蓋 */
</style>

