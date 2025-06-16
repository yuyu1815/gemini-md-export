/**
 * ロガーユーティリティ
 * 
 * アプリケーション全体で一貫したログ出力を提供するユーティリティ関数群です。
 * デバッグモードの切り替えやログレベルの制御が可能です。
 */

// ログレベルの定義
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

// ロガー設定
interface LoggerConfig {
  minLevel: LogLevel;
  isDebugMode: boolean;
  showTimestamp: boolean;
}

// デフォルト設定
const DEFAULT_CONFIG: LoggerConfig = {
  minLevel: LogLevel.INFO,
  isDebugMode: false,
  showTimestamp: true
};

// 現在の設定
let currentConfig: LoggerConfig = { ...DEFAULT_CONFIG };

/**
 * ロガーの設定を更新する
 * 
 * @param config - 新しいロガー設定（部分的な設定も可能）
 */
export function configureLogger(config: Partial<LoggerConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

/**
 * タイムスタンプを生成する
 * 
 * @returns フォーマットされたタイムスタンプ文字列
 */
function getTimestamp(): string {
  const now = new Date();
  return now.toISOString();
}

/**
 * ログメッセージをフォーマットする
 * 
 * @param level - ログレベル
 * @param message - ログメッセージ
 * @param data - 追加データ（オプション）
 * @returns フォーマットされたログメッセージ
 */
function formatLogMessage(level: string, message: string, data?: any): string {
  const timestamp = currentConfig.showTimestamp ? `[${getTimestamp()}] ` : '';
  const dataString = data ? ` ${JSON.stringify(data)}` : '';
  
  return `${timestamp}[${level}] ${message}${dataString}`;
}

/**
 * デバッグログを出力する
 * 
 * @param message - ログメッセージ
 * @param data - 追加データ（オプション）
 */
export function debug(message: string, data?: any): void {
  if (currentConfig.minLevel <= LogLevel.DEBUG) {
    console.debug(formatLogMessage('DEBUG', message, data));
  }
}

/**
 * 情報ログを出力する
 * 
 * @param message - ログメッセージ
 * @param data - 追加データ（オプション）
 */
export function info(message: string, data?: any): void {
  if (currentConfig.minLevel <= LogLevel.INFO) {
    console.info(formatLogMessage('INFO', message, data));
  }
}

/**
 * 警告ログを出力する
 * 
 * @param message - ログメッセージ
 * @param data - 追加データ（オプション）
 */
export function warn(message: string, data?: any): void {
  if (currentConfig.minLevel <= LogLevel.WARN) {
    console.warn(formatLogMessage('WARN', message, data));
  }
}

/**
 * エラーログを出力する
 * 
 * @param message - ログメッセージ
 * @param error - エラーオブジェクトまたは追加データ（オプション）
 */
export function error(message: string, error?: any): void {
  if (currentConfig.minLevel <= LogLevel.ERROR) {
    console.error(formatLogMessage('ERROR', message, error));
  }
}

/**
 * デバッグモードが有効かどうかを確認する
 * 
 * @returns デバッグモードが有効な場合はtrue
 */
export function isDebugMode(): boolean {
  return currentConfig.isDebugMode;
}