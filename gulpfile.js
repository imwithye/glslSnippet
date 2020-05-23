const gulp = require('gulp');
const fs = require('fs');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const header = require('gulp-header');
const stripComments = require('gulp-strip-comments');
const jsbeautifier = require('gulp-jsbeautifier');
const uglify = require('gulp-uglify-es').default;
const uglifycss = require('gulp-uglifycss');
const gulpless = require('gulp-less');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssimport = require('postcss-import');
const merge = require('merge-stream');
const pkg = require('./package.json');

gulp.task('build', () => {
    const scriptsTask = browserify('./src/glslSnippet.js', { standalone: 'glslSnippet' })
        .bundle()
        .pipe(source('glslSnippet.js'))
        .pipe(buffer())
        .pipe(stripComments())
        .pipe(header(fs.readFileSync('./src/browser-header.txt', 'utf8'), { pkg: pkg }))
        .pipe(gulp.dest('./dist'))
        .on('error', console.error);

    const plugins = [
        cssimport,
        autoprefixer({ browsers: ['last 2 versions', 'IE >= 11'] }),
    ];
    const stylesTask = gulp.src('src/glslSnippet.less')
        .pipe(gulpless())
        .pipe(postcss(plugins))
        .pipe(header(fs.readFileSync('./src/browser-header.txt', 'utf8'), { pkg: pkg }))
        .pipe(gulp.dest('./dist'))
        .on('error', console.error);
    return merge(scriptsTask, stylesTask);
});

/// Minify the build script, after building it
gulp.task('minify', () => {
    const scriptsTask = gulp.src('dist/glslSnippet.js')
        .pipe(stripComments())
        .pipe(uglify())
        .pipe(rename('glslSnippet.min.js'))
        .pipe(header(fs.readFileSync('./src/browser-header.txt', 'utf8'), { pkg: pkg }))
        .pipe(gulp.dest('./dist'))
        .on('error', console.error);

    const stylesTask = gulp.src('dist/glslSnippet.css')
        .pipe(uglifycss())
        .pipe(rename('glslSnippet.min.css'))
        .pipe(header(fs.readFileSync('./src/browser-header.txt', 'utf8'), { pkg: pkg }))
        .pipe(gulp.dest('./dist'))
        .on('error', console.error);
    return merge(scriptsTask, stylesTask);
});

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

// Rerun the task when a file changes
gulp.task('watch', () => {
    gulp.watch(['src/**/*.js', 'src/**/*.less'], gulp.series('build'));
});

gulp.task('watch', gulp.series('build', 'watch'));
gulp.task('make', gulp.series('build', 'beautify', 'minify'));
