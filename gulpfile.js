const gulp = require('gulp');
const fs = require('fs');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const header = require('gulp-header');
const stripComments = require('gulp-strip-comments');
const pkg = require('./package.json');

gulp.task('build', () => browserify('./src/index.js', { standalone: 'glslSnippet' })
    .bundle()
    .pipe(source('glslSnippet.js'))
    .pipe(buffer())
    .pipe(stripComments())
    .pipe(header(fs.readFileSync('./src/browser-header.txt', 'utf8'), { pkg: pkg }))
    .pipe(gulp.dest('./dist'))
    .on('error', console.error));