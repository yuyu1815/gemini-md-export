/**
 * コンテンツスクリプト
 * 
 * このスクリプトはウェブページに挿入され、
 * ページのコンテンツと対話することができます。
 */

import * as logger from './shared/utils/logger';
import { Message, MessageAction, PageInfo, Response } from './shared/types';

// ロガーの設定
logger.configureLogger({
  isDebugMode: true
});

/**
 * 初期化関数
 * 
 * コンテンツスクリプトの初期化処理を行います。
 */
function initialize(): void {
  logger.info('コンテンツスクリプトが初期化されました');

  // ページ情報をバックグラウンドスクリプトに送信
  sendPageInfoToBackground();

  // ページ内の変更を監視
  setupMutationObserver();

  // クリーンアップハンドラを設定
  setupCleanupHandler();

  // ダウンロードボタンを設定
  setupDownloadButtons();
}

/**
 * ページ情報をバックグラウンドスクリプトに送信する
 * 
 * 現在のページのURLとタイトルを取得し、
 * バックグラウンドスクリプトに送信します。
 */
function sendPageInfoToBackground(): void {
  const pageInfo: PageInfo = {
    url: window.location.href,
    title: document.title,
    timestamp: new Date().toISOString()
  };

  logger.debug('ページ情報を送信します', pageInfo);

  // バックグラウンドスクリプトにメッセージを送信
  const message: Message<PageInfo> = {
    action: MessageAction.PAGE_INFO,
    data: pageInfo
  };

  chrome.runtime.sendMessage(
    message,
    (response: Response) => {
      if (response) {
        logger.info('バックグラウンドからの応答を受信しました', response);
      } else {
        logger.warn('バックグラウンドからの応答がありませんでした');
      }
    }
  );
}

/**
 * MutationObserverを設定する
 * 
 * ページ内の変更を監視するためのMutationObserverを設定します。
 */
function setupMutationObserver(): void {
  // ページ内の変更を監視する設定
  const observerConfig: MutationObserverInit = {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  };

  // 変更を処理するコールバック
  const mutationCallback = (mutations: MutationRecord[]): void => {
    if (logger.isDebugMode()) {
      logger.debug('ページの内容が変更されました', { 
        changesCount: mutations.length,
        timestamp: new Date().toISOString()
      });
    }
  };

  // オブザーバーの作成と開始
  const observer = new MutationObserver(mutationCallback);

  // document.bodyが存在する場合は監視を開始
  if (document.body) {
    observer.observe(document.body, observerConfig);
    logger.debug('MutationObserverが開始されました');
  } else {
    // bodyが読み込まれるのを待つ
    logger.warn('document.bodyが見つかりません。DOMContentLoadedを待ちます');

    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, observerConfig);
      logger.debug('DOMContentLoaded後にMutationObserverが開始されました');
    });
  }

  // グローバルに保存して、クリーンアップ時にアクセスできるようにする
  (window as any).__chromeExtObserver = observer;
}

/**
 * クリーンアップハンドラを設定する
 * 
 * ページが閉じられる前にリソースをクリーンアップするためのハンドラを設定します。
 */
function setupCleanupHandler(): void {
  window.addEventListener('beforeunload', () => {
    // 監視を停止
    const observer = (window as any).__chromeExtObserver as MutationObserver;
    if (observer) {
      observer.disconnect();
      logger.info('MutationObserverが停止されました');
    }

    logger.info('コンテンツスクリプトがクリーンアップされました');
  });
}

/**
 * ダウンロードボタンを設定する
 * 
 * マークダウンコンテンツをダウンロードするためのボタンを追加します。
 */
