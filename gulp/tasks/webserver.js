(function () {
    'use strict';

    module.exports = function (gulp, pipes, $, options) {

        /**
         * Run webserver via gulp, branche sur le repertoire dist
         */
        gulp.task('webserver', function () {
            gulp.src(options.dist)
                .pipe($.webserver({
                    livereload: true,
                    directoryListing: false,
                    open: true,
                    https:false,
                    port:5000
                }));
        });
    }

})();