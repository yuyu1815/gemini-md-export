/**
 * 画像タスク
 * 
 * 画像ファイルを処理し、出力ディレクトリにコピーします。
 */

import gulp, { task } from 'gulp';
import gulpif from 'gulp-if';
import livereload from 'gulp-livereload';
import args from './lib/args';

task('images', () => {
  return gulp.src('src/icons/**/*')
    .pipe(gulp.dest(`dist/${args.vendor}/icons`))
    .pipe(gulpif(args.watch, livereload()));
});