function setupDownloadButtons(): void {
  // MutationObserverを使用して、ターゲット要素が追加されるのを監視
  const targetObserverConfig: MutationObserverInit = {
    childList: true,
    subtree: true,
    attributes: false
  };

  const targetObserver = new MutationObserver((mutations) => {
    // ターゲットとなるアクションボタンコンテナを探す
    const actionButtonsContainer = document.querySelector('div.action-buttons');
    if (actionButtonsContainer) {
      // 既にボタンが追加されていないか確認
      if (!document.querySelector('[data-test-id="md-download-button"]')) {
        logger.info('アクションボタンコンテナを発見しました。ダウンロードボタンを追加します。');

        // ボタンを追加
        addDownloadButtons(actionButtonsContainer);

        // 目的を達成したので監視を停止
        targetObserver.disconnect();
      }
    }
  });

  // bodyが存在する場合は監視を開始
  if (document.body) {
    targetObserver.observe(document.body, targetObserverConfig);
    logger.debug('ダウンロードボタン用のMutationObserverが開始されました');

    // 既に存在する場合はすぐに追加
    const actionButtonsContainer = document.querySelector('div.action-buttons');
    if (actionButtonsContainer && !document.querySelector('[data-test-id="md-download-button"]')) {
      addDownloadButtons(actionButtonsContainer);
      targetObserver.disconnect();
    }
  } else {
    // bodyが読み込まれるのを待つ
    document.addEventListener('DOMContentLoaded', () => {
      targetObserver.observe(document.body, targetObserverConfig);
      logger.debug('DOMContentLoaded後にダウンロードボタン用のMutationObserverが開始されました');
    });
  }
}

/**
 * ダウンロードボタンを追加する
 * 
 * @param container - ボタンを追加するコンテナ要素
 */
function addDownloadButtons(container: Element): void {
  // MDダウンロードボタンを作成
  const mdButton = document.createElement('button');
  mdButton.setAttribute('mat-flat-button', '');
  mdButton.setAttribute('data-test-id', 'md-download-button');
  mdButton.className = 'mdc-button mat-mdc-button-base mdc-button--unelevated mat-mdc-unelevated-button mat-unthemed';
  mdButton.style.marginRight = '8px';
  mdButton.innerHTML = 'MDでダウンロード';

  // TXTダウンロードボタンを作成
  const txtButton = document.createElement('button');
  txtButton.setAttribute('mat-flat-button', '');
  txtButton.setAttribute('data-test-id', 'txt-download-button');
  txtButton.className = 'mdc-button mat-mdc-button-base mdc-button--unelevated mat-mdc-unelevated-button mat-unthemed';
  txtButton.style.marginRight = '8px';
  txtButton.innerHTML = 'TXTでダウンロード';

  // イベントリスナーを追加
  mdButton.addEventListener('click', () => downloadContent('md'));
  txtButton.addEventListener('click', () => downloadContent('txt'));

  // コンテナの最初の子要素の前に挿入
  container.insertBefore(txtButton, container.firstChild);
  container.insertBefore(mdButton, container.firstChild);

  logger.info('ダウンロードボタンが追加されました');
}

/**
 * HTMLからマークダウンコンテンツを抽出する
 * 
 * @param element - マークダウンコンテンツを含むHTML要素
 * @returns 抽出されたマークダウンテキスト
 */
