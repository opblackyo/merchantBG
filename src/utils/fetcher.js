// fetcher.js - API 呼叫工具
const BASE_URL = 'http://127.0.0.1:2323'

/**
 * 取得 JWT Token
 */
function getToken() {
  return localStorage.getItem('token')
}

/**
 * 建立請求 headers
 */
function createHeaders(includeAuth = true) {
  const headers = {
    'Content-Type': 'application/json'
  }
  
  if (includeAuth) {
    const token = getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  
  return headers
}

/**
 * GET 請求
 * @param {string} endpoint - API 路徑
 * @param {boolean} includeAuth - 是否包含 JWT
 * @returns {Promise<any>}
 */
export async function apiGet(endpoint, includeAuth = true) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: createHeaders(includeAuth)
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `API Error: ${response.status}`)
  }
  
  return response.json()
}

/**
 * POST 請求
 * @param {string} endpoint - API 路徑
 * @param {object} data - 請求資料
 * @param {boolean} includeAuth - 是否包含 JWT
 * @returns {Promise<any>}
 */
export async function apiPost(endpoint, data = {}, includeAuth = true) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: createHeaders(includeAuth),
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `API Error: ${response.status}`)
  }
  
  return response.json()
}

