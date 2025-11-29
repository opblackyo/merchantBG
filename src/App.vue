<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function navigateTo(path) {
  router.push(path)
}
</script>

<template>
  <div id="app">
    <!-- 導航列 -->
    <nav class="main-nav">
      <div class="nav-brand">🍽️ 商家後台</div>
      <div class="nav-links">
        <a 
          href="#" 
          @click.prevent="navigateTo('/merchant/dashboard')"
          :class="{ active: $route.path === '/merchant/dashboard' }"
        >
          📊 儀表板
        </a>
        <a 
          href="#" 
          @click.prevent="navigateTo('/merchant/orders')"
          :class="{ active: $route.path === '/merchant/orders' }"
        >
          📋 待處理訂單
        </a>
        <a 
          href="#" 
          @click.prevent="navigateTo('/merchant/menu')"
          :class="{ active: $route.path === '/merchant/menu' }"
        >
          🍽️ 菜單管理
        </a>
      </div>
    </nav>

    <!-- 主內容區 -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
/* 全域樣式 */
* {
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #fcf8f0;
  color: #333;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 導航列樣式 */
.main-nav {
  background-color: #5d4037;
  color: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.nav-brand {
  font-size: 1.5em;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links a {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-links a:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
}

.nav-links a.active {
  background-color: rgba(255, 255, 255, 0.25);
  color: white;
}

/* 主內容區 */
.main-content {
  flex: 1;
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
</style>

