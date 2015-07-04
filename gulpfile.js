var gulp       = require('gulp');
var autoPrefix = require('gulp-autoprefixer');
var concat     = require('gulp-concat');
var jshint     = require('gulp-jshint');
var livereload = require('gulp-livereload');
var minifyCss  = require('gulp-minify-css');
var sass       = require('gulp-ruby-sass');
var uglify     = require('gulp-uglify');
var rename     = require('gulp-rename');
var shell      = require('gulp-shell');
var notify     = require('gulp-notify');


gulp.task('css', function () {
    return sass('src/css/angular-component-kit.scss', {style: 'expanded'})
    .pipe(autoPrefix('last 2 version'))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifyCss())
    .pipe(gulp.dest('build'))
    .pipe(notify({message: 'Css tasks complete'}));
});

gulp.task('script', function () {
    return gulp.src('src/app/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('angular-component-kit.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('build'))
    .pipe(notify({message: 'Script tasks complete'}));
});

gulp.task('watch', function () {
    gulp.watch('src/css/**/*.scss', ['css']);
    gulp.watch('src/app/**/*.js', ['script']);
    livereload.listen();

    gulp.watch(['dist/**/*', 'index.html']).on('change', livereload.changed);
});

gulp.task('init', shell.task('node_modules/bower/bin/bower install'));

gulp.task('serve', shell.task('node_modules/http-server/bin/http-server'));

gulp.task('default', function () {
    gulp.start('serve', 'css', 'script', 'watch');
});