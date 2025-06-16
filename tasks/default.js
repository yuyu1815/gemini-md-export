/**
 * デフォルトタスク
 * 
 * 引数なしでgulpを実行した場合に実行されるデフォルトタスクです。
 */

import { task, series } from 'gulp';
import args from './lib/args';

task('default', series('build'));
