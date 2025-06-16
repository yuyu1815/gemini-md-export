/**
 * ウォッチタスク
 * 
 * ファイルの変更を監視し、変更があった場合に適切なタスクを実行します。
 */

import { task, watch, series } from 'gulp';
import livereload from 'gulp-livereload';
import args from './lib/args';

task('watch', (cb) => {
  // ウォッチモードが有効な場合のみ実行
  if (!args.watch) {
    return cb();
  }

  // livereloadを開始
  livereload.listen();

  // マニフェストファイルの変更を監視
  watch('src/manifest.json', series('manifest'));

  // TypeScriptファイルの変更を監視
  watch(['src/**/*.ts', 'src/**/*.tsx'], series('scripts'));

  // 他のファイルタイプの監視が必要な場合はここに追加

  cb();
});