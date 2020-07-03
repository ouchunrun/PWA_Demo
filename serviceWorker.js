importScripts("./src/workbox-sw.js");
let cacheStorageKey = 'minimal-pwa-2'
// cacheList 路径为serviceWorker.js.js的相对路径
let cacheList=[
    '/',
    './index.html',
    './css/main.css',
    './images/chrou.jpg',
    './src/workbox-sw.js',
    './src/workbox-sw.js.map',
    './src/gitUserCard.js',
]

self.addEventListener('install',e =>{
    console.log("Service Worker installing.");
    e.waitUntil(
        caches.open(cacheStorageKey)
            .then(cache => cache.addAll(cacheList))
            .then(() => self.skipWaiting())
    )
})

self.addEventListener('fetch',function(e){
    e.respondWith(
        caches.match(e.request).then(function(response){
            if(response != null){
                return response
            }
            return fetch(e.request.url)
        })
    )
})

self.addEventListener('activate',function(e){
    console.log("Service Worker activating.");
    e.waitUntil(
        //获取所有cache名称
        caches.keys().then(cacheNames => {
            return Promise.all(
                // 获取所有不同于当前版本名称cache下的内容
                cacheNames.filter(cacheNames => {
                    return cacheNames !== cacheStorageKey
                }).map(cacheNames => {
                    return caches.delete(cacheNames)
                })
            )
        }).then(() => {
            return self.clients.claim()
        })
    )
})
