<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Line, Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { getPendingOrders, getMenu, getRevenueData, getTopProducts } from '@/apis/merchant'
import '@/assets/css/dashboard.css'

// 註冊 Chart.js 元件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const router = useRouter()

// 響應式狀態
const pendingCount = ref(0)
const menuCount = ref(0)
const recentOrders = ref([])
const loading = ref(false)

// 圖表資料狀態
const revenueRange = ref('7d')
const revenueData = ref({ labels: [], values: [] })
const topProducts = ref([])
const chartsLoading = ref(false)

// 統計資料
const stats = ref([
  { icon: '📋', value: 0, label: '待處理訂單', key: 'pending' },
  { icon: '🍽️', value: 0, label: '菜品數量', key: 'menu' },
  { icon: '✅', value: 0, label: '今日完成', key: 'completed' },
  { icon: '💰', value: 0, label: '今日營收', key: 'revenue' }
])

// 營收折線圖配置
const revenueChartData = computed(() => ({
  labels: revenueData.value.labels,
  datasets: [
    {
      label: '營收 (TWD)',
      data: revenueData.value.values,
      borderColor: '#66bb6a',
      backgroundColor: 'rgba(102, 187, 106, 0.1)',
      tension: 0.3,
      fill: true
    }
  ]
}))

const revenueChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `NT$ ${value}`
      }
    }
  }
}

// 熱銷商品圓餅圖配置
const pieColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF']

const topProductsChartData = computed(() => ({
  labels: topProducts.value.map(item => item.name),
  datasets: [
    {
      data: topProducts.value.map(item => item.count),
      backgroundColor: pieColors.slice(0, topProducts.value.length),
      borderWidth: 2,
      borderColor: '#fff'
    }
  ]
}))

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: { boxWidth: 12, padding: 15 }
    }
  }
}

// 檢查是否有營收資料
const hasRevenueData = computed(() =>
  revenueData.value.values && revenueData.value.values.length > 0
)

// 檢查是否有熱銷商品資料
const hasTopProducts = computed(() =>
  topProducts.value && topProducts.value.length > 0
)

// 取得儀表板基本資料
async function fetchDashboardData() {
  loading.value = true
  try {
    const ordersResponse = await getPendingOrders()
    const orders = ordersResponse.orders || []
    pendingCount.value = orders.length
    recentOrders.value = orders.slice(0, 5)
    stats.value[0].value = pendingCount.value

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

// 取得圖表資料
async function fetchChartData() {
  chartsLoading.value = true
  try {
    const [revenueRes, productsRes] = await Promise.all([
      getRevenueData(revenueRange.value),
      getTopProducts()
    ])
    revenueData.value = revenueRes || { labels: [], values: [] }
    topProducts.value = productsRes.items || []
  } catch (err) {
    console.error('取得圖表資料失敗:', err)
    // API 失敗時設為空狀態
    revenueData.value = { labels: [], values: [] }
    topProducts.value = []
  } finally {
    chartsLoading.value = false
  }
}

// 切換營收範圍
async function changeRevenueRange(range) {
  revenueRange.value = range
  chartsLoading.value = true
  try {
    const res = await getRevenueData(range)
    revenueData.value = res || { labels: [], values: [] }
  } catch (err) {
    console.error('取得營收資料失敗:', err)
    revenueData.value = { labels: [], values: [] }
  } finally {
    chartsLoading.value = false
  }
}

// 導航到指定頁面
function navigateTo(path) {
  router.push(path)
}

// 生命週期
onMounted(() => {
  fetchDashboardData()
  fetchChartData()
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
          <div class="action-btn" @click="fetchDashboardData(); fetchChartData()">
            <span class="icon">🔄</span>
            <span class="label">刷新資料</span>
          </div>
        </div>
      </div>

      <!-- 圖表區域 -->
      <div class="charts-section">
        <!-- 營收趨勢圖 -->
        <div class="chart-card">
          <div class="chart-header">
            <h2>📈 營收趨勢</h2>
            <div class="range-selector">
              <button
                :class="{ active: revenueRange === '7d' }"
                @click="changeRevenueRange('7d')"
              >7天</button>
              <button
                :class="{ active: revenueRange === '30d' }"
                @click="changeRevenueRange('30d')"
              >30天</button>
              <button
                :class="{ active: revenueRange === '90d' }"
                @click="changeRevenueRange('90d')"
              >90天</button>
            </div>
          </div>
          <div class="chart-body">
            <div v-if="chartsLoading" class="chart-loading">
              <span>載入中...</span>
            </div>
            <div v-else-if="!hasRevenueData" class="chart-empty">
              <span class="empty-icon">📊</span>
              <span class="empty-text">尚無營收資料</span>
              <span class="empty-hint">開始接單後即可查看營收趨勢</span>
            </div>
            <Line
              v-else
              :data="revenueChartData"
              :options="revenueChartOptions"
            />
          </div>
        </div>

        <!-- 熱銷商品圓餅圖 -->
        <div class="chart-card">
          <div class="chart-header">
            <h2>🔥 熱銷商品佔比</h2>
          </div>
          <div class="chart-body">
            <div v-if="chartsLoading" class="chart-loading">
              <span>載入中...</span>
            </div>
            <div v-else-if="!hasTopProducts" class="chart-empty">
              <span class="empty-icon">🍽️</span>
              <span class="empty-text">尚無銷售資料</span>
              <span class="empty-hint">有訂單後即可查看熱銷排行</span>
            </div>
            <Pie
              v-else
              :data="topProductsChartData"
              :options="pieChartOptions"
            />
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

