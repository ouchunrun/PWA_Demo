let cardElement = document.querySelector('.card');
let addCardBtnElement = document.querySelector('.add__btn');
let addCardInputElement = document.querySelector('.add__input');
let spinnerElement = document.querySelector('.card__spinner');

/**
 * To get github user data via `Fetch API`
 * @param username
 * @param requestFromBGSync
 */
function fetchGitUserInfo(username, requestFromBGSync) {
    let name = username || 'gokulkrishh';
    let url = 'https://api.github.com/users/' + name;
    spinnerElement.classList.add('show'); //show spinner

    fetch(url, { method: 'GET' })
        .then(function(fetchResponse){ return fetchResponse.json() })
        .then(function(response) {
            if (!requestFromBGSync) {
                localStorage.removeItem('request'); //Once API is success, remove request data from localStorage
            }
            console.info("serviceWorker fetch response: \n", JSON.stringify(response, null, '   '))
            cardElement.querySelector('.card__title').textContent = response.name;
            cardElement.querySelector('.card__desc').textContent = response.bio;
            cardElement.querySelector('.card__img').setAttribute('src', response.avatar_url);
            cardElement.querySelector('.card__following span').textContent = response.following;
            cardElement.querySelector('.card__followers span').textContent = response.followers;
            cardElement.querySelector('.card__temp span').textContent = response.company;
            cardElement.querySelector('.card__public_repos span').textContent = response.public_repos;
            cardElement.querySelector('.card__email span').textContent = response.email;
            cardElement.querySelector('.card__created span').textContent = response.created_at;
            cardElement.querySelector('.card__updated span').textContent = response.updated_at;
            spinnerElement.classList.remove('show'); //hide spinner
        })
        .catch(function (error) {
            // If user is offline and sent a request, store it in localStorage
            // Once user comes online, trigger bg sync fetch from application tab to make the failed request
            localStorage.setItem('request', name);
            spinnerElement.classList.remove('show'); //hide spinner
            console.error(error);
        });
}

/**
 * Fetch github users data
 */
fetchGitUserInfo(localStorage.getItem('request'));

/**
 * Listen postMessage when `background sync` is triggered
 */
navigator.serviceWorker.addEventListener('message', function (event) {
    console.info('From background sync: ', event.data);
    fetchGitUserInfo(localStorage.getItem('request'), true);
});

/**
 * Add card click event，Add github user data to the card
 */
addCardBtnElement.addEventListener('click', function () {
    let userInput = addCardInputElement.value;
    if (userInput === '') {
        alert('empty username...')
        return
    }
    addCardInputElement.value = '';
    localStorage.setItem('request', userInput);
    fetchGitUserInfo(userInput);
}, false);

/**
 * Monitor the entire page
 * @param e
 */
document.onkeydown=function(e) {
    let keyNum = window.event ? e.keyCode : e.which;
    if (keyNum === 13) {
        // Determine if the user presses the Enter key (keycody=13)
        addCardBtnElement.click()
    }else if (keyNum === 32) {
        // Determine if the user presses the space bar (keycode=32)
    }else if (13 === e.keyCode && e.shiftKey) {
        //Determine if the user presses the Shift key (keycode=32) and the Enter key (keycody=13)
    }
}

/**
 *  检测浏览器是否支持serviceWorker
 */
if(navigator.serviceWorker != null){
    navigator.serviceWorker.register('serviceWorker.js')
        .then(function(serviceWorker){
         console.log('Service Worker registered: :',serviceWorker .scope)
        }).catch(function (error) {
            console.error("Error registering the Service Worker: ", error);
        })
}
