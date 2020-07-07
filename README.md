


## 页面窗口向 service worker 通信

 页面向service worker 发送了一条简单对象的消息：
```javascript
navigator.serviceWorker.controller.postMessage({
  'userName': 'kongzhi',
  'age': 31,
  'sex': 'men',
  'marriage': 'single'
});
```

消息一旦发布，service worker 就可以通过监听 message 事件来捕获它。如下代码：
```javascript
self.addEventListener("message", function(event) {
  console.log(event.data);
});
```


## Issue

1、如何提示用户可以安装您的PWA 应用或PWA安装后删除，为什么不在提示问题？

- In Chrome, your Progressive Web App must meet the following criteria before it will fire the beforeinstallprompt event and show the in-browser install promotion:
    - The web app is `not already installed`
    - Meets a user engagement heuristic
    - Be served `over HTTPS`
    - Includes a Web App `Manifest` that includes:
    - `short_name or name`
    - icons - must include a `192px and a 512px `icon
    - `start_url`
    - display - must be one of `fullscreen, standalone, or minimal-ui`
    - Note: prefer_related_applications must not be present, or be false
    - Registers a service worker with a functional fetch handler


## 流程

- caches 流程

![caches 流程](http://static.zybuluo.com/jimmythr/4l1l6ak04w6ns971hadwn1ci/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202016-12-18%2011.04.14.png)



- SW.js 的更新
![SW.js 的更新](http://static.zybuluo.com/jimmythr/yrc93yy5ygxmekeoypgtjyqw/image_1baf37lcr1ho41vj91jb01fdu1in9.png)


----
## 参考

- [PWA Workshop](https://pwa-workshop.js.org/2-service-worker/#service-worker-life-cycle)

- [demo-progressive-web-app](https://github.com/gokulkrishh/demo-progressive-web-app)

- [Service Worker 全面进阶](https://www.villainhr.com/page/2017/01/08/Service%20Worker%20%E5%85%A8%E9%9D%A2%E8%BF%9B%E9%98%B6)




























