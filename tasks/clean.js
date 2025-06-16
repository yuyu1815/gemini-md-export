/**
 * クリーンタスク
 * 
 * ビルド前に出力ディレクトリをクリーンアップします。
 */

import { task } from 'gulp';
import del from 'del';
import args from './lib/args';

task('clean', () => {
  return del([
    'dist/*',
    'packages/*'
  ]);
});