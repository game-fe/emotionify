var gulp = require('gulp'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    babelify = require('babelify'),
    browserify = require('browserify');

var bundler = browserify('./src/index.js', {
    standalone: 'emotionfyFactory'
});

gulp.task('clean',function(){
    return gulp.src("./dist/");
});

gulp.task('watch',function(){
    gulp.watch('./src/*.js',['clean','build']);
});

gulp.task('build', ['clean'], function(){
    return bundler.transform("babelify", {
        presets: ['es2015']
    })
    .bundle()
    .on('error', function(err){
        console.log(err);
    })
    .pipe(source('emotionfyFactory.js'))
    .pipe(gulp.dest('./dist'))
});

gulp.task('default',['build','watch']);
