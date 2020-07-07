let CACHE_NAME = 'Foxes-site-cache-v1'
let urlsToCache = [
    './',
    './index.html',
    './index.js',
    './style.css',
    './images/fox1.jpg',
    './images/fox2.jpg',
    './images/fox3.jpg',
    './images/fox4.jpg'
]

self.addEventListener('install', function (e) {
    console.warn("install")
    e.waitUntil(
        caches.open('fox-store').then(function (cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        }).then(function () {
            // // install 阶段跳过等待
            return self.skipWaiting()
        }).catch(function (error) {
            console.error(error)
        })
    );
});

self.addEventListener('fetch', function (event) {
    caches.match(event.request).then(function(response){
        console.log("Fetch event request: ", event.request.url)
        if(response){
            return response || fetch(e.request);
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
                    return response || fetch(e.request);;
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

                return response || fetch(e.request);
            }
        );
    })
});

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
