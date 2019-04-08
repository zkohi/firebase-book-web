---
title: Cloud Storage
date: "2019-04-01T00:00:00.000Z"
description: Cloud Storage Guide
order: 500
---

## Firebase Docs

https://firebase.google.com/docs/storage/

## Point

Cloud Storageをfirebaseから使用できます。ドキュメント通り実施すれば、つまずくことはありません。

### [デプロイ](https://firebase.google.com/docs/cli/#deployment)

コンソールからCloud Storage のルールを変更できますが、ファイルで管理して、これらもデプロイ対象とし、デプロイ時に常に最新の状態に更新する運用にした方が安全ですし管理もしやすいです。検証目的であればコンソールから変更しても構いません。

## Caution

下記を読んで、Firebase Storageセキュリティルールを必ず設定しましょう。

- [Cloud Storage 用の Firebase セキュリティ ルールを理解する](https://firebase.google.com/docs/storage/security/)
- [ファイルを保護する方法を学ぶ](https://firebase.google.com/docs/storage/security/secure-files)
- [ユーザーデータを保護する](https://firebase.google.com/docs/storage/security/user-security)
- [Firebase Security Rules for Cloud Storage Reference](https://firebase.google.com/docs/reference/security/storage/)

[カスタム メタデータ](https://firebase.google.com/docs/storage/web/file-metadata#custom_metadata)を使用した[セキュリティルール](https://firebase.google.com/docs/storage/security/user-security#group_private)が特殊で有用な方法ですので、覚えておいた方がよいでしょう。
