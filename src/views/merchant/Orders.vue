<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { getPendingOrders, acceptOrder, rejectOrder } from '@/apis/merchant'
import '@/assets/css/order.css'

// 響應式狀態
const orders = ref([])
const currentOrder = ref(null)
const showModal = ref(false)
const lastRefreshTime = ref(new Date())
const secondsSinceRefresh = ref(0)
const loading = ref(false)
const error = ref(null)

// 計時器 IDs
let refreshTimer = null
let indicatorTimer = null

// 取得待接訂單
async function fetchOrders() {
  loading.value = true
  error.value = null
  try {
    const response = await getPendingOrders()
    orders.value = response.orders || []
    lastRefreshTime.value = new Date()
    secondsSinceRefresh.value = 0
    console.log(`輪詢刷新完成，取得 ${orders.value.length} 筆待接訂單。`)
  } catch (err) {
    error.value = err.message
    console.error('取得訂單失敗:', err)
  } finally {
    loading.value = false
  }
}

// 顯示訂單詳情
function showDetails(order) {
  currentOrder.value = order
  showModal.value = true
}

// 關閉 Modal
function closeModal() {
  showModal.value = false
  currentOrder.value = null
}

// 處理接單
async function handleAccept() {
  if (!currentOrder.value) return
  
  const orderId = currentOrder.value.order_id
  try {
    await acceptOrder(orderId)
    console.log(`✅ 訂單 ${orderId} 已被接單 (Accepted)`)
    alert(`已成功接單: #${orderId}，準備出餐!`)
    closeModal()
    await fetchOrders()
  } catch (err) {
    alert(`接單失敗: ${err.message}`)
  }
}

// 處理拒單
async function handleReject() {
  if (!currentOrder.value) return
  
  const orderId = currentOrder.value.order_id
  const reason = prompt('請輸入拒單原因（可留空）:') || ''
  
  try {
    await rejectOrder(orderId, reason)
    console.log(`❌ 訂單 ${orderId} 已被拒單 (Rejected)`)
    alert(`已拒絕訂單: #${orderId}。`)
    closeModal()
    await fetchOrders()
  } catch (err) {
    alert(`拒單失敗: ${err.message}`)
  }
}

// 自動刷新
function startAutoRefresh() {
  refreshTimer = setInterval(fetchOrders, 5000)
}

// 更新刷新時間指示器
function updateRefreshIndicator() {
  indicatorTimer = setInterval(() => {
    secondsSinceRefresh.value = Math.floor((new Date() - lastRefreshTime.value) / 1000)
  }, 1000)
}

// 點擊 Modal 外部關閉
function handleModalClick(event) {
  if (event.target.classList.contains('modal')) {
    closeModal()
  }
}

// 生命週期
onMounted(() => {
  fetchOrders()
  startAutoRefresh()
  updateRefreshIndicator()
})

onUnmounted(() => {
  if (refreshTimer) clearInterval(refreshTimer)
  if (indicatorTimer) clearInterval(indicatorTimer)
})
</script>

<template>
  <div class="container">
    <div class="order-panel">
      <!-- Header -->
      <header class="header">
        <h1>待處理訂單</h1>
        <div class="refresh-indicator">
          🔄 上次更新: <span>{{ secondsSinceRefresh }} 秒前</span>
        </div>
      </header>

      <!-- 訂單列表 -->
      <div class="order-list">
        <div v-if="orders.length === 0" class="empty-state">
          目前沒有待接訂單。
        </div>
        
        <div
          v-for="order in orders"
          :key="order.order_id"
          class="order-card"
          @click="showDetails(order)"
        >
          <div class="order-info">
            <div class="order-id">訂單 #{{ order.order_id }}</div>
            <div class="order-summary">
              顧客: {{ order.customer_name }} | 總金額: NT$ {{ order.total }}
            </div>
          </div>
          <span class="status-tag">待接單</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div
    class="modal"
    :class="{ show: showModal }"
    @click="handleModalClick"
  >
    <div class="modal-content">
      <span class="close-button" @click="closeModal">&times;</span>
      <h2>訂單詳情 - #{{ currentOrder?.order_id }}</h2>

      <div v-if="currentOrder" class="modal-body">
        <p><strong>顧客姓名:</strong> {{ currentOrder.customer_name }}</p>
        <p><strong>總金額:</strong> NT$ {{ currentOrder.total }}</p>

        <h4>餐點內容:</h4>
        <ul class="item-list">
          <li v-for="(item, index) in currentOrder.items" :key="index">
            {{ item.name }} x {{ item.qty }}
          </li>
        </ul>

        <h4>顧客備註:</h4>
        <p style="color: #d32f2f;">{{ currentOrder.remark || '無' }}</p>
      </div>

      <div class="modal-actions">
        <button class="btn btn-accept" @click="handleAccept">✅ 接單</button>
        <button class="btn btn-reject" @click="handleReject">❌ 拒單</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 使用外部 CSS，此處可放置組件專屬樣式覆蓋 */
</style>

