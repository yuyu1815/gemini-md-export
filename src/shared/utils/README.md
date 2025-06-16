# ユーティリティ関数

## 概要

このディレクトリには、拡張機能全体で使用される共通のユーティリティ関数が含まれています。

## ロガー (logger.ts)

ロガーユーティリティは、アプリケーション全体で一貫したログ出力を提供します。

### 機能

- 複数のログレベル（DEBUG, INFO, WARN, ERROR）をサポート
- タイムスタンプの自動付与
- デバッグモードの切り替え
- 構造化データのログ出力

### 使用方法

```typescript
import * as logger from './shared/utils/logger';

// ロガーの設定
logger.configureLogger({
  minLevel: LogLevel.DEBUG,  // ログレベルの設定
  isDebugMode: true,         // デバッグモードの有効化
  showTimestamp: true        // タイムスタンプの表示
});

// 各種ログの出力
logger.debug('デバッグ情報', { detail: 'デバッグの詳細' });
logger.info('情報メッセージ');
logger.warn('警告メッセージ', { code: 123 });
logger.error('エラーメッセージ', new Error('エラーの詳細'));

// デバッグモードの確認
if (logger.isDebugMode()) {
  // デバッグモード時のみ実行する処理
}
```

### API

| 関数 | 説明 | パラメータ |
|------|------|------------|
| `configureLogger(config)` | ロガーの設定を更新する | `config`: 設定オブジェクト |
| `debug(message, data?)` | デバッグログを出力する | `message`: メッセージ, `data`: 追加データ |
| `info(message, data?)` | 情報ログを出力する | `message`: メッセージ, `data`: 追加データ |
| `warn(message, data?)` | 警告ログを出力する | `message`: メッセージ, `data`: 追加データ |
| `error(message, error?)` | エラーログを出力する | `message`: メッセージ, `error`: エラーオブジェクト |
| `isDebugMode()` | デバッグモードが有効かどうかを確認する | なし |

## 今後の拡張

以下のユーティリティを追加予定です：

- HTTP通信用のラッパー関数
- ストレージ操作用のユーティリティ
- 日付/時刻操作用のユーティリティ