function extractMarkdownContent(element: Element): string {
  // クローンを作成して操作
  const clone = element.cloneNode(true) as HTMLElement;

  // コードブロックを処理
  const codeBlocks = clone.querySelectorAll('pre');
  codeBlocks.forEach(pre => {
    // コードブロックの内容を取得
    const code = pre.textContent || '';
    // マークダウン形式のコードブロックに変換
    pre.outerHTML = '```\n' + code + '\n```\n';
  });

  // インラインコードを処理
  const inlineCodes = clone.querySelectorAll('code:not(pre code)');
  inlineCodes.forEach(code => {
    const content = code.textContent || '';
    code.outerHTML = '`' + content + '`';
  });

  // 見出しを処理
  for (let i = 1; i <= 6; i++) {
    const headings = clone.querySelectorAll(`h${i}`);
    const hashes = '#'.repeat(i);
    headings.forEach(heading => {
      const content = heading.textContent || '';
      heading.outerHTML = `${hashes} ${content}\n\n`;
    });
  }

  // リンクを処理
  const links = clone.querySelectorAll('a');
  links.forEach(link => {
    const text = link.textContent || '';
    const href = link.getAttribute('href') || '';
    link.outerHTML = `[${text}](${href})`;
  });

  // 画像を処理
  const images = clone.querySelectorAll('img');
  images.forEach(img => {
    const alt = img.getAttribute('alt') || '';
    const src = img.getAttribute('src') || '';
    img.outerHTML = `![${alt}](${src})`;
  });

  // リストを処理
  const listItems = clone.querySelectorAll('li');
  listItems.forEach(li => {
    const content = li.textContent || '';
    const parent = li.parentElement;
    if (parent && parent.tagName === 'OL') {
      // 番号付きリスト
      li.outerHTML = `1. ${content}\n`;
    } else {
      // 箇条書きリスト
      li.outerHTML = `* ${content}\n`;
    }
  });

  // 強調を処理
  const strongs = clone.querySelectorAll('strong, b');
  strongs.forEach(strong => {
    const content = strong.textContent || '';
    strong.outerHTML = `**${content}**`;
  });

  // イタリックを処理
  const italics = clone.querySelectorAll('em, i');
  italics.forEach(italic => {
    const content = italic.textContent || '';
    italic.outerHTML = `*${content}*`;
  });

  // 引用を処理
  const blockquotes = clone.querySelectorAll('blockquote');
  blockquotes.forEach(quote => {
    const content = quote.textContent || '';
    // 各行の先頭に > を追加
    const lines = content.split('\n').map(line => `> ${line}`).join('\n');
    quote.outerHTML = `${lines}\n\n`;
  });

  // 水平線を処理
  const hrs = clone.querySelectorAll('hr');
  hrs.forEach(hr => {
    hr.outerHTML = '\n---\n\n';
  });

  // 段落を処理
  const paragraphs = clone.querySelectorAll('p');
  paragraphs.forEach(p => {
    const content = p.textContent || '';
    p.outerHTML = `${content}\n\n`;
  });

  // テキストコンテンツを取得し、余分な空白行を削除
  let markdown = clone.textContent || '';
  markdown = markdown.replace(/\n{3,}/g, '\n\n');

  return markdown;
}

/**
 * HTMLからプレーンテキストコンテンツを抽出する（改行を維持）
 * 
 * @param element - コンテンツを含むHTML要素
 * @returns 抽出されたプレーンテキスト（適切な改行付き）
 */
