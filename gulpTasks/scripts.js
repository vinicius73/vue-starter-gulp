import gulp from 'gulp';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import sourcemaps from 'gulp-sourcemaps';
import gutil from 'gulp-util';
import uglify from 'gulp-uglify';
import gulpif from 'gulp-if';
import concat from 'gulp-concat';
import rload from 'livereactload';
import watchify from 'watchify';
import nodemon from 'gulp-nodemon';

const createBundler = (config, useWatchify) => {
  const entries = config.src().js.main;
  const debug = !config.isProduction();
  const plugins = [];
  if (!config.isProduction() || useWatchify) {
    plugins.push(rload);
  }

  return browserify({ entries, debug })
          .transform('vueify')
          .transform('babelify', { presets: ['es2015'] })
          .plugin(plugins);
};

export default (config) => {
  // MAIN
  gulp.task('scripts:main', () => {
    const isProduction = config.isProduction();
    const dest = config.dest().js;

    return createBundler(config, false)
          .bundle()
          .on('error', gutil.log)
          .pipe(source('main.js'))
          .pipe(buffer())
          .pipe(gulpif(isProduction, uglify()))
          .pipe(gulpif(!isProduction, sourcemaps.write()))
          .pipe(gulp.dest(dest));
  });

  gulp.task('scripts:watch', () => {
    const dest = config.dest().js;
    // start JS file watching and rebundling with watchify
    const bundler = createBundler(config, true);
    const watcher = watchify(bundler);
    const rebundle = () => {
      gutil.log('Update JavaScript bundle');
      watcher
        .bundle()
        .on('error', gutil.log)
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(gulp.dest(dest));
    };

    rebundle();

    return watcher
      .on('error', gutil.log)
      .on('update', rebundle);
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

  gulp.task('watch:server', ['scripts:watch'], function() {
    nodemon({ script: 'dev-server.js', ext: 'js', ignore: ['gulpfile.js'] })
      .on('change', function () {})
      .on('restart', function () {
        console.log('Server restarted')
      })
  });

  gulp.task('scripts', ['scripts:main', 'scripts:vendor']);
};
