# Chrome拡張機能

## 概要

このChrome拡張機能は、ウェブページの情報を収集し、バックグラウンドで処理する基本的な機能を提供します。

## 機能

- ウェブページの情報（URL、タイトル）を収集
- ページ内容の変更を監視
- バックグラウンドでのイベント処理

## ファイル構成

- `manifest.json`: 拡張機能の設定ファイル
- `background.ts`: バックグラウンドスクリプト
- `content.ts`: コンテンツスクリプト（ウェブページに挿入される）
- `tsconfig.json`: TypeScriptの設定ファイル

## ビルド方法

1. 必要なパッケージをインストール:
   ```
   npm install
   ```

2. TypeScriptをコンパイル:
   ```
   npm run build
   ```

3. 開発中の監視モード:
   ```
   npm run watch
   ```

## インストール方法

1. Chromeブラウザで `chrome://extensions` を開く
2. 「デベロッパーモード」を有効にする
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. `dist` ディレクトリを選択

## 開発ガイドライン

- コードコメントと関数の説明は日本語で記述
- 変数名、関数名などのコード自体は英語で記述
- 単一責任の原則に従い、各ファイルと関数は一つの明確な責任を持つ
- DRY原則を守り、重複するロジックは共通関数として実装