var gulp = require("gulp");
gulp.task("pranie", function() {
    console.log("robię pranie");
});


/*var jshint = require("gulp-jshint");

gulp.task("checking", function() {
    return gulp.src("js/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("default"))
});*/


var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");

gulp.task("sass", function() {
    return gulp.src("scss/main.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({errLogToConsole: true, outputStyle: 'expanded'}))
        .pipe(sourcemaps.write())
    .pipe(gulp.dest('css'))
});


gulp.task("watch", function() {
    gulp.watch("scss/**/*.scss", ['sass'])
});



