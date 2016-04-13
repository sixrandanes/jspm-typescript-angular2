'use strict';

module.exports = (gulp, pipes, $, options) => {
  const changelog = require('conventional-changelog');

  function makeChangelog(config) {
    const deferred = $.q.defer();
    changelog(config, (err, log) => {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(log);
      }
    });

    return deferred.promise;
  }

  gulp.task('changelog', 'Génère le fichier CHANGELOG.md', () => {
    const changelogFile = 'CHANGELOG.md';
    const packagejson = require('../../package.json');
    const config = {
      file: changelogFile,
      repository: packagejson.repository.url,
      version: packagejson.version,
    };
    return makeChangelog(config)
                .then(log => {
                  $.fs.writeFileSync(changelogFile, log);
                });
  });
};
