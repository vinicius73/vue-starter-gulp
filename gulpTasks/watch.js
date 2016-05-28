import gulp from 'gulp';

export default (config) => {
  gulp.task('watch', () => {
    // const onChange = config.helpers.onChangeHandle;
    // const onFinish = () => gulp.start('rev');
    const onChange = () => {};
    const files = config.watch();

    gulp.watch(files.scss, ['styles:scss']).on('change', onChange);
    gulp.watch(files.js, ['scripts:main']).on('change', onChange);
  });

  gulp.task('w', ['watch']);
};
