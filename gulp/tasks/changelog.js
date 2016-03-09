(function () {
    'use strict';

    module.exports = function (gulp, pipes, $, options) {
        var changelog = require('conventional-changelog');

        function makeChangelog(config) {
            var deferred = $.q.defer();
            changelog(config, function (err, log) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(log);
                }
            });
            return deferred.promise;
        }

        gulp.task('changelog', 'Génère le fichier CHANGELOG.md', function () {
            var changelogFile = 'CHANGELOG.md';
            var packagejson = require('../../package.json');
            var config = {
                file: changelogFile,
                repository: packagejson.repository.url,
                version: packagejson.version
            };
            return makeChangelog(config)
                .then(function (log) {
                    $.fs.writeFileSync(changelogFile, log);
                });
        });
    };
})();