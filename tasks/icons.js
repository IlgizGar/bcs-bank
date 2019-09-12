const gulp = require('gulp');
const gulpIf = require('gulp-if');
const svgmin = require('gulp-svgmin');
const svgSymbols = require('gulp-svg-symbols');
const rename = require('gulp-rename');
const cheerio = require('gulp-cheerio');

gulp.task('icons', () => {
  const svgminOpts = {
    plugins: [{
      removeTitle: true
    }, {
      removeAttrs: {
        attrs: '(fill|fill-rule)'
      }
    }]
  };

  const svgSymbolsOpts = {
    id: 'icon_%f',
    className: '.icon-%f',
    templates: ['default-svg']
  };

  gulp
    .src('app/icons/**/*.svg')
    .pipe(cheerio({
      run: function($, file) {
        if ($('svg').attr('leaveFill') != "true") {
          $('[fill]').removeAttr('fill');
          $('[title]').removeAttr('title');
          $('[fill-rule]').removeAttr('fill-rule');
        }
      },
      parserOptions: {
        xmlMode: true
      }
    }))
    // .pipe(svgmin(svgminOpts))
    .pipe(svgSymbols(svgSymbolsOpts))
    .pipe(gulpIf(/\.svg$/, rename('icons.svg')))
    .pipe(gulpIf(/\.svg$/, gulp.dest('dist/assets/images')));
});
