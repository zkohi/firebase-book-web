---
title: Firebase Deployment
date: "2019-04-01T00:00:00.000Z"
description: Firebase Deployment Guide
order: 900
---

[Cloud Build](https://cloud.google.com/cloud-build/)でFirebaseのデプロイを行う方法を紹介します。各種設定ファイルの内容などは一例ですので、ご自身の環境に併せて変更する必要があります。

## setup gcloud

```
$ gcloud config configurations create [configuration-name]
$ gcloud config set project [project-name]
$ gcloud config set account [mail-address]
```

## build images

[クラウド ビルダー](https://cloud.google.com/cloud-build/docs/cloud-builders)で提供されているビルダーイメージを使用して、デプロイに必要な各種Dockerイメージを作成し、Container Registryにpushする。

- https://github.com/GoogleCloudPlatform/cloud-builders
- https://github.com/GoogleCloudPlatform/cloud-builders-community

例では[ghq](https://github.com/motemen/ghq)を使用していますが、リポジトリをcloneするだけでよいです。

```
$ ghq get git@github.com:GoogleCloudPlatform/cloud-builders-community.git
$ cd firebase
$ gcloud builds submit --config cloudbuild.yaml .
$ ghq get git@github.com:GoogleCloudPlatform/cloud-builders.git
$ cd yarn
$ gcloud builds submit --config cloudbuild.yaml .
$ cd ../npm
$ gcloud builds submit --config cloudbuild.yaml .
```

## 認証トークンの取得・暗号化

#### 認証トークンの取得

```
$ firebase login:ci
```

#### 認証トークンの暗号化

```
$ gcloud kms keyrings create cloudbuilder --location global
$ gcloud kms keys create firebase-token --location global --keyring cloudbuilder --purpose encryption
$ echo -n [認証トークン] | gcloud kms encrypt \
  --plaintext-file=- \
  --ciphertext-file=- \
  --location=global \
  --keyring=cloudbuilder \
  --key=firebase-token | base64
```

#### 環境変数の暗号化(dotenvを使用している前提 | .env -> .env.prod.enc)

```
$ gcloud kms encrypt \
  --plaintext-file=.env \
  --ciphertext-file=.env.prod.enc \
  --location=global \
  --keyring=cloudbuilder \
  --key=firebase-token
```

## firebaseの各種設定ファイルの準備

#### firebase.json(環境毎に動作を変更したい場合などは、firebase.prod.jsonを別途用意して、firebase.jsonにコピーしたりもできます)

See: [Firebase CLI リファレンス](https://firebase.google.com/docs/cli/

```
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "functions": {
    "predeploy": [
      "npm --prefix \"$RESOURCE_DIR\" run lint",
      "npm --prefix \"$RESOURCE_DIR\" run build"
    ]
  },
  "hosting": {
    "target": "web",
    "public": "dist",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
  "storage": {
    "rules": "storage.rules"
  }
}
```

#### firestore.indexes.json

See: [Cloud Firestore でのインデックス管理](https://firebase.google.com/docs/firestore/query-data/indexing)

```
{
  "indexes": [
    {
      "collectionId": "users",
      "fields": [
        { "fieldPath": "foo", "mode": "ASCENDING" },
        { "fieldPath": "bar", "mode": "DESCENDING" }
      ]
    }
  ]
}
```

#### firestore.rules

See: [Cloud Firestore セキュリティ ルールを使ってみる](https://firebase.google.com/docs/firestore/security/get-started)

```
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth.uid != null;
    }
  }
```

#### storage.rules

See: [Cloud Storage 用の Firebase セキュリティ ルールを理解する](https://firebase.google.com/docs/storage/security/)

```
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{imageId} {
      // Only allow uploads of any image file that's less than 5MB
      allow write: if request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## cloudbuild.yaml

[基本的なビルド構成ファイルの作成](https://cloud.google.com/cloud-build/docs/configuring-builds/create-basic-configuration?hl=ja)を参照してください。一見難しそうですが、```name```にタスクを実行するコンテナイメージ（≒コマンド）を指定して、そのコマンドに```args```で引数を配列で指定しているイメージでよいです。

#### storage, firestore, hosting


```
secrets:
- kmsKeyName: projects/[project-name]/locations/global/keyRings/cloudbuilder/cryptoKeys/firebase-token
  secretEnv:
    FIREBASE_TOKEN: [暗号化した認証トークン]
steps:
- id: 'decrypt .env'
  name: 'gcr.io/cloud-builders/gcloud'
  args:
  - 'kms'
  - 'decrypt'
  - '--ciphertext-file=.env.prod.enc'
  - '--plaintext-file=.env'
  - '--location=global'
  - '--keyring=cloudbuilder'
  - '--key=firebase-token'

- id: 'cp fireabase.json'
  name: 'gcr.io/cloud-builders/gcloud'
  entrypoint: 'cp'
  args:
  - 'firebase.prod.json'
  - 'firebase.json'

- id: 'yarn install'
  name: 'gcr.io/$PROJECT_ID/yarn'
  args: ['install']

- id: 'build'
  name: 'gcr.io/$PROJECT_ID/yarn'
  entrypoint: 'node_modules/.bin/webpack'
  args:
  - '--config'
  - 'webpack.config.prod.js'

- id: "deploy firebase storage"
  name: 'gcr.io/$PROJECT_ID/firebase'
  args: ['deploy', '--only', 'storage', '--project=project-name']
  secretEnv: ['FIREBASE_TOKEN']

- id: "deploy firebase firestore"
  name: 'gcr.io/$PROJECT_ID/firebase'
  args: ['deploy', '--only', 'firestore', '--project=project-name']
  secretEnv: ['FIREBASE_TOKEN']

- id: "deploy firebase hosting"
  name: 'gcr.io/$PROJECT_ID/firebase'
  args: ['deploy', '--only', 'hosting', '--project=project-name']
```

#### functions

```
secrets:
- kmsKeyName: projects/[project-name]/locations/global/keyRings/cloudbuilder/cryptoKeys/firebase-token
  secretEnv:
    FIREBASE_TOKEN: [暗号化した認証トークン]

- id: 'cp fireabase.json'
  name: 'gcr.io/cloud-builders/gcloud'
  entrypoint: 'cp'
  args:
  - 'firebase.prod.json'
  - 'firebase.json'

- id: 'functions npm install'
  name: 'gcr.io/$PROJECT_ID/npm'
  args: ['install']
  dir: 'functions'

- id: "deploy firebase"
  name: 'gcr.io/$PROJECT_ID/firebase'
  args: ['deploy', '--only', 'functions', '--project=project-name']
```

## ビルドトリガー

[ビルドトリガーを使用したビルドの自動化](https://cloud.google.com/cloud-build/docs/running-builds/automate-builds)に従って、コンソールからビルドトリガーを設定します。リポジトリやブランチなどのビルド対象・条件を指定し、Cloud Build構成ファイルの場所に、cloudbuild.yamlを指定するだけです。後は、指定したトリガーを検知して、自動でビルドされます。

ビルドトリガーを設定後に、Cloud Functionsによる[Slack 通知](https://cloud.google.com/cloud-build/docs/configure-third-party-notifications#slack_notifications)をすると便利です。
