var gulp = require('gulp'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify');

var bundler = browserify('./src/index.js', {
    standalone: 'emotionifyFactory'
});

gulp.task('clean',function(){
    return gulp.src("./dist/");
});

gulp.task('watch',function(){
    gulp.watch('./src/*.js',['clean','build']);
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
    .pipe(source('emotionifyFactory.js'))
    .pipe(gulp.dest('./dist'));
}

gulp.task('build', ['clean'], function(){
    bundle();
});

gulp.task('default',['build','watch']);
