var gulp = require('gulp');
var less = require('gulp-less');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var del = require('del');
var nodemon = require('gulp-nodemon');

// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');

// Compiles SCSS files from /scss into /css
gulp.task('sass', function() {
    return gulp.src('scss/clean-blog.scss')
        .pipe(sass())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS
gulp.task('minify-css', ['sass'], function() {
    return gulp.src('css/clean-blog.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('js/clean-blog.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copyLib', function() {
    gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('lib/bootstrap'))
        .pipe(gulp.dest('public/lib/bootstrap'));

    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('lib/jquery'))
        .pipe(gulp.dest('public/lib/jquery'));

    gulp.src(['node_modules/angular/angular.js', 'node_modules/angular/angular.min.js'])
        .pipe(gulp.dest('lib/angular'))
        .pipe(gulp.dest('public/lib/angular'));

    gulp.src(['node_modules/angular-ui-router/release/angular-ui-router.js', 'node_modules/angular-ui-router/release/angular-ui-router.min.js'])
        .pipe(gulp.dest('lib/angular-ui-router'))
        .pipe(gulp.dest('public/lib/angular-ui-router'));

    gulp.src(['node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js'])
        .pipe(gulp.dest('lib/angular-ui-bootstrap'))
        .pipe(gulp.dest('public/lib/angular-ui-bootstrap'));

    gulp.src(['node_modules/moment/min/moment-with-locales.min.js'])
        .pipe(gulp.dest('lib/moment'))
        .pipe(gulp.dest('public/lib/moment'));

    gulp.src(['node_modules/angular-moment/angular-moment.min.js'])
        .pipe(gulp.dest('lib/angular-moment'))
        .pipe(gulp.dest('public/lib/angular-moment'));

    gulp.src(['node_modules/angular-jwt/dist/angular-jwt.min.js'])
        .pipe(gulp.dest('lib/angular-jwt'))
        .pipe(gulp.dest('public/lib/angular-jwt'));

    gulp.src(['node_modules/tether/dist/js/*.js'])
        .pipe(gulp.dest('lib/tether'))
        .pipe(gulp.dest('public/lib/tether'));

    gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('lib/font-awesome'))
        .pipe(gulp.dest('public/lib/font-awesome'));
});

gulp.task('clean', function() {
    return del(['public', 'css','lib']);
});

// Build
gulp.task('build', ['minify-css', 'minify-js', 'copyLib'], function() {
    return gulp.src(["css/*.css", "js/**", "index.html", "img/**", "views/**", "mail/**"], {base: "./"})
        .pipe(gulp.dest('public'));
});


// Configure the browserSync task
gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        proxy: "http://localhost:3000",
        files: ["public/**/*.*"],
        browser: "google chrome",
        port: 5000
    });
});

//Configure nodemon task
gulp.task('nodemon', function (cb) {

    var started = false;

    return nodemon({
        script: 'app.js'
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true;
        }
    });
});

//Run everything
gulp.task('default', ['clean','nodemon'], function() {
    gulp.start('build');
});


// Dev task with browserSync
gulp.task('dev', ['browserSync', 'sass', 'minify-css', 'minify-js'], function() {
    gulp.watch('scss/*.scss', ['sass']);
    gulp.watch('css/*.css', ['minify-css']);
    gulp.watch('js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('js/**/*.js', browserSync.reload);
});

