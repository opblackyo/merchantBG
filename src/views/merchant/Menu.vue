<script setup>
import { ref, onMounted, reactive } from 'vue'
import { getMenu, createMenuItem, updateMenuItem, deleteMenuItem } from '@/apis/merchant'
import '@/assets/css/menu.css'

// 響應式狀態
const menuItems = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const loading = ref(false)
const error = ref(null)

// 表單資料
const formData = reactive({
  menu_id: null,
  name: '',
  price: 0,
  stock: 0,
  category: '',
  is_active: true,
  image: ''
})

// 取得菜單列表
async function fetchMenu() {
  loading.value = true
  error.value = null
  try {
    const response = await getMenu()
    menuItems.value = response.menu || []
  } catch (err) {
    error.value = err.message
    console.error('取得菜單失敗:', err)
  } finally {
    loading.value = false
  }
}

// 開啟新增 Modal
function openAddModal() {
  isEditing.value = false
  resetForm()
  showModal.value = true
}

// 開啟編輯 Modal
function openEditModal(item) {
  isEditing.value = true
  formData.menu_id = item.menu_id
  formData.name = item.name
  formData.price = item.price
  formData.stock = item.stock
  formData.category = item.category
  formData.is_active = item.is_active
  formData.image = item.image || ''
  showModal.value = true
}

// 關閉 Modal
function closeModal() {
  showModal.value = false
  resetForm()
}

// 重置表單
function resetForm() {
  formData.menu_id = null
  formData.name = ''
  formData.price = 0
  formData.stock = 0
  formData.category = ''
  formData.is_active = true
  formData.image = ''
}

// 儲存菜品
async function saveMenuItem() {
  try {
    if (isEditing.value) {
      await updateMenuItem({
        menu_id: formData.menu_id,
        name: formData.name,
        price: formData.price,
        stock: formData.stock,
        is_active: formData.is_active
      })
      alert('菜品更新成功！')
    } else {
      await createMenuItem({
        name: formData.name,
        price: formData.price,
        stock: formData.stock,
        category: formData.category,
        image: formData.image
      })
      alert('菜品新增成功！')
    }
    closeModal()
    await fetchMenu()
  } catch (err) {
    alert(`操作失敗: ${err.message}`)
  }
}

// 刪除菜品
async function handleDelete(item) {
  if (!confirm(`確定要刪除「${item.name}」嗎？`)) return

  try {
    await deleteMenuItem(item.menu_id)
    alert('菜品已刪除！')
    await fetchMenu()
  } catch (err) {
    alert(`刪除失敗: ${err.message}`)
  }
}

// 點擊 Modal 外部關閉
function handleModalClick(event) {
  if (event.target.classList.contains('menu-modal')) {
    closeModal()
  }
}

// 生命週期
onMounted(() => {
  fetchMenu()
})
</script>

<template>
  <div class="menu-container">
    <div class="menu-panel">
      <!-- Header -->
      <header class="menu-header">
        <h1>菜單管理</h1>
        <button class="btn-add" @click="openAddModal">+ 新增菜品</button>
      </header>

      <!-- 菜單列表 -->
      <div class="menu-list">
        <div v-if="menuItems.length === 0" class="empty-state">
          目前沒有菜品，請新增菜品。
        </div>

        <div v-for="item in menuItems" :key="item.menu_id" class="menu-card">
          <div class="menu-info">
            <img
              :src="item.image || 'https://via.placeholder.com/60'"
              :alt="item.name"
              class="menu-image"
            />
            <div class="menu-details">
              <div class="menu-name">
                {{ item.name }}
                <span class="menu-category">{{ item.category }}</span>
              </div>
              <div class="menu-meta">
                價格: NT$ {{ item.price }} | 庫存: {{ item.stock }}
              </div>
            </div>
          </div>

          <span :class="item.is_active ? 'status-active' : 'status-inactive'">
            {{ item.is_active ? '上架中' : '已下架' }}
          </span>

          <div class="menu-actions">
            <button class="btn-edit" @click="openEditModal(item)">✏️ 編輯</button>
            <button class="btn-delete" @click="handleDelete(item)">🗑️ 刪除</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div
    class="menu-modal"
    :class="{ show: showModal }"
    @click="handleModalClick"
  >
    <div class="menu-modal-content">
      <span class="close-button" @click="closeModal">&times;</span>
      <h2>{{ isEditing ? '編輯菜品' : '新增菜品' }}</h2>

      <form @submit.prevent="saveMenuItem">
        <div class="form-group">
          <label>菜品名稱</label>
          <input v-model="formData.name" type="text" required placeholder="請輸入菜品名稱" />
        </div>

        <div class="form-group">
          <label>價格 (NT$)</label>
          <input v-model.number="formData.price" type="number" min="0" required />
        </div>

        <div class="form-group">
          <label>庫存數量</label>
          <input v-model.number="formData.stock" type="number" min="0" required />
        </div>

        <div class="form-group" v-if="!isEditing">
          <label>分類</label>
          <select v-model="formData.category" required>
            <option value="">請選擇分類</option>
            <option value="主食">主食</option>
            <option value="小菜">小菜</option>
            <option value="飲料">飲料</option>
            <option value="甜點">甜點</option>
          </select>
        </div>

        <div class="form-group form-check">
          <input v-model="formData.is_active" type="checkbox" id="is_active" />
          <label for="is_active">上架販售</label>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click="closeModal">取消</button>
          <button type="submit" class="btn-save">{{ isEditing ? '更新' : '新增' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* 使用外部 CSS，此處可放置組件專屬樣式覆蓋 */
</style>

