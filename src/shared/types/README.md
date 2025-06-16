# 共有型定義

## 概要

このディレクトリには、拡張機能全体で使用される共通の型定義が含まれています。これらの型を使用することで、一貫性のあるデータ構造を維持し、型安全性を確保できます。

## 型定義

### PageInfo

ウェブページの基本情報を表すインターフェース。

```typescript
interface PageInfo {
  url: string;       // ページのURL
  title: string;     // ページのタイトル
  timestamp: string; // 情報が収集された時刻
}
```

### Message

拡張機能内部で送受信されるメッセージの基本構造を定義するインターフェース。

```typescript
interface Message<T = any> {
  action: MessageAction; // メッセージのアクション種別
  data?: T;              // メッセージに関連するデータ
}
```

### MessageAction

拡張機能内部で使用されるメッセージのアクション種別を定義する列挙型。

```typescript
enum MessageAction {
  PAGE_INFO = 'pageInfo',         // ページ情報の送信
  UPDATE_SETTINGS = 'updateSettings', // 設定の更新
  REPORT_ERROR = 'reportError'    // エラーの報告
}
```

### Response

メッセージに対するレスポンスの基本構造を定義するインターフェース。

```typescript
interface Response {
  status: 'success' | 'error'; // 処理の成功/失敗を示す状態
  message: string;             // レスポンスメッセージ
  data?: any;                  // 追加データ（オプション）
}
```

### ExtensionSettings

拡張機能の設定項目を定義するインターフェース。

```typescript
interface ExtensionSettings {
  logLevel: number;  // ログレベル
  debugMode: boolean; // デバッグモードの有効/無効
}
```

## 使用方法

```typescript
import { Message, MessageAction, PageInfo, Response } from './shared/types';

// PageInfoの使用例
const pageInfo: PageInfo = {
  url: 'https://example.com',
  title: 'サンプルページ',
  timestamp: new Date().toISOString()
};

// Messageの使用例
const message: Message<PageInfo> = {
  action: MessageAction.PAGE_INFO,
  data: pageInfo
};

// メッセージの送信例
chrome.runtime.sendMessage(
  message,
  (response: Response) => {
    if (response.status === 'success') {
      // 成功時の処理
    } else {
      // エラー時の処理
    }
  }
);
```

## 型の拡張

新しい機能を追加する際は、以下の点に注意して型定義を拡張してください：

1. 既存の型との一貫性を保つ
2. 適切なJSDocコメントを日本語で追加する
3. 必要に応じてREADMEを更新する