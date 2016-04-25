var gulp = require('gulp'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    browserSync = require('browser-sync').create(),
    browserify = require('browserify');

var bundler = browserify('./src/index.js', {
    standalone: 'emotionify'
});

gulp.task('clean',function(){
    return gulp.src("./dist/");
});

gulp.task('watch',function(){
    gulp.watch('./src/*.js',['clean','build']);
});

gulp.task('serve',function(){

    browserSync.init({
        server:"./example"
    });

    gulp.watch(['./example/*.js','./example/*.html']).on('change', browserSync.reload);
});

bundler.on('update', function(){
    bundle();
});

function bundle(){
    return bundler
    .bundle()
    .on('error', function(err){
        console.log(err);
    })
    .pipe(source('emotionify.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('./example'));
}

gulp.task('build', ['clean'], function(){
    bundle();
});

gulp.task('default',['build','watch','serve']);
