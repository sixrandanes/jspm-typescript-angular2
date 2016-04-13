
'use strict';

const karma = require('karma');

module.exports = (gulp, pipes, $, options) => {

  /**
    		  * Suppression du dossier /coverage/
    		  */
  pipes.delCov = () => {
    $.del(['coverage/**/*']);
  };

  /**
    		  * Mise en conformité du fichier lcov.info
    		  */
  const postprocessLCOV = () => {
    gulp.src('coverage/lcov.info')

    // avoir des chemins de la forme client/app/...
    .pipe($.replace('SF:/data/jenkins/ocean-frontend/', 'SF:'))
    .pipe($.replace('SF:/data/jenkins/ocean-frontend/', 'SF:'))
    .pipe($.replace('SF:.', 'SF:'))
    .pipe($.replace('\\', '/'))

    // DA:0,xx fait planter l'analyse...
    .pipe($.replace(/DA:0,[0-9]{1,3}\n/g, ''))
    .pipe(gulp.dest('coverage'));
  };
  /**
   * Run test once and exit
   */
  const Server = karma.Server;
  pipes.test = () => {
    new Server({
      configFile: `${__dirname}/../../karma.config.js`,
      singleRun: true,
      autoWatch: false,
      browsers: ['Firefox', 'PhantomJS', 'Chrome'],
    }, postprocessLCOV).start();
  };

  gulp.task('preTest', 'Suppression du dossier coverage', pipes.delCov);
  gulp.task('test', ['preTest'], pipes.test, 'Lance les tests karma avec PhantomJS');

  /**
   * Watch for file changes and re-run tests on each change
   */
  gulp.task('tdd', `Lances les tests karma à la sauvegarde sur les navigateurs Firefox, Chrome et
  PhantomJS`, done => {
    new Server({
      configFile: `${__dirname}/../../karma.config.js`,
      autoWatch: true,
      singleRun: false,
      colors: true,
    }, done).start();
  });
};
