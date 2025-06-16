/**
 * コマンドライン引数を処理するユーティリティ
 * 
 * Gulpタスクで使用するコマンドライン引数を定義し、処理します。
 */

import yargs from 'yargs';

const args = yargs
  .option('production', {
    boolean: true,
    default: false,
    describe: '本番モードで実行します（ファイルの最小化など）'
  })
  .option('watch', {
    boolean: true,
    default: false,
    describe: 'ファイルの変更を監視します'
  })
  .option('verbose', {
    boolean: true,
    default: false,
    describe: '詳細なログを出力します'
  })
  .option('sourcemaps', {
    describe: 'ソースマップを生成します',
    default: !process.env.PRODUCTION
  })
  .option('vendor', {
    string: true,
    default: 'chrome',
    describe: 'ブラウザベンダー（chrome, firefox, operaなど）'
  })
  .argv;

export default args;