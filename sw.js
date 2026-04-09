// Service Worker - 兮·境 PWA v2
const CACHE_NAME = 'xijing-v2'

// 安装 - 使用动态缓存，不硬编码源码路径
self.addEventListener('install', event => {
  console.log('[SW] 安装中，版本:', CACHE_NAME)
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

// 拦截请求 - 动态缓存策略
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // 只处理同源请求
  if (url.origin !== location.origin) return

  // 歌词文件 - 网络优先，失败时读缓存
  if (url.pathname.startsWith('/lyrics/')) {
    event.respondWith(networkFirst(request))
    return
  }

  // HTML页面 - 网络优先
  if (request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    event.respondWith(networkFirst(request))
    return
  }

  // 其他静态资源 - 缓存优先（动态填充）
  event.respondWith(cacheFirst(request))
})

// 缓存优先策略 - 动态缓存
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME)
  const cached = await cache.match(request)

  if (cached) {
    return cached
  }

  try {
    const response = await fetch(request)
    if (response.ok) {
      // 动态缓存成功的响应
      cache.put(request, response.clone())
    }
    return response
  } catch (err) {
    console.error('[SW] 获取失败:', err)
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
    event.waitUntil(Promise.resolve())
  }
})

// 推送通知
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {}

  event.waitUntil(
    self.registration.showNotification(data.title || '兮·境', {
      body: data.body || '有新的动态',
      icon: '/icons/icon-192x192.png',
      tag: data.tag || 'default',
      requireInteraction: false,
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

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})
