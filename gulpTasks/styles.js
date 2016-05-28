import gulp from 'gulp';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import csso from 'gulp-csso';
import gulpif from 'gulp-if';

export default (config) => {
  // SCSS
  gulp.task('styles:scss', () => {
    const isProduction = config.isProduction();
    const dest = config.dest().css;
    const src = config.src().css.scssMain;

    return gulp.src(src)
      .pipe(sourcemaps.init())
      .pipe(gulpif(!isProduction, sourcemaps.init()))
      .pipe(sass().on('error', sass.logError))
      .pipe(gulpif(isProduction, csso()))
      .pipe(gulpif(!isProduction, sourcemaps.write()))
      .pipe(gulp.dest(dest));
  });
};
