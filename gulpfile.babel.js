import { series, parallel } from 'gulp';

// タスクのインポート
import './tasks/clean';
import './tasks/scripts';
import './tasks/manifest';
import './tasks/images';
import './tasks/build';
import './tasks/default';
import './tasks/watch';
import './tasks/pack';

// 必要に応じて追加のタスクをインポート
// import './tasks/livereload';
// import './tasks/styles';
// import './tasks/fonts';
// import './tasks/locales';
// import './tasks/pages';
