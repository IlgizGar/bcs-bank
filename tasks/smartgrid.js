const gulp = require('gulp');
const smartgrid = require('smart-grid');
const gridConfig = require('../grid');

gulp.task('grid', () => {
    return smartgrid('app/styles/mixins', gridConfig);
});