function extractPlainTextContent(element: Element): string {
  // クローンを作成して操作
  const clone = element.cloneNode(true) as HTMLElement;

  // コードブロックを処理
  const codeBlocks = clone.querySelectorAll('pre');
  codeBlocks.forEach(pre => {
    // コードブロックの内容を取得
    const code = pre.textContent || '';
    // 改行を維持
    pre.outerHTML = code + '\n\n';
  });

  // 見出しを処理
  for (let i = 1; i <= 6; i++) {
    const headings = clone.querySelectorAll(`h${i}`);
    headings.forEach(heading => {
      const content = heading.textContent || '';
      heading.outerHTML = `${content}\n\n`;
    });
  }

  // リンクを処理（テキストのみ保持）
  const links = clone.querySelectorAll('a');
  links.forEach(link => {
    const text = link.textContent || '';
    link.outerHTML = text;
  });

  // 画像を処理（代替テキストのみ保持）
  const images = clone.querySelectorAll('img');
  images.forEach(img => {
    const alt = img.getAttribute('alt') || '';
    img.outerHTML = alt;
  });

  // リストを処理
  const listItems = clone.querySelectorAll('li');
  listItems.forEach(li => {
    const content = li.textContent || '';
    const parent = li.parentElement;
    if (parent && parent.tagName === 'OL') {
      // 番号付きリスト
      li.outerHTML = `- ${content}\n`;
    } else {
      // 箇条書きリスト
      li.outerHTML = `- ${content}\n`;
    }
  });

  // 強調とイタリックを処理（テキストのみ保持）
  const emphasisElements = clone.querySelectorAll('strong, b, em, i');
  emphasisElements.forEach(elem => {
    const content = elem.textContent || '';
    elem.outerHTML = content;
  });

  // 引用を処理
  const blockquotes = clone.querySelectorAll('blockquote');
  blockquotes.forEach(quote => {
    const content = quote.textContent || '';
    quote.outerHTML = `${content}\n\n`;
  });

  // 水平線を処理
  const hrs = clone.querySelectorAll('hr');
  hrs.forEach(hr => {
    hr.outerHTML = '\n----------\n\n';
  });

  // 段落を処理
  const paragraphs = clone.querySelectorAll('p');
  paragraphs.forEach(p => {
    const content = p.textContent || '';
    p.outerHTML = `${content}\n\n`;
  });

  // divを処理（改行を追加）
  const divs = clone.querySelectorAll('div');
  divs.forEach(div => {
    // 子要素がない場合のみ処理（子要素がある場合は、その子要素の処理に任せる）
    if (div.children.length === 0) {
      const content = div.textContent || '';
      if (content.trim()) {
        div.outerHTML = `${content}\n\n`;
      }
    }
  });

  // テキストコンテンツを取得し、余分な空白行を削除
  let plainText = clone.textContent || '';
  plainText = plainText.replace(/\n{3,}/g, '\n\n');

  return plainText;
}

/**
 * コンテンツをダウンロードする
 * 
 * @param format - ダウンロード形式 ('md' または 'txt')
 */
function downloadContent(format: 'md' | 'txt'): void {
  // 指定されたコンテナを探す
  const container = document.querySelector('div[cdkscrollable][data-test-id="scroll-container"].container');

  if (!container) {
    logger.error('指定されたコンテナが見つかりませんでした');
    alert('コンテンツコンテナが見つかりませんでした。');
    return;
  }

  // コンテナ内のマークダウンコンテンツを含む要素を探す
  const markdownElements = container.querySelectorAll('div.markdown.markdown-main-panel.stronger.enable-updated-hr-color');
  const markdownElement = markdownElements[0]; // コンテナ内の最初の要素を取得

  if (!markdownElement) {
    logger.error('マークダウン要素が見つかりませんでした');
    alert('マークダウンコンテンツが見つかりませんでした。');
    return;
  }

  // コンテンツを取得
  const htmlContent = markdownElement.innerHTML;
  const plainText = markdownElement.textContent || '';

  // ファイル名を生成（現在のページタイトルを使用）
  const pageTitle = document.title.replace(/[\\/:*?"<>|]/g, '_') || 'download';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
  const filename = `${pageTitle}_${timestamp}.${format}`;

  // ダウンロードするコンテンツを決定
  // MDの場合はマークダウン形式として保存
  // TXTの場合もプレーンテキストとして保存するが、適切な改行処理を行う
  let downloadContent;

  if (format === 'md') {
    downloadContent = extractMarkdownContent(markdownElement);
  } else {
    // TXT形式の場合は、マークダウン装飾なしで適切な改行を維持する
    downloadContent = extractPlainTextContent(markdownElement);
  }

  // Blobを作成してダウンロード
  const blob = new Blob([downloadContent], { type: `text/${format === 'md' ? 'markdown' : 'plain'}` });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';

  document.body.appendChild(a);
  a.click();

  // クリーンアップ
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);

  logger.info(`コンテンツが${format.toUpperCase()}形式でダウンロードされました`, { filename });
}

// スクリプトの初期化
initialize();
