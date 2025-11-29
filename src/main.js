import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 建立 Vue 應用程式
const app = createApp(App)

// 使用 Vue Router
app.use(router)

// 掛載應用程式
app.mount('#app')

