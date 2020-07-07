const images = ['fox1','fox2','fox3','fox4'];
const imgElem = document.querySelector('img');

function randomValueFromArray(array) {
  let randomNo =  Math.floor(Math.random() * array.length);
  return array[randomNo];
}

setInterval(function() {
  let randomChoice = randomValueFromArray(images);
  imgElem.src = 'images/' + randomChoice + '.jpg';
}, 2000)

// Register service worker to control making site work offline
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js', {scope: '/'})
            .then(function (registration) {
                // 注册成功
                console.warn('ServiceWorker registration successful with scope: ', registration.scope)
            })
            .catch(function (err) {
                // 注册失败:(
                console.error('ServiceWorker registration failed: ', err)
            })
    })
}



// Code to handle install prompt on desktop

let deferredPrompt;
const addBtn = document.querySelector('.add-button');
addBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
console.warn("before install prompt")
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
    showInstallPromotion()
});

function showInstallPromotion(){
    if( !deferredPrompt ) {
        return;
    }
    console.warn("show install promotion...")
    addBtn.style.display = 'block';
    addBtn.addEventListener('click', (e) => {
        // hide our user interface that shows our A2HS button
        addBtn.style.display = 'none';
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                alert('用户已同意添加到桌面');
            } else {
                alert('用户已取消添加到桌面');
            }
            deferredPrompt = null;
        });
    });
}

window.addEventListener('appinstalled', (evt) => {
    alert('已安装到桌面屏幕');
});
