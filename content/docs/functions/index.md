---
title: Cloud Functions for Firebase
date: "2019-04-01T00:00:00.000Z"
description: Cloud Functions for Firebase Guide
order: 700
---

## Docs
https://firebase.google.com/docs/functions/

## Point

> 以下のような他の Firebase および Google Cloud 機能によって生成されたイベントに応答できます。
> Cloud Firestore トリガー
>
> Realtime Database トリガー
>
> Remote Config トリガー
>
> Firebase Authentication トリガー
>
> Firebase 向け Google アナリティクス トリガー
>
> Crashlytics トリガー
>
> Cloud Storage トリガー
>
> Cloud Pub/Sub トリガー
>
> HTTP トリガー

各種イベントをトリガーにして、処理が実行されます。

[firebase/functions-samples](https://github.com/firebase/functions-samples)に各種実装例があるので、一通り目を通しておくとよいでしょう。

また、TypeScriptを使用できますので、[Cloud Functions に TypeScript を使用する](https://firebase.google.com/docs/functions/typescript)に従って、TypeScriptで実装することを推奨します。

特に見落としがちだったり、重要な項目を下記に挙げています。

### [Cloud Functions の単体テスト](https://firebase.google.com/docs/functions/unit-testing)

オンラインモードでテストを実装すれば問題ないと思います。データベースへの書き込みやユーザーの作成などが実際に行われますので、テスト用のプロジェクトを別途用意して、キーファイルを作成して使用します。

ドキュメントではmochaを使用していますが、[jest](https://jestjs.io/)でも問題ありません。

### [関数のデプロイとランタイム オプションを管理する](https://firebase.google.com/docs/functions/manage-functions)

> デフォルトでは、Firebase CLI によって about.js 内のすべてのファンクションが同時にデプロイされます。
> 膨大な数の関数をデプロイすると、標準の割り当てを超えてしまい、HTTP 429 Quota エラー メッセージが表示されることがあります。

30個程度であれば、たまに、タイムアウトでエラーになることはなりますが、全関数を同時にデプロイしても問題なく動作しています。

タイムアウトやメモリ割り当てをコードで指定することもできますし、コンソールで指定することもできます。コンソールだけで設定を行っている場合は、再デプロイしても設定値がデフォルトに戻ることはないので、コンソールで設定する方法がよいです。

### [非同期関数の再試行](https://firebase.google.com/docs/functions/retries)

> エラーが発生したときにファンクションを再試行する場合は、「失敗時に再試行する」プロパティを設定して、デフォルトの再試行ポリシーを変更できます。これにより、ファンクションが正常に完了するまで数日間イベントが繰り返し再試行されます。

> 警告: 「失敗時に再試行する」を設定すると、関数は、正常に実行されるまで、または最大再試行期間（数日間の場合もあります）が経過するまで、繰り返し実行されます。そのため、失敗の原因がバグやその他の永続的なエラーの場合、ファンクションが再試行ループに陥る恐れがあります。この設定は、一時的な障害（エンドポイントの不安定さや断続的なタイムアウトなど）を扱う場合や、このプロパティ セットを使用せずにコードのプレッシャー テストをすでに実行した場合にのみ使用してください。ファンクションが再試行ループに陥った場合は、ファンクションを再デプロイするか削除して実行を終了する必要があります。

> ファンクションは成功するまで継続的に再試行されるため、バグなどの永続的なエラーを完全に削除してから再試行を有効にしてください。再試行によって解決される可能性が高い断続的なエラーや一時的なエラー（サービス エンドポイントの不安定さやタイムアウトなど）を処理するには、再試行が最適です。

動作確認できていない関数を、安易にコンソールから再試行の有効化を実施しない方がよいです。エラーになって再試行が繰り返される可能性があります。再試行されていることに気づかずに放置した場合、知らぬ間に膨大な請求額になってしまう可能性もあります。

再試行の有効化する場合は、[無限再試行ループを避けるための終了条件の設定](https://firebase.google.com/docs/functions/retries#set_an_end_condition_to_avoid_infinite_retry_loops)を行い、適切な実行時間でイベントを破棄し、関数を正常終了させてください。

もし、エラーになって再試行が繰り返される状態になってしまった場合は、落ち着いてコンソールから当該関数を削除しましょう。

[Stackdriver Monitoring](https://cloud.google.com/monitoring/)で、Cloud Functionsの実行回数のメトリクスを参照して、アラート通知することもできますので、設定しておいても良いと思います。

### [環境の構成](https://firebase.google.com/docs/functions/config-env)

Cloud Functionsで使用する環境変数を設定できます。サードパーティの API キーや動作環境（開発・本番・テスト）で変更したい値を環境変数に設定すると便利です。

[Cloud Functions の単体テスト](https://firebase.google.com/docs/functions/unit-testing)や[ローカルでのファンクションの実行](https://firebase.google.com/docs/functions/local-emulator)する場合、```functions/.runtimeconfig.json```が参照されます。```firebase functions:config:get > .runtimeconfig.json```で、現在の設定値を取得して、テスト用の値に書き換えてから単体テストやローカルでのファンクションの実行をしてください。

### [ネットワークの最適化 | 持続的な接続を維持する](https://firebase.google.com/docs/functions/networking#maintaining_persistent_connections)

- HTTP/S リクエストはKeep-Aliveを設定する
- PubSubなどのGoogle APIは、グローバルスコープでクライアントオブジェクトを作成する

## Caution

### [Cloud Pub/Sub トリガー](https://firebase.google.com/docs/functions/pubsub-events)

デプロイすると、自動でトピックとサブスクリプションが設定されます。

[onPublish(handler)](https://firebase.google.com/docs/reference/functions/functions.pubsub.TopicBuilder#onPublish)でも、handlerの第２引数に[context](https://firebase.google.com/docs/reference/functions/functions.EventContext)が設定されるので、[無限再試行ループを避けるための終了条件の設定](https://firebase.google.com/docs/functions/retries#set_an_end_condition_to_avoid_infinite_retry_loops)を設定できます。

### [非同期関数の再試行](https://firebase.google.com/docs/functions/retries)

安易にコンソールから再試行の有効化を実施しないでください

### [呼び出し可能ファンクション](https://firebase.google.com/docs/functions/callable#write_and_deploy_the_callable_function)

contextでユーザのログイン状態やカスタムクレーム・属性情報を参照してアクセス可否の判定を行うなど、セキュアな実装を行いましょう

### [割り当てと制限 | 時間制限](https://firebase.google.com/docs/functions/quotas)

> ファンクションの最大期間 | 強制終了されるまでファンクションを実行できる最大時間 | 540 秒

バッチ処理もできますが、上記の制限があるので、注意してください。

> ビルドの最大時間 | すべてのビルドで許可されている最大時間。ファンクションのビルドはデプロイ時に発生します。 | 1 日あたり 120 分

1日にできるデプロイに時間制限があるので、むやみにデプロイの実行しすぎないように、注意してください。

> バックグラウンドファンクションの最大非アクティブ時間	| 呼び出しを行わずにバックグラウンド ファンクションを保持できる最大時間。この時間中に 1 回も呼び出されなかったファンクションは、新しいイベントが発生してもトリガーされない状態になることがあります。この状態になった場合は、該当のファンクションを再デプロイして処理を再開する必要があります。

月次バッチの場合は30日を超える可能性があるので、注意してください。

### Google以外のサードパーティAPIを使用するなどして、外部への通信が発生する場合

アカウントの課金設定と[有料プラン](https://firebase.google.com/pricing/)への変更が必要です。