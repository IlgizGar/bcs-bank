const gulp = require('gulp');
const stylus = require('gulp-stylus');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const mincss = require('gulp-clean-css');

const isProduction = process.env.NODE_ENV === 'production';

gulp.task('styles', () => {
  const inlineOpts = {
    path: 'app'
  };

  const plugins = [
    require('autoprefixer'),
    require('postcss-inline-svg')(inlineOpts)
  ];

  return gulp
    .src('app/styles/*.styl')
    .pipe(stylus({
      'include css': true,
    }))
    .pipe(postcss(plugins))
    .pipe(mincss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/assets/styles'));
});
