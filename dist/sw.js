// Service Worker - 兮·境 PWA
const CACHE_NAME = 'xijing-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/app.js',
  '/src/styles/main.css',
  '/src/data/songs.js'
]

// 安装 - 缓存静态资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] 缓存静态资源')
        return cache.addAll(STATIC_ASSETS)
      })
      .catch(err => console.error('[SW] 缓存失败:', err))
  )
  
  // 跳过等待，立即激活
  self.skipWaiting()
})

// 激活 - 清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] 删除旧缓存:', name)
            return caches.delete(name)
          })
      )
    })
  )
  
  // 立即接管页面
  self.clients.claim()
})

// 拦截请求
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // 歌词文件 - 网络优先，失败时读缓存
  if (url.pathname.startsWith('/lyrics/')) {
    event.respondWith(networkFirst(request))
    return
  }
  
  // 静态资源 - 缓存优先
  event.respondWith(cacheFirst(request))
})

// 缓存优先策略
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME)
  const cached = await cache.match(request)
  
  if (cached) {
    return cached
  }
  
  try {
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (err) {
    console.error('[SW] 获取失败:', err)
    // 返回离线页面
    return new Response('离线中，请检查网络连接', {
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

// 网络优先策略
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME)
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (err) {
    console.log('[SW] 网络失败，使用缓存:', request.url)
    const cached = await cache.match(request)
    if (cached) {
      return cached
    }
    throw err
  }
}

// 后台同步（用于留言提交）
self.addEventListener('sync', event => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages())
  }
})

// 推送通知
self.addEventListener('push', event => {
  const data = event.data.json()
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: data.tag,
      requireInteraction: true,
      actions: [
        { action: 'open', title: '打开' },
        { action: 'close', title: '关闭' }
      ]
    })
  )
})

// 通知点击
self.addEventListener('notificationclick', event => {
  event.notification.close()
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})