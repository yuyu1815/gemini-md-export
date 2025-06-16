/**
 * ライブリロードタスク
 * 
 * ブラウザの自動リロードを設定します。
 * 開発時にファイルの変更を即座に反映するために使用します。
 */

import { task } from 'gulp';
import livereload from 'gulp-livereload';
import args from './lib/args';

// ライブリロードサーバーを設定
task('livereload', (cb) => {
  // ウォッチモードが有効な場合のみ実行
  if (args.watch) {
    livereload.listen({
      reloadPage: 'Extension',
      quiet: !args.verbose
    });
  }
  
  cb();
});