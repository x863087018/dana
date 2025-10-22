/**
 * 环境变量配置
 */

// 后端API地址
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// WebSocket地址
export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL

// 判断是否为生产环境
export const isProd = import.meta.env.MODE === 'production'

// 判断是否为开发环境
export const isDev = import.meta.env.MODE === 'development'

