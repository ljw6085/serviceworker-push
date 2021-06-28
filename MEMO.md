Notifications
- 단순 Notifications API를 이용해서 권한획득
- 여기서 권한을 획득해야 알림과 pushmanager를 이용하여 구독할 수 있다

Push
- Service Worker는 푸시 서버로부터 데이터를 수신하여 NotificationsAPI를 이용하여 알림 호출


서비스워커
-> pushManager를 제공한다.

서비스워커를 등록하면 pushManager를 사용할 수 있다.

pushManager를 이용하여 구독/구독해제를 할 수 있다.

구독할 때, 서버pulbicKey가 있어야한다.

서버publicKey는 구글FCM 푸시서버를 이용해야한다.( 개인으로 구현가능한지 아직 모르겠음 )

구글FCM푸시서버의 서버키를 가지고 구독 객체를 생성한다.
.pushManager.subscribe( {
	userVisibleOnly: true,
	applicationServerKey: applicationServerKey
});

구독 후 프라미스객체를 반환받고
그 결과를 
드디어 "우리 백ㅇ엔드 서버"로 구독정보(토큰)를 보낼 수 있다.


DB에 백엔드

---
예제)
https://web-push-codelab.glitch.me/
/d/Dev/playground/serviceworker-push
---


알림=>Notifications API =>"on push"=>pushManager=>serviceworker=>FCM =>우리백엔드서버=>구독목록=>구독하기=>알림허용





- 서비스워커 지원여부 (IE X)
- 알림 허용 권한 (허용안되면 말짱도루묵)
	- 구독 여부
	- 구독 정보 객체
	- 푸시서버
		- 서버 public/private key
		- 구독 리스트
		- web-push 라이브러리


---
ServiceWorKer API ( event.waitUntil )
	Push API - PushEvent  ( registration.pushManager )
		Notifications API ( registration.showNotification )


1. 서비스워커 (https://so-so.dev/web/service-worker/)
서비스워커의 수명 주기는 웹페이지와는 완전히 별개입니다.
웹 서비스와 브라우저 및 네트워크 사이에서 프록시 서버의 역할을 하며,
오프라인에서도 서비스를 사용할 수 있도록 합니다.

웹 페이지와 별개로 존재하기 때문에 다음과 같은 제약이 있습니다.

1. 서비스워커는 요청하지 않는 이상, 없는 것이나 다름없습니다. Web Worker에서와 같은 .ternimate() 명령은 존재하지 않습니다.
2. 웹 페이지 life cycle을 따르지 않습니다. 서비스워커는 웹페이지가 닫히더라도 자동으로 비활성화되지 않습니다.
3. 웹 페이지와 별개로 존재하므로 DOM이나 window요소에 접근할 수 없습니다. (alert, document ...)

위 제약을 고려했을 때, 서비스워커는 다음과 같이 활용할 수 있습니다.
1. 캐시와 상호작용
2. 푸쉬 알림
3. 백그라운드 동기화

----



--- push flow
1. 알림이 온다.
2. Notifications API : registration.showNotification
3. Push API : Push Event Receive
4. Serviceworker <-> 브라우저별 endpoint 통신
5. Backend Push Server : web-push-libs (https://github.com/web-push-libs/) 구현 => sendNotification( 구독정보객체별로 요청 )
6. Backend Push Server : 구독목록 조회( DB에 저장한 구독객체 ) => endpoint, user key 등 정보가 들어있음
7. Push API : pushManager.subscribe() 를 이용하여 구독객체 생성
8. Notifications API : 알림허용 요청
9. Serviceworker : 서비스워커 등록

## /d/Dev/playground/serviceworker-push

---- https://github.com/firebase/quickstart-js/tree/master/messaging