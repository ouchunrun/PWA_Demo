importScripts("./src/workbox-sw.js");
let CACHE_NAME = 'my-site-cache-v1'
// cacheList 路径为serviceWorker.js的相对路径
let urlsToCache=[
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
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('Opened cache');
            // 如果所有的文件都成功缓存了，便会安装完成。如果任何文件下载失败了，那么安装过程也会随之失败。
            cache.addAll(urlsToCache)
        }).then(function (clients) {
            // // install 阶段跳过等待
            self.skipWaiting()
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
                    return cacheNames !== CACHE_NAME
                }).map(cacheNames => {
                    return caches.delete(cacheNames)
                })
            )
        }).then(() => {
            return self.clients.claim()
        })
    )
})

self.addEventListener('message', function(event){
    console.warn("SW Received Message: ", event.data);
    // event.ports[0].postMessage("SW Says 'Hello back!'");
    if (event.data === "cache-current-page") {
        var sourceUrl = event.source.url;
        console.log("sourceUrl: ", sourceUrl)
        if (event.source.visibilityState === 'visible') {
            // 缓存 sourceUrl 和相关的文件
        } else {
            // 将sourceUrl和相关的文件添加到队列中。稍后缓存
        }
    }
});

/* Functional events*/
/**
 * 为 fetch 事件添加一个事件监听器。接下来，使用 caches.match() 函数来检查传入的请求 URL 是否匹配当前缓存中存在的任何内容
 * 如果存在的话，返回缓存的资源
 * 如果资源并不存在于缓存当中，通过网络来获取资源，并将获取到的资源添加到缓存中
 */
self.addEventListener('fetch',function(event){
    event.respondWith(
        caches.match(event.request).then(function(response){
            console.log("Fetch event request: ", event.request.url)
            if(response){
                return response
            }

            // IMPORTANT: Clone the request. A request is a stream and
            // can only be consumed once. Since we are consuming this
            // once by cache and once by the browser for fetch, we need
            // to clone the response
            let fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(
                function(response) {
                    // Check if we received a valid response
                    // 确保 response 的类型是 basic 类型的，这说明请求是同源的，这意味着第三方的请求不能被缓存。
                    console.log(response)
                    if(!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // IMPORTANT: Clone the response. A response is a stream
                    // and because we want the browser to consume the response
                    // as well as the cache consuming the response, we need
                    // to clone it so we have 2 stream.
                    let responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }
            );
        })
    )
})

self.addEventListener("sync", function(event) {
    if (event.tag === "sync-store") {
        console.log('sync-store')
    }
});
