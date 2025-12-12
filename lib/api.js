// lib/api.js

// ⭐ Gunakan environment variable atau fallback ke localhost
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Build full image URL from backend path
 * @param {string} path - Path dari backend (e.g., "/uploads/covers/xxx.jpg")
 * @returns {string} Full URL
 */
export function getImageUrl(path) {
  if (!path) return null;
  
  // Jika sudah full URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Jika relative path
  if (path.startsWith('/')) {
    return `${API_BASE_URL}${path}`;
  }
  
  // Jika hanya nama file
  return `${API_BASE_URL}/uploads/covers/${path}`;
}

/**
 * Build API endpoint URL
 * @param {string} endpoint - API endpoint (e.g., "/api/buku")
 * @returns {string} Full API URL
 */
export function getApiUrl(endpoint) {
  return `${API_BASE_URL}${endpoint}`;
}