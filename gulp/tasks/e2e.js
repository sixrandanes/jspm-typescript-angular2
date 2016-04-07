'use strict';

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = (gulp, pipes, $, options) => {
  const server = require('../server');

  gulp.task('webdriver_update', 'Lance la mise à jour du webdriver', $.protractor.webdriver_update);

  gulp.task('e2e', 'Execute les TI avec protractor', ['webdriver_update', 'server'], done => {
    //TODO var randomPort = randomIntFromInterval(5000, 6000);
    const randomPort = 5000;
    options.port = randomPort;
    gulp.src(['e2e/*spec.js'])
                .pipe($.protractor.protractor({
                  configFile: './protractor.config.js',
                  args: ['--baseUrl', `http://localhost:${randomPort}`],
                  debug: false,
                }))
                .on('error', e => {
                  $.util.log(e.toString());
                  throw e;
                })
                .on('end', () => {
                  server.stopExpress();
                  done();
                  console.log('fin des tests');
                  process.exit(0);
                });
  });

  gulp.task('elementor', 'Lance elementor', ['webdriver_update', 'server'], cb => {
    const exec = require('child_process')
        .exec;
    exec('webdriver-manager start', (err, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });

    setTimeout(() => {
      console.log('Webdriver demarré');
    }, 3000);

    exec(`elementor http://localhost:${options.port}`, (err, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  });
};
