/**
 * 兮·境 Service Worker v3
 * 策略：
 * - 歌词(.lrc)、数据文件：Cache First（长期缓存）
 * - 音频文件：Network First（优先网络，失败回退缓存）
 * - HTML/JS/CSS：Stale While Revalidate（快速响应 + 后台更新）
 * - 图标/字体：Cache First（永久缓存）
 */

const CACHE_VERSION = 'v3.0.0'
const STATIC_CACHE = `xijing-static-${CACHE_VERSION}`
const DYNAMIC_CACHE = `xijing-dynamic-${CACHE_VERSION}`
const LYRICS_CACHE = `xijing-lyrics-${CACHE_VERSION}`

// 需要预缓存的静态资源
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg'
]

// ==================== 安装 ====================
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  )
})

// ==================== 激活 ====================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key =>
          key.startsWith('xijing-') &&
          key !== STATIC_CACHE &&
          key !== DYNAMIC_CACHE &&
          key !== LYRICS_CACHE
        ).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  )
})

// ==================== 请求拦截 ====================
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // 仅处理同源请求
  if (url.origin !== location.origin) return

  // 路由：歌词文件
  if (url.pathname.endsWith('.lrc') || url.pathname.includes('/lyrics/')) {
    event.respondWith(cacheFirst(request, LYRICS_CACHE))
    return
  }

  // 路由：音频文件
  if (url.pathname.includes('/audio/')) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE))
    return
  }

  // 路由：字体/图标
  if (url.pathname.includes('/icons/') || url.pathname.includes('fonts')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  // 路由：JS/CSS 静态资源
  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE))
    return
  }

  // 路由：HTML（主页）
  if (request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('index.html')) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE))
    return
  }
})

// ==================== 缓存策略 ====================

/** Cache First：先读缓存，没有再请求网络 */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request)
  if (cached) return cached

  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch (e) {
    // 缓存无、网络失败 → 返回离线占位
    return new Response('离线状态', { status: 503, headers: { 'Content-Type': 'text/plain' } })
  }
}

/** Network First：先尝试网络，失败回退缓存 */
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch (e) {
    const cached = await caches.match(request)
    if (cached) return cached
    return new Response('音频加载失败', { status: 503 })
  }
}

/** Stale While Revalidate：立即返回缓存，后台更新 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  const fetchPromise = fetch(request)
    .then(response => {
      if (response.ok) cache.put(request, response.clone())
      return response
    })
    .catch(() => null)

  return cached || fetchPromise
}

// ==================== 消息推送 ====================
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting()
  }
})
