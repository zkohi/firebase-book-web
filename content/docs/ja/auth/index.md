---
title: Firebase Authentication
date: "2019-04-01T00:00:00.000Z"
description: Firebase Authentication Guide
order: 300
---

## Docs
https://firebase.google.com/docs/auth/

## Point

各種認証機能を使用して、簡単にログイン機能やユーザー管理を行うことができます。

ドキュメントに従って、認証機能を実装しましょう。

１つのアカウントが、複数の認証プロバイダを使用してログインできるようにする場合、任意の認証プロバイダでアカウントを作成後、他の認証プロバイダの認証情報をリンクするという流れになります。

詳しくは[JavaScript を使用してアカウントに複数の認証プロバイダをリンクする](https://firebase.google.com/docs/auth/web/account-linking)に記載されています。

また、[カスタム クレームとセキュリティ ルールによるアクセスの制御](https://firebase.google.com/docs/auth/admin/custom-claims)に、必ず目を通しておきましょう。

boolean/numberで設定できるようなユーザーの属性情報は、カスタムクレームを使用すると便利です。

例えば、管理者権限、通知のON/OFF、無料チケットの枚数、課金上限などは、Firestoreなどの他のストレージにデータを保存するのではなく、カスタムクレームに設定した方がデータの管理含め簡単です。

[Firebase Authentication の制限](https://firebase.google.com/docs/auth/limits)にも目を通しておきましょう。

## Caution

### 本番環境用のプロジェクトの場合

- 承認済みドメインにデフォルトで設定されているlocalhostを削除する

### カスタムドメインを使用する場合

- 承認済みドメインにカスタムドメインを追加する
- Google認証を使用する場合、[Google ログインのリダイレクト ドメインのカスタマイズ](https://firebase.google.com/docs/auth/web/google-signin)を設定する
- Facebook認証を使用する場合、[Facebook ログインのリダイレクト ドメインのカスタマイズ](https://firebase.google.com/docs/auth/web/facebook-login)を設定する
- Twitter認証を使用する場合、[Twitter ログインのリダイレクト ドメインのカスタマイズ](https://firebase.google.com/docs/auth/web/twitter-login)を設定する
- GitHubを使用する場合、[GitHub ログインのリダイレクト ドメインのカスタマイズ](https://firebase.google.com/docs/auth/web/github-auth)を設定する

### Facebook認証を使用する場合

- Facebookアプリを公開する

※Facebookアプリを公開していないと、Facebook認証でエラーになります。

※個人開発などで、自分のアカウントで登録したFacebookアプリを使用して開発をしている且つ自分のアカウントでしか認証のテストをしていない場合、アプリを公開していなくても自分のアカウントでは認証はエラーにならず、正常にFacebook認証で登録できてしまうので、Facebookアプリを公開することを忘れてしまう場合があります。

## FAQ

### Q.1
Twitter認証でメールアドレスが取得できません。

#### A.1
Twitterアプリの設定で、[認証の際にメールアドレスを要求する設定](https://developer.twitter.com/en/docs/basics/apps/guides/app-permissions.html)を行う必要があります。

### Q.2
アカウント数の推移をグラフなどで可視化しないのですが、可能でしょうか？

#### A.2

私の場合は、下記の流れで日次でBigQueryにデータを蓄積して、データポータルで可視化しています。Cloud Functions, App Engineは多少の実装は必要です。また、データポータルには下記制限があるのでご注意ください。
                                                                                         
> ほとんどのグラフで、ディメンションと指標をそれぞれ 20 種類まで指定できるようになっています。期間グラフは最大 20 種類の指標に対応、表はディメンション 10 種類と指標最大 20 種類に対応しています。

FirestoreからCloud Storageへのエクスポートについては、[データのエクスポートをスケジュールする](https://firebase.google.com/docs/firestore/solutions/schedule-export)を参照してください。

ドキュメントでは、App Engineのcron.yamlを使用する例になっていますが、cron.yamlではなく[Cloud Scheduler](https://cloud.google.com/scheduler/docs/creating)を使用した方がよいです。Cloud SchedulerでApp EngineのURLを指定します。

任意のユーザーがApp EngineのURLにアクセスできてしまうと、セキュリティーの観点で問題なので、[Cloud IAP アクセスの設定](https://cloud.google.com/iap/docs/app-engine-quickstart#iap-access)を行い、アクセスできるユーザーを制限します。

BigQueryのクエリの作成にも多少時間がかかりますが、数日で実装できる内容です。

- Cloud Functionsで[admin.auth().listUsers()](https://firebase.google.com/docs/reference/admin/node/admin.auth.Auth#listUsers)を使用して、500件毎にFirestoreに一括書き込みでエクスポート([Cloud Scheduler](https://cloud.google.com/scheduler/)でPubSubのトピックを指定して定期実行)
- App EngineでFirestoreからCloud Storageにエクスポート([Cloud Scheduler](https://cloud.google.com/scheduler/)でApp EngineのURLを指定して定期実行)
- App EngineでCloud StorageからBigQueryにエクスポート([Cloud Firestore のエクスポートからのデータの読み込み](https://cloud.google.com/bigquery/docs/loading-data-cloud-firestore)で、APIを使用して[分割テーブル](https://cloud.google.com/bigquery/docs/partitioned-tables#partitioned_tables)として蓄積)([Cloud Scheduler](https://cloud.google.com/scheduler/)でApp EngineのURLを指定して定期実行)
- BigQueryの[Schedule Query](https://cloud.google.com/bigquery/docs/scheduling-queries)でデータ集計・整形(月次テーブル)
  - Schedule Queryの設定で、Cloud Pub/Sub topicを設定した場合は、Cloud FunctionsからSlackなどに通知するように設定しておくと便利です
- [データポータル](https://datastudio.google.com/overview)で月次テーブルを可視化
