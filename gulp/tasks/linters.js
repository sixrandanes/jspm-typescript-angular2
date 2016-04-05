(function () {
    'use strict';
    module.exports = function (gulp, pipes, $, options) {

        var map = require('map-stream'),
            path = require('path'),
            notifier = require('node-notifier');

        pipes.tsLinters = function () {
            return gulp.src(['./' + options.src + '/**/**.ts', '!./app/jspm_packages/**',  '!./app/assets/**'])
                .pipe($.tslint())
                .pipe($.tslint.report("verbose", {
                    emitError: false
                }))

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
        gulp.task('tsLinters', 'Lance le linter tslint sur les fichiers typescript', pipes.tsLinters);

        gulp.task('cssLinters', 'Lance le linter SCSS (nécessite ruby et scss-lint gem)', pipes.cssLinters);

    };
})();