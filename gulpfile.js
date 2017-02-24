var gulp        = require('gulp');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var sass        = require('gulp-sass');
var cleancss    = require('gulp-clean-css');
var minifyhtml  = require('gulp-minify-html');
var webserver   = require('gulp-webserver');
var open        = require('gulp-open');
var livereload  = require('gulp-livereload');
var clean       = require('gulp-clean');

var publicPath = 'public';
var srcPath = publicPath + '/src';
var srcPaths = {
    js      : srcPath + '/js/**/*.js',
    css     : srcPath + '/css/**/*.scss',
    html    : srcPath + '/html/**/*.html',
    images  : srcPath + '/images/**/*.png'
};

var distPath = publicPath + '/dist';

/**
 * tasks
 */

gulp.task('default', ['webserver', 'compile', 'watch' ]);

gulp.task('clean', function(){
   return gulp.src(distPath, {read: false})
          .pipe(clean());
});

gulp.task('compile', ['combine-js', 'compile-sass', 'compress-html', 'move-images']);

gulp.task('webserver', function(){
     return gulp.src(distPath + '/')
         .pipe(webserver());
});

gulp.task('open', function(){
    var options = {
        uri : 'http://localhost:8000/1.html',
        app : 'firefox'
    };
    gulp.src(distPath + '/')
        .pipe(open(options));
});

gulp.task('watch', function(){
    livereload.listen();
    gulp.watch(srcPaths.js,   ['combine-js']);
    gulp.watch(srcPaths.css,  ['compile-sass']);
    gulp.watch(srcPaths.html, ['compress-html']);
    gulp.watch(srcPaths.images, ['move-images']);
    gulp.watch(distPath + '/**').on('change', livereload.changed);
});

gulp.task('move-images', function(){
    return gulp.src(srcPaths.images)
        .pipe(gulp.dest(distPath + '/images'));
});

gulp.task('combine-js', function(){
    return gulp.src(srcPaths.js)
          .pipe(uglify())
          .pipe(concat('bundle.js'))
          .pipe(gulp.dest(distPath + '/js'));
});

gulp.task('compile-sass', function () {
    return gulp.src(srcPaths.css)
        .pipe(concat('bundle.css'))
        .pipe(sass())
        .pipe(cleancss())
        .pipe(gulp.dest(distPath + '/css'));
});

gulp.task('compress-html', function(){
    return gulp.src(srcPaths.html)
        .pipe(minifyhtml())
        .pipe(gulp.dest(distPath + '/'))
});
