var gulp        = require('gulp');
var path        = require('path');
var bowerFile   = require('main-bower-files');
var browserSync = require('browser-sync');
var $           = require('gulp-load-plugins')();

gulp.task('deploy',  function () {
    return gulp.src('prod/**/*')
    .pipe($.ghPages({remoteUrl: 'git@github.com:serenader2014/angular-component-kit.git'}));
});

gulp.task('clean', function () {
    return gulp.src('prod')
    .pipe($.clean());
});

gulp.task('prod:assets', ['clean'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
    var assets = $.useref.assets();

    return gulp.src('dist/*.html')
    .pipe(assets)
    .pipe(jsFilter)
    .pipe($.uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.minifyCss())
    .pipe(cssFilter.restore())
    .pipe($.rev())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(gulp.dest('prod'));
});

gulp.task('prod:tmpl', ['clean'], function () {
    return gulp.src('dist/tmpl/*.html')
    .pipe(gulp.dest('prod/tmpl'));
});

gulp.task('prod', ['clean', 'prod:assets', 'prod:tmpl']);

gulp.task('serve', ['compile', 'watch'], function () {
    browserSync.init({ server: {baseDir: 'dist'}, port: 9000});
    gulp.watch('dist/**/*').on('change', browserSync.reload);
});

gulp.task('watch', function () {
    gulp.watch('src/**/*.js', ['compile:lib:js', 'build:js']);
    gulp.watch('src/**/*.scss', ['compile:lib:css', 'build:css']);
    gulp.watch('demo/scripts/**/*.js', ['compile:demo:js']);
    gulp.watch('demo/styles/**/*.scss', ['compile:demo:css']);
    gulp.watch('demo/tmpl/**/*.html', ['compile:demo:tmpl']);
    gulp.watch('demo/*.html', ['compile:html']);
});

gulp.task('compile', ['compile:html', 'compile:js', 'compile:css', 'compile:demo:tmpl']);

gulp.task('compile:html', function () {
    return gulp.src('demo/*.html')
    .pipe($.inject(gulp.src(bowerFile()), {
        name: 'bower',
        transform: function (filepath) {
            filepath = filepath.substring(5);
            var extname = path.extname(filepath);
            var scriptTmpl = '<script type="text/javascript" src="{{src}}"></script>';
            var linkTmpl = '<link rel="stylesheet" href="{{src}}" />';

            if (extname === '.js') {
                return scriptTmpl.replace('{{src}}', filepath);
            } else {
                return linkTmpl.replace('{{src}}', filepath);
            }
        }
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('compile:js', ['compile:lib:js', 'compile:demo:js']);

gulp.task('compile:css', ['compile:lib:css', 'compile:demo:css']);

gulp.task('compile:lib:css', function () {
    return gulp.src('src/angular-component-kit.scss')
    .pipe($.sass({style: 'expanded'}))
    .pipe($.autoprefixer({browsers: ['last 2 versions']}))
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('compile:lib:tmpl', function () {
    return gulp.src('src/**/*.html')
    .pipe($.minifyHtml({empty: true, quotes: true}))
    .pipe($.ngTemplate({
        moduleName: 'ngComponentKitTmpl',
        standalone: true,
        filePath: 'template.js'
    }))
    .pipe(gulp.dest('src'));
});

gulp.task('compile:lib:js', ['compile:lib:tmpl'], function () {
    return gulp.src('src/**/*.js')
    .pipe($.ngAnnotate({single_quotes: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter())
    .pipe($.concat('angular-component-kit.js'))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('compile:demo:js', function () {
    return gulp.src(['demo/scripts/**/*.js', '!**/prism.js'])
    .pipe($.ngAnnotate({single_quotes: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter())
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('compile:demo:css', function () {
    return gulp.src('demo/styles/*')
    .pipe($.sass({style: 'expanded'}))
    .pipe($.autoprefixer({browsers: ['last 2 versions']}))
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('compile:demo:tmpl', function () {
    return gulp.src('demo/tmpl/*.html')
    .pipe(gulp.dest('dist/tmpl'));
});

gulp.task('build', ['build:js', 'build:css']);

gulp.task('build:js', function () {
    return gulp.src('src/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter())
    .pipe($.concat('angular-component-kit.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('build'));
});

gulp.task('build:css', function () {
    return gulp.src('src/angular-component-kit.scss')
    .pipe($.sass({styles: 'compressed'}))
    .pipe($.autoprefixer({browsers: ['last 2 versions']}))
    .pipe($.minifyCss())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('build'));
});

gulp.task('init', $.shell.task('node_modules/bower/bin/bower install'));

gulp.task('default', ['serve']);