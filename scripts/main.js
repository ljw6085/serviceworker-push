/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, es6 */
/* eslint-disable no-unused-vars */

'use strict';

// const applicationServerPublicKey = '<Your Public Key>';
/**
 * Public Key

BNhtdQbZmd4BJ1rw0nr8sCEbvANtnA3WFgttcwynXYGmP5WYiaK8btCMf9VJ7d_gKztJFSbacoqb9DgrXD6RFbY
Private Key

nyugdXBa-hPJS0cllTX3Wf7C08iAmjRWymwNkFudHbo

 */
 //https://web-push-codelab.glitch.me/
const applicationServerPublicKey = 'BLx5z6h6KF2ZggFo_dD1QycZ_KV1ZPzXDCpq2oBiK3J0P-BTNBhXG1xHLqo26fOdzGhNnFHl7YzEjg-071qj4a8';

const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
	initialiseUI();
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}

pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      // TODO: Unsubscribe user
	  console.log( '구독취소함..');
	  unsubscribeUser();
    } else {
      subscribeUser();
    }
});

//구독 좋아요
function subscribeUser() {
	const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
	swRegistration.pushManager.subscribe({
	  userVisibleOnly: true,
	  applicationServerKey: applicationServerKey
	})
	.then(function(subscription) {
	  console.log('User is subscribed:', subscription);
  
	  // 백엔드로 구독을 보내는 함수
	  updateSubscriptionOnServer(subscription);
  
	  isSubscribed = true;
	  updateBtn();
	})
	.catch(function(err) {
	  console.log('Failed to subscribe the user: ', err);
	  updateBtn();
	});
  }
  // 구독 취소 
  function unsubscribeUser() {
	swRegistration.pushManager.getSubscription()
	.then(function(subscription) {
	  if (subscription) {
		return subscription.unsubscribe();
	  }
	})
	.catch(function(error) {
	  console.log('Error unsubscribing', error);
	})
	.then(function() {
	  updateSubscriptionOnServer(null);
  
	  console.log('User is unsubscribed.');
	  isSubscribed = false;
  
	  updateBtn();
	});
  }

function initialiseUI() {
	// Set the initial subscription value
	swRegistration.pushManager.getSubscription()
	.then(function(subscription) {
		console.log( '구독? 좋아요? 알림설정까지?', subscription );
	  isSubscribed = !(subscription === null);
  
	  if (isSubscribed) {
		console.log('User IS subscribed.');
	  } else {
		console.log('User is NOT subscribed.');
	  }
  
	  updateBtn();
	});
  }

  function updateBtn() {
	//권한이 denied인 경우 사용자 구독이 불가능해서 우리가 할 수 있는 일은 더 이상 없으므로, 버튼을 영구적으로 비활성화하는 것이 최선의 방법입니다.
	if (Notification.permission === 'denied') {
		pushButton.textContent = 'Push Messaging Blocked.';
		pushButton.disabled = true;
		updateSubscriptionOnServer(null);
		return;
	}
	if (isSubscribed) {
	  //Yes 구독
	  pushButton.textContent = 'Disable Push Messaging';
	} else {
	  //No 구독
	  pushButton.textContent = 'Enable Push Messaging';
	}
  
	pushButton.disabled = false;
  }

  function updateSubscriptionOnServer(subscription) {
	// TODO: Send subscription to application server
  
	const subscriptionJson = document.querySelector('.js-subscription-json');
	const subscriptionDetails =
	  document.querySelector('.js-subscription-details');
  
	if (subscription) {
	  subscriptionJson.textContent = JSON.stringify(subscription);
	  subscriptionDetails.classList.remove('is-invisible');
	} else {
	  subscriptionDetails.classList.add('is-invisible');
	}
  }