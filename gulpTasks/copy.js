import gulp from 'gulp';
import flatten from 'gulp-flatten';

export default (config) => {
  // FONTS
  gulp.task('copy:fonts', ['clean:fonts'], () => {
    const dest = config.dest().fonts;
    const src = config.src().fonts;

    return gulp.src(src)
      .pipe(flatten())
      .pipe(gulp.dest(dest));
  });

  gulp.task('copy', ['copy:fonts']);
};
