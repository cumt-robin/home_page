const { src, watch, dest, task, series, parallel } = require('gulp');
var browserSync = require('browser-sync').create();
const reload = browserSync.reload;

function startDevServer(cb) {
  // 启动服务器
  browserSync.init({
    server: './dev'
  });

  watch('src/**/*', copyFiles)
}

function copyFiles(cb) {
  src(['src/**/*', 'favicon.ico'])
    .pipe(dest('dev/'))
    .pipe(reload({stream: true}));

  cb();
}

exports.default = series(copyFiles, startDevServer);