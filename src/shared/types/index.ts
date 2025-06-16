/**
 * 共有型定義
 * 
 * アプリケーション全体で使用される型定義を提供します。
 * これらの型を使用することで、一貫性のあるデータ構造を維持できます。
 */

/**
 * ページ情報インターフェース
 * 
 * ウェブページの基本情報を表します。
 */
export interface PageInfo {
  /** ページのURL */
  url: string;
  
  /** ページのタイトル */
  title: string;
  
  /** 情報が収集された時刻 */
  timestamp: string;
}

/**
 * メッセージインターフェース
 * 
 * 拡張機能内部で送受信されるメッセージの基本構造を定義します。
 */
export interface Message<T = any> {
  /** メッセージのアクション種別 */
  action: MessageAction;
  
  /** メッセージに関連するデータ */
  data?: T;
}

/**
 * メッセージアクション種別
 * 
 * 拡張機能内部で使用されるメッセージのアクション種別を定義します。
 */
export enum MessageAction {
  /** ページ情報の送信 */
  PAGE_INFO = 'pageInfo',
  
  /** 設定の更新 */
  UPDATE_SETTINGS = 'updateSettings',
  
  /** エラーの報告 */
  REPORT_ERROR = 'reportError'
}

/**
 * レスポンスインターフェース
 * 
 * メッセージに対するレスポンスの基本構造を定義します。
 */
export interface Response {
  /** 処理の成功/失敗を示す状態 */
  status: 'success' | 'error';
  
  /** レスポンスメッセージ */
  message: string;
  
  /** 追加データ（オプション） */
  data?: any;
}

/**
 * 拡張機能設定インターフェース
 * 
 * 拡張機能の設定項目を定義します。
 */
export interface ExtensionSettings {
  /** ログレベル */
  logLevel: number;
  
  /** デバッグモードの有効/無効 */
  debugMode: boolean;
}