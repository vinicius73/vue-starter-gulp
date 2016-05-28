import path from 'path';
import requireAll from 'require-all';
import { isArray, forEach, get } from 'lodash';

const pathJoin = (base, _string) => {
  if (isArray(_string)) {
    return _string.map((st) => pathJoin(base, st));
  }

  return path.join(base, _string);
};

const src = Symbol('src');
const dest = Symbol('dest');
const isProduction = Symbol('isProduction');
const pkgConf = Symbol('pkgConf');

class GulpConfig {
  constructor(IS_PRODUCTION, PATH_ROOT, PATH_SRC, PATH_DEST) {
    this[isProduction] = IS_PRODUCTION || false;
    this[src] = undefined;
    this[dest] = undefined;

    this.PATH_ROOT = PATH_ROOT || __dirname;
    this.PATH_SRC = pathJoin(this.PATH_ROOT, PATH_SRC || 'src');
    this.PATH_DEST = pathJoin(this.PATH_ROOT, PATH_DEST || 'dist');

    this[pkgConf] = require(pathJoin(this.PATH_ROOT, 'package.json'))['gulp-config'];
  }

  src() {
    if (this[src] === undefined) {
      this.loadSrc();
    }

    return this[src];
  }

  dest() {
    if (this[dest] === undefined) {
      this.loadDest();
    }

    return this[dest];
  }

  loadSrc() {
    // FONTS
    const fonts = (() => {
      const list = get(this[pkgConf], 'fonts', []);
      list.push(this.srcPath('/fonts/'));
      return list.map((str) => `${str}**/*.{eot,svg,ttf,woff,woff2}`);
    })();

    // JS
    const js = (() => {
      const main = this.srcPath(get(this[pkgConf], 'js.main', '/js/main.js'));
      const vendor = this.rootPath(get(this[pkgConf], 'js.vendor', []));

      return { main, vendor };
    })();

    // CSS
    const css = (() => {
      const scssMain = this.srcPath(get(this[pkgConf], 'css.scssMain', '/scss/main.scss'));
      const vendor = this.rootPath(get(this[pkgConf], 'css.vendor', []));

      return { scssMain, vendor };
    })();

    this[src] = { fonts, js, css };
  }

  loadDest() {
    const js = this.destPath(get(this[pkgConf], 'dest.js', '/js/'));
    const css = this.destPath(get(this[pkgConf], 'dest.css', '/css/'));

    this[dest] = { js, css };
  }

  isProduction() {
    return this[isProduction];
  }

  rootPath(value) {
    return pathJoin(this.PATH_ROOT, value);
  }

  srcPath(value) {
    return pathJoin(this.PATH_SRC, value);
  }

  destPath(value) {
    return pathJoin(this.PATH_DEST, value);
  }

  loadTasks(tasksPath = 'gulpTasks') {
    const tasks = requireAll(this.rootPath(tasksPath));
    forEach(tasks, (task) => task.default(this));
  }
}

export default GulpConfig;
