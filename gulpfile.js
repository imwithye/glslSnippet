const gulp = require('gulp');
const fs = require('fs');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const header = require('gulp-header');
const stripComments = require('gulp-strip-comments');
const jsbeautifier = require('gulp-jsbeautifier');
let uglify = require('gulp-uglify-es').default;
const pkg = require('./package.json');

gulp.task('build', () => browserify('./src/index.js', { standalone: 'glslSnippet' })
    .bundle()
    .pipe(source('glslSnippet.js'))
    .pipe(buffer())
    .pipe(stripComments())
    .pipe(header(fs.readFileSync('./src/browser-header.txt', 'utf8'), { pkg: pkg }))
    .pipe(gulp.dest('./dist'))
    .on('error', console.error));

/// Minify the build script, after building it
gulp.task('minify', () => gulp.src('dist/glslSnippet.js')
    .pipe(stripComments())
    .pipe(uglify())
    .pipe(rename('glslSnippet.min.js'))
    .pipe(header(fs.readFileSync('./src/browser-header.txt', 'utf8'), { pkg: pkg }))
    .pipe(gulp.dest('./dist'))
    .on('error', console.error));

/// Beautify source code
/// Use before merge request
gulp.task('beautify', () => gulp.src(['src/**/*.js'])
    .pipe(jsbeautifier({
        indent_size: 4,
        indent_char: ' ',
        indent_with_tabs: false,
        eol: '\n',
        brace_style: 'preserve-inline',
    }))
    .pipe(gulp.dest('src'))
);

gulp.task('make', gulp.series('build', 'beautify', 'minify'));
