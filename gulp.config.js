import path from "path";
import fs from "fs";
import requireAll from "require-all";
import { isArray, forEach, get } from "lodash";

const req = require;

const pathJoin = (base, _string) => {
  if (isArray(_string)) {
    return _string.map(function (st) {
      return pathJoin(base, st);
    });
  }

  return path.join(base, _string);
};

class GulpConfig {
  constructor(isProduction, PATH_ROOT, PATH_SRC, PATH_DEST) {
    this._isProduction = isProduction || false;
    this._src = undefined;
    this._dest = undefined;

    this.PATH_ROOT = PATH_ROOT || __dirname;
    this.PATH_SRC = pathJoin(this.PATH_ROOT, PATH_SRC || 'src');
    this.PATH_DEST = pathJoin(this.PATH_ROOT, PATH_DEST || 'dist');

    this._pkgConf = require(pathJoin(this.PATH_ROOT, 'package.json'))["gulp-config"];
  }

  src() {
    if(this._src === undefined) {
      this.loadSrc();
    }

    return this._src;
  }

  dest() {
    if(this._dest === undefined) {
      this.loadDest();
    }

    return this._dest;
  }

  loadSrc() {
    // FONTS
    const fonts = (() => {
      const fonts = get(this._pkgConf, 'fonts', []);
      fonts.push(this.srcPath('/fonts/'));
      return fonts.map(function (str) {
        return `${str}**/*.{eot,svg,ttf,woff,woff2}`;
      });
    })();

    // JS
    const js = (() => {
      const main = this.srcPath(get(this._pkgConf, 'js.main', "/js/main.js"));
      return { main };
    })();

    this._src = { fonts, js };
  }

  loadDest() {
    const js = this.destPath(get(this._pkgConf, 'dest.js', "/js/"));

    this._dest = { js };
  }

  isProduction() {
    return this._isProduction;
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

  loadTasks(tasksPath = "gulpTasks") {
    const tasks = requireAll(this.rootPath(tasksPath));
    forEach(tasks, (task) => task.default(this))
  };
}

export default GulpConfig;
