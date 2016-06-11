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

  gulp.task('copy:html', () => {
    const dest = config.dest().path;
    const src = config.src().html;

    return gulp.src(src)
      .pipe(gulp.dest(dest));
  });

  gulp.task('copy', ['copy:fonts', 'copy:html']);
};
