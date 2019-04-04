---
title: Cloud Firestore
date: "2019-04-01T00:00:00.000Z"
description: Cloud Firestore Guide
order: 400
---

## Docs
https://firebase.google.com/docs/firestore/

## Point

理解しなければならないことが多いですが、全てのドキュメントに一通り目を通しておいた方がよいです。

特に見落としがちだったり、重要な項目を下記に挙げています。

### [デプロイ](https://firebase.google.com/docs/cli/#deployment)

コンソールから下記を変更できますが、ファイルで管理して、これらもデプロイ対象とし、デプロイ時に常に最新の状態に更新する運用にした方が安全ですし管理もしやすいです。検証目的であればコンソールから変更しても構いません。
- Cloud Firestore のルール
- Cloud Firestore のインデックス

### [インデックス マージの活用](https://firebase.google.com/docs/firestore/query-data/index-overview#taking_advantage_of_index_merging)

> より適切なソリューションとして、等式句のインデックスをマージする Cloud Firestore の機能を利用することにより、インデックスの数を減らすことができます。

単一のフィールド毎にインデックスを作成するのもありだと思います。

### [Cloud Firestore のロケーション](https://firebase.google.com/docs/firestore/locations)

> プロジェクトのロケーションを選択した後は、ロケーションを変更できません。 プロジェクトのロケーションの設定は複数のプロダクトに適用されます。

ロケーションを決める必要があります。

asia-northeast1(東京)がありますが、現時点（2019/03）ではマルチリージョンではありません。

レイテンシが気にはなるのですが、現時点（2019/03）では本番環境はnam5/us-central(米国)でいいかと思っています。

Cloud FunctionsからCloud Firestoreを使用する場合、それぞれ同じリージョンにする必要があるので、注意してください。

### [Cloud Firestore にデータを追加する](https://firebase.google.com/docs/firestore/manage-data/add-data)

```add()```, ```set()```, ```update()```の違いを理解する必要があります。

端的には下記でよいです。

- ドキュメントが存在するかどうかわからない場合、新規でドキュメントを作成しても問題ない場合は、```set(data, {merge: true})```を使用する
- ドキュメントが確実に存在する場合、ドキュメントが存在していない場合はエラーにすべき場合は、```update(data)```を使用する

#### add()

Cloud Firestore が ID を自動的に生成して、ドキュメントを新規登録します。

#### set()

> 単一のドキュメントを作成または上書きする

> ドキュメントが存在しない場合は作成されます。ドキュメントが存在する場合は、次のように、既存のドキュメントにデータを統合するように指定しない限り、新しく提供されたデータでコンテンツが上書きされます。

> ドキュメントが存在するかどうかわからない場合は、新しいデータを既存のドキュメントに統合してドキュメント全体を上書きすることを回避するオプションを渡します。

> .add(...) と .doc().set(...) は完全に同等

- IDを指定しない場合、Cloud FirestoreがIDを自動的に生成して、ドキュメントを新規登録します
- IDを指定且つ指定したIDのドキュメントが存在しない場合、指定したIDでドキュメントを新規登録します
- IDを指定且つ指定したIDのドキュメントが存在且つドキュメント全体を上書きすることを回避するオプション({ merge: true })を指定しない場合、指定したIDでドキュメント全体を全て上書きします。（ドキュメントが置きかわります。ドキュメントに設定されていた各フィールドの値などは残りません。）
- IDを指定且つ指定したIDのドキュメントが存在且つドキュメント全体を上書きすることを回避するオプション({ merge: true })を指定した場合、ドキュメント全体を上書きせずにドキュメントの一部のフィールドを更新します。（```update()```と同等）

#### update()

> ドキュメント全体を上書きせずにドキュメントの一部のフィールドを更新する

存在するフィールドのは上書きされ、存在しないフィールドは追加されます。マージのような動作になります。

### [トランザクションでデータを更新する](https://firebase.google.com/docs/firestore/manage-data/transactions)

> Cloud Firestore クライアント ライブラリを使用して、複数のオペレーションを 1 つのトランザクションにまとめることができます。フィールドの値を、その現行値またはその他のフィールドの値に基づいて更新する場合には、トランザクションが便利です。

> 同時編集の場合、Cloud Firestore はトランザクション全体を再実行します。

> 読み取りオペレーションは書き込みオペレーションの前に実行する必要があります。

> トランザクションが読み取るドキュメントに対して同時編集が影響する場合は、トランザクションを呼び出す関数（トランザクション関数）が複数回実行されることがあります。

> トランザクションが、トランザクション外部で変更されたドキュメントを読み取る。この場合、トランザクションは自動的に再実行されます。トランザクションは一定の回数で再試行されます。

データベースにもトランザクションがありますが、動作が全く異なります。

テーブルロックや行ロックが行われるのではありません。

処理は並列に実行され、トランザクション内部で参照・更新対象のドキュメントが、トランザクション処理中にトランザクション外部で更新されていた場合、トランザクションは自動的に再実行されます。

つまり、トランザクション内部の処理は再実行される可能性があるのです。

例えば、トランザクション内部に外部APIを使用した登録・更新・削除処理などがある場合、外部APIが複数回実行されてしまう可能性があるということです。

他のよくある例としては、『ドキュメントのstatusフィールドが、fooの場合のみ処理を行う』など、ドキュメントの特定のフィールドの状態によって処理を分岐する場合にも、厳密にはトランザクションを設定しておく必要があります。

なぜなら、トランザクションの処理中に他の更新処理が実施され、ドキュメントのstatusフィールドがfooから別の値に、変更されている可能性があるからです。

### [一括書き込み](https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes)

