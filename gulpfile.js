const { src, dest, parallel } = require('gulp');
const terser = require('gulp-terser');
const cleanCss = require('gulp-clean-css');

function minifyJs() {
    return src('./dist/**/*.js')
        .pipe(terser())
        .pipe(dest('./dist'));
}

function minifyCss() {
    return src('./dist/**/*.css')
        .pipe(cleanCss())
        .pipe(dest('./dist'));
}

exports.default = parallel(minifyJs, minifyCss);
