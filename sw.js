let CACHE_NAME = 'my-site-cache-v1'

/**
 * 监听install事件，来进行相关文件的缓存操作：
 */
self.addEventListener('install', function (e) {
    console.warn("install")
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('Opened cache');
            return cache.addAll([
                './',
                './index.html',
                './index.js',
                './style.css',
                './images/fox1.jpg',
                './images/fox2.jpg',
                './images/fox3.jpg',
                './images/fox4.jpg'
            ]);
        })
    );
});

/**
 * 监听fetch事件来使用缓存数据：
 */
self.addEventListener('fetch', function (e) {
    console.log('现在正在请求：' + e.request.url)

    e.respondWith(
        // 判断当前请求是否需要缓存
        caches.match(e.request).then(function (cache) {
            // 有缓存就用缓存，没有就从新发请求获取
            return cache || fetch(e.request)
        }).catch(function (err) {
            console.log(err)
            // 缓存报错还直接从新发请求获取
            return fetch(e.request)
        })
    )
})


/**
 * 监听activate事件，激活后通过cache的key来判断是否更新cache中的静态资源
 */
self.addEventListener('activate', function (e) {
    console.log('Service Worker 状态： activate')
    var cachePromise = caches.keys().then(function (keys) {
        // 遍历当前scope使用的key值
        return Promise.all(keys.map(function (key) {
            // 如果新获取到的key和之前缓存的key不一致，就删除之前版本的缓存
            if (key !== cacheName) {
                return caches.delete(key)
            }
        }))
    })
    e.waitUntil(cachePromise)
    // 保证第一次加载fetch触发
    return self.clients.claim()
})



