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

/* eslint-env browser, serviceworker, es6 */
/**

백엔드에서 푸시 메시지를 보내는 방법을 다루기 전에
먼저 구독한 사용자가 푸시 메시지를 받을 때 실제로 어떤 일이 일어날지 생각해볼 필요가 있습니다.

푸시 메시지를 트리거할 때 브라우저는 푸시 메시지를 수신하고
푸시의 대상이 되는 서비스 워커를 발견한 후
그 서비스 워커를 깨워 푸시 이벤트를 발송합니다.

이 이벤트를 수신 대기하고
이벤트를 수신했을 때
그 결과로서 알림을 표시해야 합니다.
 */
'use strict';


self.addEventListener('push', function(event) {
	console.log('[Service Worker] Push Received.');
	console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  
	const title = 'Push Codelab';
	const options = {
	  body: 'Yay it works.',
	  data:'data'
	//   icon: 'images/icon.png',
	//   badge: 'images/badge.png'
	};
	// console.log( title, options , self.registration.showNotification(title, options));
	console.log( self , self.registration );	
	event.waitUntil(
		self.registration.showNotification('ServiceWorker Cookbook')
	 );
	
  });

  self.addEventListener('notificationclick', function(event) {
	console.log('[Service Worker] Notification click Received.');
  
	event.notification.close();
  
	event.waitUntil(
	  clients.openWindow('https://developers.google.com/web/')
	);
  });