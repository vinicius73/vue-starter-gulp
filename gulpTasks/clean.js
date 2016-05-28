import gulp from 'gulp';
import del from 'del';

export default (config) => {
  // FONTS
  gulp.task('clean:fonts', () => {
    const src = config.dest().fonts;

    return del(src);
  });

  // IMAGES
  gulp.task('clean:images', () => {
    const src = config.dest().images;

    return del(src);
  });

  gulp.task('clean', ['clean:fonts', 'clean:images']);
};
