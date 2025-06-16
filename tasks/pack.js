/**
 * パッケージングタスク
 * 
 * 拡張機能をZIPファイルにパッケージングします。
 * Chrome Web Storeなどにアップロードするために使用します。
 */

import gulp, { task } from 'gulp';
import zip from 'gulp-zip';
import args from './lib/args';
import path from 'path';
import fs from 'fs';

// package.jsonからバージョン情報を取得
function getPackageInfo() {
  const manifestPath = path.join('dist', args.vendor, 'manifest.json');
  const packagePath = './package.json';
  
  let version = '1.0.0';
  let name = 'chrome-extension';
  
  try {
    // package.jsonからの情報取得
    if (fs.existsSync(packagePath)) {
      const packageInfo = JSON.parse(fs.readFileSync(packagePath));
      name = packageInfo.name || name;
    }
    
    // manifest.jsonからのバージョン取得（優先）
    if (fs.existsSync(manifestPath)) {
      const manifestInfo = JSON.parse(fs.readFileSync(manifestPath));
      version = manifestInfo.version || version;
    }
  } catch (error) {
    console.error('パッケージ情報の取得中にエラーが発生しました:', error);
  }
  
  return { name, version };
}

task('pack', () => {
  const { name, version } = getPackageInfo();
  const distFolder = path.join('dist', args.vendor);
  const zipFilename = `${name}-${version}-${args.vendor}.zip`;
  
  // packagesディレクトリが存在しない場合は作成
  if (!fs.existsSync('packages')) {
    fs.mkdirSync('packages');
  }
  
  return gulp.src(`${distFolder}/**/*`)
    .pipe(zip(zipFilename))
    .pipe(gulp.dest('packages'));
});