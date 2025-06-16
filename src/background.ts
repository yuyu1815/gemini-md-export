/**
 * バックグラウンドスクリプト
 * 
 * このスクリプトはChrome拡張機能のバックグラウンドで実行され、
 * 拡張機能のコア機能を提供します。
 */

import * as logger from './shared/utils/logger';
import { Message, MessageAction, PageInfo, Response } from './shared/types';

// ロガーの設定
logger.configureLogger({
  isDebugMode: true
});

// 拡張機能がインストールされたときのイベントリスナー
chrome.runtime.onInstalled.addListener(() => {
  logger.info('拡張機能がインストールされました');
});

// アクティブなタブが変更されたときのイベントリスナー
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    // 現在のタブの情報を取得
    const tab = await chrome.tabs.get(activeInfo.tabId);

    if (tab.url) {
      logger.info(`アクティブなタブが変更されました`, { url: tab.url, title: tab.title });
    }
  } catch (error) {
    logger.error('タブ情報の取得中にエラーが発生しました', error);
  }
});

/**
 * メッセージを処理する
 * 
 * @param message - 受信したメッセージ
 * @param sender - メッセージの送信元
 * @returns レスポンス
 */
function handleMessage(message: Message, sender: chrome.runtime.MessageSender): Response {
  logger.debug('メッセージを受信しました', { message, sender });

  switch (message.action) {
    case MessageAction.PAGE_INFO:
      return handlePageInfo(message.data as PageInfo);

    case MessageAction.UPDATE_SETTINGS:
      return handleUpdateSettings(message.data);

    case MessageAction.REPORT_ERROR:
      return handleReportError(message.data);

    default:
      logger.warn('不明なメッセージアクションを受信しました', { action: message.action });
      return { 
        status: 'error', 
        message: '不明なアクションです' 
      };
  }
}

/**
 * ページ情報を処理する
 * 
 * @param pageInfo - ページ情報
 * @returns レスポンス
 */
function handlePageInfo(pageInfo: PageInfo): Response {
  logger.info('ページ情報を受信しました', pageInfo);

  // ここでページ情報の処理を行う
  // 例: データの保存、分析など

  return {
    status: 'success',
    message: 'ページ情報を正常に処理しました',
    data: { received: true }
  };
}

/**
 * 設定更新を処理する
 * 
 * @param settings - 更新する設定
 * @returns レスポンス
 */
function handleUpdateSettings(settings: any): Response {
  logger.info('設定更新リクエストを受信しました', settings);

  // ここで設定の更新処理を行う

  return {
    status: 'success',
    message: '設定を更新しました'
  };
}

/**
 * エラー報告を処理する
 * 
 * @param errorData - エラーデータ
 * @returns レスポンス
 */
function handleReportError(errorData: any): Response {
  logger.error('エラー報告を受信しました', errorData);

  // ここでエラーの処理を行う
  // 例: エラーログの保存、通知の送信など

  return {
    status: 'success',
    message: 'エラーを記録しました'
  };
}

// メッセージリスナーの設定
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // メッセージを処理して応答を返す
  const response = handleMessage(message as Message, sender);
  sendResponse(response);

  // 非同期レスポンスを使用する場合はtrueを返す
  return true;
});
