import gulp from 'gulp';

import GulpConfig from './gulp.config.js';

const Config = new GulpConfig();

Config.loadTasks();

gulp.task('default', ['scripts', 'copy', 'styles']);
