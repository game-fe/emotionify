var gulp = require('gulp'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
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

gulp.task('build',function(){
        return bundler.bundle()
        .on('error', function(err){
            console.log(err);
        })
        .pipe(source('emotionfyFactory.js'))
        .pipe(gulp.dest('./dist'))
});

gulp.task('default',['build','watch']);
