(function () {
    'use strict';
    var del = require('del');

    module.exports = function (gulp, pipes, $, options) {
        var gulpSequence = require('gulp-sequence')
            .use(gulp);
        var es = require('event-stream');
        var server = require('../server');

        pipes.plumberTask = function () {
            return $.plumber({
                errorHandler: options.errorHandler
            });
        };

        pipes.cleanDev = function (cb) {
            return $.del([options.dest], cb);
        };

        pipes.buildDev = function (cb) {
            return gulpSequence(['ts', 'sass'])(cb);
        };

       pipes.tsWatchers = function () {
            //return gulpSequence('notifyLivereload')(cb);
            return es.merge(pipes.tsLinters());
        }

        pipes.open = function (cb) {
            return gulp.src(options.src)
                .pipe($.open({uri:"http://localhost:5000", app:"chrome"}, cb));
        };

        gulp.task('notifyLivereload', 'Notifie le serveur qu\'il doit recharger la page', function () {
            return server.notifyLivereload(options);
        });

        gulp.task('tsWatcher', 'Lance le watcher des fichiers typescrit', function (cb) {
            return gulpSequence('ts', 'notifyLivereload')(cb);
        });

        gulp.task('sassWatcher', 'Lance le watcher des fichiers scss', function (cb) {
            return gulpSequence('sass', 'notifyLivereload')(cb);
        });

        gulp.task('htmlWatcher', 'Lance le watcher des fichiers html', function (cb) {
            return gulpSequence('notifyLivereload')(cb);
        });

        gulp.task('clean', 'Vide le dossier de travail', pipes.cleanDev);

        gulp.task('watch', 'Lance les watchers sur les fichiers html, typescript et scss', function () {
            gulp.watch(options.tsFiles, ['tsWatcher']);
            gulp.watch(options.scssFiles, ['sassWatcher']);
            gulp.watch(options.htmlFiles, ['htmlWatcher']);
        });

        //Js task
        gulp.task('ts', 'watcher ts', pipes.tsWatchers);


        gulp.task('build', 'Lance les taches de fonds : linters, compilation css, etc...', function (cb) {
            pipes.buildDev(cb);
        });


        gulp.task('server', 'Lance le serveur de dev', ['build', 'watch'], function () {
            server.startExpress(options);
            server.startLiveReload(options);
        });

        gulp.task('open', 'Lance le navigateur', pipes.open);
    };
})();