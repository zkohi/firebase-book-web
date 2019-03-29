---
title: 初期設定 | Firebase を JavaScript プロジェクトに追加する
date: "2019-03-21T00:00:00.000Z"
description: 初期設定 | Firebase を JavaScript プロジェクトに追加する
---

# Setup

## Docs
https://firebase.google.com/docs/web/setup

## Point

初期設定を行うだけですので、ドキュメント通り実施すれば、つまずくことはありません。

基本的には、記載の通りですが、databaseやmessagingなど、使用しないfirebaseのコンポーネントは読み込む必要はないです。

使用するfirebaseのコンポーネントだけに絞った方が良いです。

## FAQ

### Q.1
configとして設定する値をHTMLとして、コピー＆ペーストするようですが、configに設定している設定値が外部公開されてしまうということでしょうか？

#### A.1
はい。外部公開されます。

### Q.2
configに設定している設定値が外部公開されてもセキュリティーとしては問題ないのでしょうか？問題ないという記事が多いのですが。

#### A.2

デプロイして本番公開する前に、API KEYのアクセス制限を設定しておいた方がよいです。

コンソールにログインし、API KEYを公開予定のホストからのアクセスのみに設定（HTTP referrersに公開予定のホストをホワイトリストに登録）するだけですので、設定しておきましょう。

[SDK のインポートと暗黙の初期化](https://firebase.google.com/docs/web/setup#sdk_imports_and_implicit_initialization)に記載されている通り、Firebase Hosting を使用してウェブアプリをホストすると、/__/firebase/init.jsにconfigとして設定する値が自動で設定され、外部公開されます。

設定することを忘れないうちに、API KEYのアクセス制限は、プロジェクト作成後すぐに設定しておいた方がよいです。

開発用で使用するプロジェクトの場合は、localhostなどの実際にローカル環境でアクセスするホスト名を追加すれば問題ないです。

[Firebase リリース チェックリスト](https://firebase.google.com/support/guides/launch-checklist)にも下記の記載があります。

> 不正使用を防ぐためのドメインのホワイトリストを追加します。
>   
> Google Developer Console のブラウザ API キーとクライアント ID の本番環境ドメインをホワイトリストに登録
> Firebase コンソール パネルの [Authentication] タブにある本番環境ドメインをホワイトリストに登録

併せて、stackoverflowの[How to restrict Firebase data modification?](https://stackoverflow.com/questions/35418143/how-to-restrict-firebase-data-modification)を参照すると理解が深まります。

/__/firebase/init.jsの例については、firebaseの各種デモサイトで確認できます。

例えば、[https://github.com/firebase/friendlypix](https://github.com/firebase/friendlypix)のデモサイトの[/__/firebase/init.jsを確認](https://friendly-pix.com/__/firebase/init.js)してみてください。
