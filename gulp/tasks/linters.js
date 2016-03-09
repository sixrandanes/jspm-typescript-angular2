(function () {
    'use strict';
    module.exports = function (gulp, pipes, $, options) {

        var map = require('map-stream'),
            path = require('path'),
            notifier = require('node-notifier');

        // Custom linting reporter used for error notify
        var jsHintErrorNotifier = function (file, cb) {
            return map(function (file, cb) {
                if ('jshint' in file && !file.jshint.success) {
                    file.jshint.results.forEach(function (err) {
                        if (err) {
                            // Error message
                            var msg = [
                                path.basename(file.path),
                                'Line: ' + err.error.line,
                                'Reason: ' + err.error.reason
                            ];
                            notifier.notify({
                                'title': 'Erreur',
                                'message': msg.join('\n'),
                                'icon': path.join(__dirname, '..', 'node_modules/gulp-notify/assets', 'gulp-error.png'),
                            });
                        }
                    });
                }
                return cb(null, file);
            });
        }

        pipes.jsLinters = function () {
            return gulp.src(['./' + options.src + '/**/**.js', '!./app/jspm_packages/**',  '!./app/assets/**'])
                .pipe(pipes.plumberTask())
                .pipe($.jshint('.jshintrc'))
                .pipe($.jscs())
                .pipe($.jscsStylish.combineWithHintResults())
                .pipe($.jshint.reporter('jshint-stylish')) // log style errors
                .pipe($.jshint.reporter($.jshintXmlFileReporter))
                .pipe(jsHintErrorNotifier())
                .on('end', $.jshintXmlFileReporter.writeFile({
                    format: 'checkstyle',
                    filePath: 'jshint-checkstyle.xml',
                    alwaysReport: true
                }))
                .on('data', function (chunk) {
                    //console.log('got %s bytes of data', chunk);
                });
        };

        pipes.cssLinters = function () {
            return gulp.src('./' + options.src + '/**/**.scss')
                .pipe($.scssLint({
                    'reporterOutputFormat': 'Checkstyle',
                    'filePipeOutput': './scsslint-checkstyle.xml'
                }))
                .pipe(gulp.dest('./'));
        };

        //Linters task
        gulp.task('jsLinters', 'Lance les linters jscs et jshint sur les fichiers javascript', pipes.jsLinters);

        gulp.task('cssLinters', 'Lance le linter SCSS (nécessite ruby et scss-lint gem)', pipes.cssLinters);

    };
})();