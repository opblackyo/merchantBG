// auth.js - 認證與授權 API 模組
// 預留給未來登入功能串接使用
import { apiGet, apiPost } from '@/utils/fetcher'

/**
 * 取得圖形驗證碼
 * GET /api/captcha
 * @returns {Promise<{captcha_token: string, image: string}>}
 */
export async function getCaptcha() {
  return apiGet('/api/captcha', false)
}

/**
 * 一般註冊
 * POST /api/register
 * @param {object} data - 註冊資料
 * @param {string} data.username - 使用者名稱
 * @param {string} data.password - 密碼
 * @param {string} data.confirm_password - 確認密碼
 * @param {string} data.email - Email
 * @returns {Promise<{message: string, username: string}>}
 */
export async function register(data) {
  return apiPost('/api/register', data, false)
}

/**
 * 一般登入
 * POST /api/login
 * @param {object} credentials - 登入資料
 * @param {string} credentials.username - 使用者名稱
 * @param {string} credentials.password - 密碼
 * @param {string} credentials.captcha_answer - 驗證碼答案
 * @param {string} credentials.captcha_token - 驗證碼 Token
 * @returns {Promise<{message: string, token: string, user: string, expires_in: number}>}
 */
export async function login(credentials) {
  return apiPost('/api/login', credentials, false)
}

/**
 * 取得個人資料
 * GET /api/profile
 * @returns {Promise<{user_id: number, username: string, email: string, display_name: string}>}
 */
export async function getProfile() {
  return apiGet('/api/profile')
}

/**
 * 修改使用者名稱
 * POST /api/user/username
 * @param {string} newUsername - 新使用者名稱
 * @returns {Promise<{message: string, new_username: string, token: string, expires_in: number}>}
 */
export async function changeUsername(newUsername) {
  return apiPost('/api/user/username', { new_username: newUsername })
}

/**
 * 修改密碼
 * POST /api/user/password
 * @param {string} oldPassword - 舊密碼
 * @param {string} newPassword - 新密碼
 * @param {string} confirmPassword - 確認新密碼
 * @returns {Promise<{message: string}>}
 */
export async function changePassword(oldPassword, newPassword, confirmPassword) {
  return apiPost('/api/user/password', {
    old_password: oldPassword,
    new_password: newPassword,
    confirm_password: confirmPassword
  })
}

// ========== Token 管理工具 ==========

/**
 * 儲存 Token
 * @param {string} token - JWT Token
 */
export function setToken(token) {
  localStorage.setItem('token', token)
}

/**
 * 取得 Token
 * @returns {string|null}
 */
export function getToken() {
  return localStorage.getItem('token')
}

/**
 * 移除 Token (登出)
 */
export function removeToken() {
  localStorage.removeItem('token')
}

/**
 * 檢查是否已登入
 * @returns {boolean}
 */
export function isAuthenticated() {
  return !!getToken()
}

