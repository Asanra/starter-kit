/*
* Dependencias
*/
var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  del = require('del'),
  ttf2woff = require('gulp-ttf2woff'),
  cleanCSS = require('gulp-clean-css'),
  autoprefixer = require('gulp-autoprefixer'),
  useref = require('gulp-useref'),
  htmlmin = require('gulp-htmlmin'),
  cache = require('gulp-cache'),
  runSequence = require('run-sequence'),
  imagemin = require('gulp-imagemin'),
  svgmin = require('gulp-svgmin'),
  cachebust = require('gulp-cache-bust');
  files = {
    statics : [
      'src/humans.txt',
      'src/robots.txt'
    ],
    dynamics : [
      'src/*.html',
      'src/css/*.css',
      'src/img/',
      'src/js/*.js'
    ]
  };

/*
* Tareas de ayuda
*/
gulp.task('clean:dist', function() {
  return del('dist/');
});

gulp.task('clean:cache', function(callback) {
  return cache.clearAll(callback); 
});

/*
* Tareas de desarrollo
*/
gulp.task('autoprefixer', function() {
  gulp.src('src/css/*.css')
    .pipe(autoprefixer({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('src/css/'));
});

/*
* Tareas de publicacion
*/
gulp.task('js', function () {
  return gulp.src('src/js/*.js')
    .pipe(concat('todo.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('js-vendor', function () {
  return gulp.src('src/js/vendor/*.js')
    .pipe(gulp.dest('dist/js/vendor/'));
});

gulp.task('css', () => {
    gulp.src('src/css/*.css')
    .pipe(concat('styles.min.css'))
    .pipe(autoprefixer({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('html', function() {
return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('php', function () {
  return gulp.src('src/*.php')
    .pipe(useref())
    .pipe(gulp.dest('dist/'));
});

gulp.task('statics', function() {
  return gulp.src(files.statics)
    .pipe(gulp.dest('dist/'));
});

gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*.ttf')
    .pipe(ttf2woff())
    .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('images', function() {
  return gulp.src('src/img/**/*.+(png|jpeg|jpg|gif)')
    .pipe(cache(imagemin([
      imagemin.mozjpeg({quality: 70, progressive: true})
    ], {
    verbose: true
    })))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('svg', function() {
  return gulp.src('src/img/**/*.svg')
    .pipe(svgmin())
    .pipe(gulp.dest('dist/img'));
});

gulp.task('hash', function() {
  return gulp.src('dist/*.php')
    .pipe(cachebust({
      type: 'timestamp'
    }))
    .pipe(gulp.dest('dist'));
});

/*
* Tareas de reload
*/
gulp.task('browser-sync', function () {
  browserSync.init(files.dynamics, {
    server: {
      baseDir: './src'
    }
  });
});

/*
gulp.task('watch', ['autoprefixer'], function() {
  gulp.watch('src/css/*.css', ['autoprefixer']);
});
*/

/*
* Tarea por defecto
*/
/*
gulp.task('default', function(callback) {
  runSequence('browser-sync', 'watch', callback)
});
*/


/*
* Tarea de build
*/
gulp.task('build', function(callback) {
  runSequence('clean:dist',
    ['php', 'js', 'css', 'html', 'statics', 'fonts', 'images'],
    callback
  )
});