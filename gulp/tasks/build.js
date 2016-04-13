'use strict';
const del = require('del');

module.exports = (gulp, pipes, $, options) => {
  const gulpSequence = require('gulp-sequence')
      .use(gulp);
  const es = require('event-stream');
  const server = require('../server');
  pipes.plumberTask = function () {
    return $.plumber({
      errorHandler: options.errorHandler,
    });
  };

  pipes.cleanDev = cb => {
    $.del([options.dest], cb);
  };

  pipes.buildDev = cb => {
    gulpSequence(['ts', 'sass'])(cb);
  };

  pipes.tsWatchers = () => {
    es.merge(pipes.tsLinters());
  };

  pipes.open = (cb) => {
    gulp.src(options.src)
        .pipe($.open({ uri:`http://localhost:${options.port}`, app:'chrome' }, cb));
  };

  gulp.task('notifyLivereload', 'Notifie le serveur qu\'il doit recharger la page', () => {
    server.notifyLivereload(options);
  });

  gulp.task('tsWatcher', 'Lance le watcher des fichiers typescrit', cb => {
    gulpSequence('ts', 'notifyLivereload')(cb);
  });

  gulp.task('sassWatcher', 'Lance le watcher des fichiers scss', cb => {
    gulpSequence('sass', 'notifyLivereload')(cb);
  });

  gulp.task('htmlWatcher', 'Lance le watcher des fichiers html', cb => {
    gulpSequence('notifyLivereload')(cb);
  });

  gulp.task('clean', 'Vide le dossier de travail', pipes.cleanDev);

  gulp.task('watch', 'Lance les watchers sur les fichiers html, typescript et scss', () => {
    gulp.watch(options.tsFiles, ['tsWatcher']);
    gulp.watch(options.scssFiles, ['sassWatcher']);
    gulp.watch(options.htmlFiles, ['htmlWatcher']);
  });

  //Js task
  gulp.task('ts', 'watcher ts', pipes.tsWatchers);

  gulp.task('build', 'Lance les taches de fonds : linters, compilation css, etc...', cb => {
    pipes.buildDev(cb);
  });

  gulp.task('server', 'Lance le serveur de dev', ['build', 'watch'], () => {
    server.startExpress(options);
    server.startLiveReload(options);
  });

  gulp.task('open', 'Lance le navigateur', pipes.open);
};
