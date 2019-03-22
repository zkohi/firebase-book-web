---
title: Firebase を JavaScript プロジェクトに追加する
date: "2019-03-21T00:00:00.000Z"
description: firebase book web
---

## Docs
https://firebase.google.com/docs/web/setup

## Point

初期設定を行うだけですので、リファレンス通り実施すれば、つまずくことはありません。

基本的には、記載の通りですが、databaseやmessagingなど、使用しないfirebaseのコンポーネントは読み込む必要はないです。

使用するfirebaseのコンポーネントだけに絞った方が良いです。

> Browserify や webpack などのバンドラを使用している場合は、使用するコンポーネントを require() の対象にします。

## FAQ

### Q.1
configとして設定する値をHTMLとして、コピー＆ペーストするようですが、configに設定している設定値が外部公開されてしまうということでしょうか？

#### A.1
はい。外部公開されます。

### Q.2
configに設定している設定値が外部公開されてもセキュリティーとしては問題ないのでしょうか？

#### A.2

従量課金プラン(Blaze)にしていないのであれば、何か攻撃や不具合があっても不要な課金は発生しないので、基本的には問題ないとは思います。但し、デプロイして本番公開する前に、API KEYのアクセス制限を設定しておいた方がよいです。

コンソールにログインし、API KEYを公開予定のホストからのアクセスのに設定（HTTP referrersに公開予定のホストをホワイトリストに登録）するだけですので、設定しておきましょう。

[SDK のインポートと暗黙の初期化](https://firebase.google.com/docs/web/setup#sdk_imports_and_implicit_initialization)に記載されている通り、Firebase Hosting を使用してウェブアプリをホストすると、/__/firebase/init.jsにconfigとして設定する値が自動で設定され、外部公開されているので、API KEYのアクセス制限をプロジェクト作成後すぐに設定しておいた方がよいです。

開発用で使用するプロジェクトの場合は、localhostなどの実際にローカル環境でアクセスするホスト名を追加すれば問題ないと思います。

[Firebase リリース チェックリスト](https://firebase.google.com/support/guides/launch-checklist)にも下記の記載があります。

> 不正使用を防ぐためのドメインのホワイトリストを追加します。
>   
> Google Developer Console のブラウザ API キーとクライアント ID の本番環境ドメインをホワイトリストに登録
> Firebase コンソール パネルの [Authentication] タブにある本番環境ドメインをホワイトリストに登録

併せて、stackoverflowの[How to restrict Firebase data modification?](https://stackoverflow.com/questions/35418143/how-to-restrict-firebase-data-modification)を参照すると理解が深まります。

/__/firebase/init.jsの例については、firebaseの各種デモサイトで確認できます。

例えば、[https://github.com/firebase/friendlypix](https://github.com/firebase/friendlypix)のデモサイトの[/__/firebase/init.jsを確認](https://friendly-pix.com/__/firebase/init.js)してみてください。

