/**
 * ビルドタスク
 * 
 * 拡張機能をビルドするためのメインタスクです。
 * 他のタスクを適切な順序で実行します。
 */

import { task, series, parallel } from 'gulp';
import args from './lib/args';

task('build', series('clean', parallel('manifest', 'scripts', 'images')));
