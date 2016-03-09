(function () {
    'use strict';

    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    module.exports = function (gulp, pipes, $, options) {
        var server = require('../server');

        gulp.task('webdriver_update', 'Lance la mise à jour du webdriver', $.protractor.webdriver_update);

        gulp.task('e2e', 'Execute les TI avec protractor', ['webdriver_update', 'server'], function (done) {
            //TODO var randomPort = randomIntFromInterval(5000, 6000);
            var randomPort = 5000;
            options.port = randomPort;
            gulp.src(['e2e/*spec.js'])
                .pipe($.protractor.protractor({
                    'configFile': './protractor.config.js',
                    'args': ['--baseUrl', 'http://localhost:' + randomPort],
                    'debug': false
                }))
                .on('error', function (e) {
                    $.util.log(e.toString());
                    throw e;
                })
                .on('end', function () {
                    server.stopExpress();
                    done();
                    console.log('fin des tests');
                    process.exit(0);
                });
        });

        gulp.task('elementor', 'Lance elementor', ['webdriver_update', 'server'], function (cb) {
            var exec = require('child_process')
                .exec;
            exec('webdriver-manager start', function (err, stdout, stderr) {
                console.log(stdout);
                console.log(stderr);
                cb(err);
            });
            setTimeout(function () {
                console.log('Webdriver demarré');
            }, 3000);
            exec('elementor http://localhost:' + options.port, function (err, stdout, stderr) {
                console.log(stdout);
                console.log(stderr);
                cb(err);
            });
        });
    };
})();