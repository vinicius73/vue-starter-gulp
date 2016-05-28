import gulp from 'gulp';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import sourcemaps from 'gulp-sourcemaps';
import gutil from 'gulp-util';
import uglify from 'gulp-uglify';
import gulpif from 'gulp-if';
import concat from 'gulp-concat';

const makeMainBundle = (config) => {
  const entries = config.src().js.main;
  const debug = !config.isProduction();

  return browserify({ entries, debug })
          .bundle()
          .pipe(source('main.js'))
          .pipe(buffer());
};

export default (config) => {
  // MAIN
  gulp.task('scripts:main', () => {
    const isProduction = config.isProduction();
    const dest = config.dest().js;

    return makeMainBundle(config)
          .pipe(gulpif(isProduction, uglify())).on('error', gutil.log)
          .pipe(gulpif(!isProduction, sourcemaps.write()))
          .pipe(gulp.dest(dest));
  });

  // VENDOR
  gulp.task('scripts:vendor', () => {
    const src = config.src().js.vendor;
    const dest = config.dest().js;
    const isProduction = config.isProduction();

    return gulp.src(src)
      .pipe(gulpif(isProduction, uglify())).on('error', gutil.log)
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest(dest));
  });
};
