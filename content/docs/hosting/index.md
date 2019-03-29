---
title: Firebase Hosting
date: "2019-03-21T00:00:00.000Z"
description: Firebase Hosting
---

# Firebase Hosting

## Docs
https://firebase.google.com/docs/hosting/

## Point

静的にホスティングするだけなら、ドキュメント通り実施すれば、つまずくことはありません。

## Caution

### [デプロイの管理とロールバック](https://firebase.google.com/docs/hosting/deploying#manage_and_rollback_deploys)

> プロジェクトの [ホスティング] ページで、デプロイのすべての履歴を見ることができます。

デプロイ毎に自動でバージョニングとバックアップが行われます。

コンソールで明示的に保持するバージョン数を指定しておかないと、おそらく無限に過去バージョンが保存され、ストレージの料金が知らぬ間に増えます。

忘れずに、コンソールで保持するバージョン数を指定しましょう。

### 1つのFirebaseプロジェクトで、複数のHostingサイトを関連付ける場合（管理画面などを別サイトとして構築したい場合）

[複数のサイトでプロジェクトのリソースを共有する](https://firebase.google.com/docs/hosting/multisites)に、下記の記載がありますが、2019/03時点ですでに使用することができています。

> 注意: このページでは、今後提供される Firebase Hosting の機能を簡潔に紹介しています。1 つの Firebase プロジェクトへの複数の Hosting サイトの関連付けについては、まもなくサポートが開始されます。

記載の通り、Blazeプラン（従量課金）にする必要があります。
> 注: 複数の Hosting サイトを作成するには、Blaze お支払いプランをご利用いただく必要があります。

### [SDK の自動構成](https://firebase.google.com/docs/hosting/reserved-urls#sdk_auto-configuration)

デプロイして本番公開する前に、API KEYのアクセス制限を設定しておいた方がよいです。

コンソールにログインし、API KEYを公開予定のホストからのアクセスのみに設定（HTTP referrersに公開予定のホストをホワイトリストに登録）するだけですので、設定しておきましょう。

[SDK のインポートと暗黙の初期化](https://firebase.google.com/docs/web/setup#sdk_imports_and_implicit_initialization)にも記載されている通り、Firebase Hosting を使用してウェブアプリをホストすると、/__/firebase/init.jsにconfigとして設定する値が自動で設定され、外部公開されます。

[Firebase リリース チェックリスト](https://firebase.google.com/support/guides/launch-checklist)にも下記の記載があります。

> 不正使用を防ぐためのドメインのホワイトリストを追加します。
>   
> Google Developer Console のブラウザ API キーとクライアント ID の本番環境ドメインをホワイトリストに登録
> Firebase コンソール パネルの [Authentication] タブにある本番環境ドメインをホワイトリストに登録

併せて、stackoverflowの[How to restrict Firebase data modification?](https://stackoverflow.com/questions/35418143/how-to-restrict-firebase-data-modification)を参照すると理解が深まります。

/__/firebase/init.jsの例については、firebaseの各種デモサイトで確認できます。

例えば、[https://github.com/firebase/friendlypix](https://github.com/firebase/friendlypix)のデモサイトの[/__/firebase/init.jsを確認](https://friendly-pix.com/__/firebase/init.js)してみてください。


但し、/__/firebase/init.js を無理に使用する必要はありません。webpack, dotenvなどを使用し、build時に環境変数から```firebase.initializeApp()```に値を設定する方法もできます。

## FAQ

### Q.1

Basic認証でアクセス制限することはできますか？

#### A.1

Firebase Hostingの機能として、Basic認証などによるアクセス制限はできません。

Cloud Functionsを使用して、Basic認証(もどき)をかけることはできます。 但し、[ホスティングの優先順位](https://firebase.google.com/docs/hosting/url-redirects-rewrites#section-priorities)に記載の通り、リライトの設定よりも、正確に一致する静的コンテンツの方が優先度が高いので、```/```のアクセスはBasic認証かかるが、```/index.html```のアクセスはBasic認証がかかりません。

> 異なる構成オプションが競合することがあります。競合が発生した場合、Firebase Hosting からのレスポンスは次の優先順位に従って決定されます。
> 
> - 1.予約済み名前空間（/__*）
> - 2.リダイレクトの構成
> - 3.正確に一致する静的コンテンツ
> - 4.リライトの構成
> - 5.カスタムの 404 ページ
> - 6.デフォルトの 404 ページ

##### 実装例

ホスティングの優先順位で説明した通り、正確に一致する静的コンテンツはBasic認証がかからないので、HTMLさえ取得できればHTMLに記載れているCSS, IMGなどは普通に取得でき、Webページが正常に表示できます。

- レスポンスとして返すHTMLファイルをCloud Storageにアップロードする
- [関数に Hosting リクエストを送信する](https://firebase.google.com/docs/hosting/functions#direct_hosting_requests_to_your_function)のように、リライト設定でCloud Functionsを指定
- Cloud Functionsでは[express](https://github.com/expressjs/express)と[basic-auth-connect](https://github.com/expressjs/basic-auth-connect)を使用して、Basic認証を行い、認証されたらCloud Storageからindex.htmlを取得して、レスポンスとして返す
