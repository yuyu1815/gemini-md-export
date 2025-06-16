/**
 * マニフェストタスク
 * 
 * manifest.jsonファイルを処理し、出力ディレクトリにコピーします。
 */

import gulp, { task } from 'gulp';
import gulpif from 'gulp-if';
import livereload from 'gulp-livereload';
import args from './lib/args';

task('manifest', () => {
  return gulp.src('src/manifest.json')
    .pipe(gulp.dest(`dist/${args.vendor}`))
    .pipe(gulpif(args.watch, livereload()));
});