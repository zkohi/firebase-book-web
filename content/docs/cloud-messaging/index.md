---
title: Firebase Cloud Messaging
date: "2019-03-21T00:00:00.000Z"
description: Firebase Cloud Messaging
---

# Firebase Cloud Messaging

## Docs
https://firebase.google.com/docs/cloud-messaging/

## Point

> Firebase Cloud Messaging（FCM）は、メッセージを無料で確実に配信するためのクロスプラットフォーム メッセージング ソリューションです。

無料でメッセージをユーザーに送信することができます。

Webの場合は、[通知に対応しているブラウザ](https://developer.mozilla.org/ja/docs/Web/API/notification#%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E5%AE%9F%E8%A3%85%E7%8A%B6%E6%B3%81)の場合に通知のパーミッションを取得して、任意のタイミングでメッセージを送信することになります。

通知に対応しているブラウザの判定ですが、[メッセージング オブジェクトの取得](https://firebase.google.com/docs/cloud-messaging/js/client#retrieve_a_messaging_object)を実行した段階で、通知に対応していない場合、エラーになるので、```try catch```するしかないようです。

```
let messaging;
try {
  const messaging = firebase.messaging();
  messaging.usePublicVapidKey("key");
} catch (e) {
  messaging = null;
}
```

基本的にドキュメント通りに進めるだけで、メッセージの送受信はできます。

ここでは、Firebase Authenticationでアカウントを作成したアカウントが、複数のデバイス（PC/スマートフォン）を使用しており、複数のデバイスに一括でメッセージを送信したい場合について説明します。

この場合は、[デバイス グループにメッセージを送信する](https://firebase.google.com/docs/cloud-messaging/js/device-group)で実現することができます。各処理はCloud Functionsで実装するとよいでしょう。

- [デバイスグループの作成](https://firebase.google.com/docs/cloud-messaging/js/device-group#creating_a_device_group)で、notification_key_nameにFirebase Authenticationのアカウントのuidを指定して、notification_keyを取得
- 各デバイスで取得した登録トークンを、[デバイスグループでのデバイスの追加と削除](https://firebase.google.com/docs/cloud-messaging/js/device-group#adding_and_removing_devices_from_a_device_group)で、notification_key, notification_key_nameを指定して、登録トークンを追加
- [デバイスグループへのダウンストリーム メッセージの送信](https://firebase.google.com/docs/cloud-messaging/js/device-group#sending_downstream_messages_to_device_groups)で、```to```にnotification_keyを指定して送信
