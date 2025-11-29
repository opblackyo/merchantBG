// merchant.js - 商家後台 API 模組
import { apiGet, apiPost } from '@/utils/fetcher'

/**
 * 取得待接訂單
 * GET /api/merchant/orders/pending
 * @returns {Promise<{orders: Array}>}
 */
export async function getPendingOrders() {
  return apiGet('/api/merchant/orders/pending')
}

/**
 * 接單
 * POST /api/merchant/orders/accept
 * @param {number|string} orderId - 訂單 ID
 * @returns {Promise<{message: string, status: string}>}
 */
export async function acceptOrder(orderId) {
  return apiPost('/api/merchant/orders/accept', { order_id: orderId })
}

/**
 * 拒單
 * POST /api/merchant/orders/reject
 * @param {number|string} orderId - 訂單 ID
 * @param {string} reason - 拒單原因
 * @returns {Promise<{message: string}>}
 */
export async function rejectOrder(orderId, reason = '') {
  return apiPost('/api/merchant/orders/reject', {
    order_id: orderId,
    reason
  })
}

// ========== 菜單管理 API ==========

/**
 * 取得菜單列表
 * GET /api/merchant/menu
 * @returns {Promise<{menu: Array}>}
 */
export async function getMenu() {
  return apiGet('/api/merchant/menu')
}

/**
 * 新增菜品
 * POST /api/merchant/menu/create
 * @param {object} menuItem - 菜品資料
 * @param {string} menuItem.name - 菜品名稱
 * @param {number} menuItem.price - 價格
 * @param {number} menuItem.stock - 庫存
 * @param {string} menuItem.category - 分類
 * @param {string} menuItem.image - 圖片 (base64)
 * @returns {Promise<{message: string}>}
 */
export async function createMenuItem(menuItem) {
  return apiPost('/api/merchant/menu/create', menuItem)
}

/**
 * 更新菜品
 * POST /api/merchant/menu/update
 * @param {object} menuItem - 菜品資料
 * @param {number} menuItem.menu_id - 菜品 ID
 * @param {string} menuItem.name - 菜品名稱
 * @param {number} menuItem.price - 價格
 * @param {number} menuItem.stock - 庫存
 * @param {boolean} menuItem.is_active - 是否上架
 * @returns {Promise<{message: string}>}
 */
export async function updateMenuItem(menuItem) {
  return apiPost('/api/merchant/menu/update', menuItem)
}

/**
 * 刪除菜品
 * POST /api/merchant/menu/delete
 * @param {number} menuId - 菜品 ID
 * @returns {Promise<{message: string}>}
 */
export async function deleteMenuItem(menuId) {
  return apiPost('/api/merchant/menu/delete', { menu_id: menuId })
}