> オペレーション セットでドキュメントを読み取る必要がない場合は、複数の書き込みオペレーションを 1 つのバッチとして実行できます。
> 一括書き込みには最大 500 のオペレーション

無条件で、複数のドキュメントを一括で登録・更新したい場合に使用します。

### [Cloud Firestore でリアルタイム アップデートを入手する](https://firebase.google.com/docs/firestore/query-data/listen)

> onSnapshot() メソッドを使用すると、ドキュメントをリッスンできます。コンテンツが変更されるたびに、別の呼び出しによってドキュメント スナップショットが更新されます。
> コンテンツが変更されるたびに、別の呼び出しによってドキュメント スナップショットが更新されます。

チャットをイメージするとわかりやすいと思います。Slackなどの一般的なチャットサービスでは、画面を更新などしなくても、、最新のデータが自動で表示されますね。つまり、リッスンしているドキュメントやコレクション（クエリ）のデータが更新されると、更新を自動で検知して、自動でデータを取得できます。

Reactなどを使用したSPAでは、再描画のコストを削減するためにも、全件取得・全件再描画するのではなく、[スナップショット間の変更の表示](https://firebase.google.com/docs/firestore/query-data/listen#view_changes_between_snapshots)を使用して、変更があったデータのみを判定し、コンポーネントを更新した方がよいです。

また、コンポーネントがアンマウントされた際には、[リスナーのデタッチ](https://firebase.google.com/docs/firestore/query-data/listen#detach_a_listener)を、忘れずに実施した方がよいです。

### [クエリの制限事項](https://firebase.google.com/docs/firestore/query-data/queries#query_limitations)｜[Cloud Firestore でのデータの並べ替えと制限](https://firebase.google.com/docs/firestore/query-data/order-limit-data)

Cloud Firestoreの弱点である、クリティカルな制限が多いので、必ず目を通す必要があります。

### [Cloud Firestore でのデータの保護](https://firebase.google.com/docs/firestore/security/overview)

データの保護については、全てに必ず目を通してください。

[ユーザーとグループのデータアクセスを保護する](https://firebase.google.com/docs/firestore/solutions/role-based-access)、[rules/index-all](https://firebase.google.com/docs/reference/rules/index-all)についても、目を通すと理解が深まります。

### [割り当てと制限](https://firebase.google.com/docs/firestore/quotas)

一通り目を通してください。

> ドキュメントへの最大書き込み速度 1 秒あたり 1
> コレクションへの最大書き込み速度 1 秒あたり 500

書き込み速度は早くないので、注意が必要です。

## Caution

- トランザクション内部の処理は再実行される可能性があります
- [Cloud Firestore でのデータの保護](https://firebase.google.com/docs/firestore/security/overview)を読んで、セキュリティルールを必ず設定しましょう
-  セキュリティルールのテストについては、下記が参考になります
  - https://techlife.cookpad.com/entry/2018/11/05/143000
  - https://github.com/sgr-ksmt/firestore-emulator-rules-test
  - https://github.com/firebase/quickstart-nodejs/tree/master/firestore-emulator/typescript-quickstart
  - https://github.com/zkohi/firebase-testing-samples

## FAQ

### Q.1

データのバックアップはできますか？

#### A.1

できます。[データのエクスポートをスケジュールする](https://firebase.google.com/docs/firestore/solutions/schedule-export)を参照してください。

ドキュメントでは、App Engineのcron.yamlを使用する例になっていますが、cron.yamlではなく[Cloud Scheduler](https://cloud.google.com/scheduler/docs/creating)を使用した方がよいです。Cloud SchedulerでApp EngineのURLを指定します。

任意のユーザーがApp EngineのURLにアクセスできてしまうと、セキュリティーの観点で問題なので、[Cloud IAP アクセスの設定](https://cloud.google.com/iap/docs/app-engine-quickstart#iap-access)を行い、アクセスできるユーザーを制限します。

### Q.2

バックアップしたデータをグラフなどで可視化しないのですが、可能でしょうか？

#### A.2

私の場合は、下記の流れで日次でBigQueryにデータを蓄積して、データポータルで可視化しています。データポータルには下記制限があるのでご注意ください。

> ほとんどのグラフで、ディメンションと指標をそれぞれ 20 種類まで指定できるようになっています。期間グラフは最大 20 種類の指標に対応、表はディメンション 10 種類と指標最大 20 種類に対応しています。

App EngineやBigQueryのクエリの作成に多少時間がかかりますが、数日で実装できる内容です。

- App EngineでCloud StorageからBigQueryにエクスポート([Cloud Firestore のエクスポートからのデータの読み込み](https://cloud.google.com/bigquery/docs/loading-data-cloud-firestore)で、APIを使用して[分割テーブル](https://cloud.google.com/bigquery/docs/partitioned-tables#partitioned_tables)として蓄積)([Cloud Scheduler](https://cloud.google.com/scheduler/)でApp EngineのURLを指定して定期実行)
  - [Cloud Firestore のオプション](https://cloud.google.com/bigquery/docs/loading-data-cloud-firestore#cloud_firestore_options)に記載されている[projectionFields](https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs#configuration.load.projectionFields)を指定して、個人情報・機密情報に当たるフィールドを除外してデータをBigQueryにエクスポートしましょう
- BigQueryの[Schedule Query](https://cloud.google.com/bigquery/docs/scheduling-queries)でデータ集計・整形(月次テーブル)
    - Schedule Queryの設定で、Cloud Pub/Sub topicを設定した場合は、Cloud FunctionsからSlackなどに通知するように設定しておくと便利です
- [データポータル](https://datastudio.google.com/overview)で月次テーブルを可視化
