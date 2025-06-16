# Gemini MD Export

GeminiのマークダウンコンテンツをダウンロードするためのChrome拡張機能です。

## 機能

- Geminiのマークダウンコンテンツを検出
- MDフォーマットでダウンロード
- TXTフォーマットでダウンロード

## 開発環境のセットアップ

### 前提条件

- Node.js (v14以上)
- npm (v6以上)

### インストール

```bash
# 依存関係をインストール
npm install
```

## 開発

開発時は以下のコマンドを実行すると、ファイルの変更を監視して自動的にビルドが行われます。

```bash
# 開発モードで実行（ファイル監視あり）
npm run dev:chrome
```

Chrome拡張機能のページ(chrome://extensions)を開いて、「パッケージ化されていない拡張機能を読み込む...」ボタンを押し、`dist/chrome`ディレクトリを選択してブラウザに拡張機能を適用させてください。

## ビルド

リリース用のビルドを作成するには以下のコマンドを実行します。

```bash
# 本番用ビルド
npm run build:chrome
```

このコマンドを実行すると、`packages`ディレクトリにZIPファイルが生成されます。このZIPファイルはChrome Web Storeにアップロード可能な形式です。

## プロジェクト構造

```
gemini-md-export/
├── src/                  # ソースコード
│   ├── background.ts     # バックグラウンドスクリプト
│   ├── content.ts        # コンテンツスクリプト
│   ├── manifest.json     # 拡張機能マニフェスト
│   └── shared/           # 共有コード
│       ├── types/        # 型定義
│       └── utils/        # ユーティリティ関数
├── dist/                 # ビルド出力（自動生成）
├── packages/             # パッケージング出力（自動生成）
├── tasks/                # Gulpタスク
├── gulpfile.babel.js     # Gulp設定
└── package.json          # プロジェクト設定
```

## ビルドシステム

このプロジェクトは以下の技術を使用しています：

- TypeScript: 型安全なJavaScriptの開発
- Webpack: モジュールバンドル
- Babel: 最新のJavaScript機能のトランスパイル
- Gulp: タスク自動化

## ライセンス

MIT
