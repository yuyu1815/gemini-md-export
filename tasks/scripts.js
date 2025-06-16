/**
 * スクリプトタスク
 * 
 * TypeScriptファイルをコンパイルし、必要に応じてバンドルします。
 */

import gulp, { task } from 'gulp';
import gulpif from 'gulp-if';
import webpack from 'webpack';
import gulpWebpack from 'webpack-stream';
import plumber from 'gulp-plumber';
import livereload from 'gulp-livereload';
import args from './lib/args';
import path from 'path';
import fs from 'fs';

// ソースディレクトリ
const SRC_DIR = 'src';

// エントリーポイントを取得
function getEntryPoints() {
  const entryPoints = {};

  // background.ts
  if (fs.existsSync(path.join(SRC_DIR, 'background.ts'))) {
    entryPoints.background = `./${SRC_DIR}/background.ts`;
  }

  // content.ts
  if (fs.existsSync(path.join(SRC_DIR, 'content.ts'))) {
    entryPoints.content = `./${SRC_DIR}/content.ts`;
  }

  // 他のエントリーポイントがあれば追加

  return entryPoints;
}

// Webpackの設定
const webpackConfig = {
  mode: args.production ? 'production' : 'development',
  entry: getEntryPoints(),
  output: {
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          },
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                sourceMap: !args.production
              }
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  devtool: args.production ? false : 'inline-source-map'
};

task('scripts', () => {
  return gulp.src('src/*.ts')
    .pipe(plumber({
      errorHandler: error => {
        console.error('Scripts Task Error:', error.message);
        this.emit('end');
      }
    }))
    .pipe(gulpWebpack(webpackConfig, webpack))
    .pipe(gulp.dest(`dist/${args.vendor}`))
    .pipe(gulpif(args.watch, livereload()));
});
