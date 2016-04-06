'use strict';

let gulp = require('gulp-param')(require('gulp'), process.argv);
let eventStream = require('event-stream');
let runSequence = require('run-sequence');
let fs = require('fs');
let paths = gulp.paths;

module.exports = (gulp, pipes, $, options) => {

  function tagVersion() {
      // you're going to receive Vinyl files as chunks
      function transform(file, cb) {
        let json = JSON.parse(file.contents.toString());
        let version = json.version;
        let tag = 'v' + version;
        $.util.log('Tagging as: ' + $.util.colors.yellow(tag));
        $.git.tag(tag, 'tagging as ' + tag);

        // if there was some error, just pass as the first parameter here
        cb(null, file);
      }

      return eventStream.map(transform);
    }

  function error(err) {
      $.util.log('** Une erreur est apparue : ' + err);
      throw err;
    }

  let fileName = '';

  pipes.checkRepo = () => {
    $.util.log($.util.colors.yellow('Checking git repository...'));
    return $.git.status({
        args: '--porcelain',
      }, (err, stdout) => {
        if (err) {throw err;}

        if (stdout !== '') {
          $.util.log($.util.colors.red('Please clean your repository git before releasing !'));
          throw new Error();
        }
      });
  };

  pipes.bumpVersion = (releaseType) => {
    $.util.log('Bumping version');
    return gulp.src(['./package.json', './bower.json'])
    .pipe($.bump({ type: releaseType }))
    .on('end', () => {$.util.log('Saving files');})
    .pipe(gulp.dest('./'))
    .on('end', () => {$.util.log('Adding files');})
    .pipe($.git.add())
    .on('end', () => {$.util.log('Commit');})
    .pipe($.git.commit('[Gulp release] Preparing release', { quiet:false }))
    .on('error', error);
  };

  pipes.tag = () => {
    gulp.src(['./package.json', './bower.json'])
    .pipe(tagVersion())
    .on('error', error);
  };

  pipes.zip = () => {
    let json = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    let v = json.version;
    fileName = 'ocean-frontend-' + v + '.zip';

    return gulp.src(paths.dist + '/**')
    .pipe($.zip(fileName))
    .on('end', function () {$.util.log('Files zipped');})
    .on('error', error)
    .pipe(gulp.dest('release/nc/gouv/dfpc/sefadm/frontend/' + v + '/'))
    .on('end', function () {$.util.log('Zip saved');})
    .on('error', error);
  };

  pipes.nextVersion = () => {
    gulp.src(['./package.json', './bower.json'])
    .pipe($.bump({ type: 'prerelease', preid: 'snapshot' }))
    .pipe(gulp.dest('./'))
    .pipe($.git.add())
    .pipe($.git.commit('[Gulp release] Prepare for next version development iteration',
	{ quiet:false }));
  };

  // Run git push with options
  // branch is the remote branch to push to
  pipes.push = branch => {
    // Ne pas utiliser le pipe de Gulp : �a plante
    $.git.push('origin', branch, { args: ' --tags --porcelain --verbose' }, err => {
      if (err) {
        $.util.log('** Erreur lors du push ' + err);
        throw err;
      }
    });
  };

  /**
  		 * Bumping version number and tagging the repository with it.
  		 * Please read http://semver.org/
  		 *
  		 * You can use the commands
  		 *
  		 *     gulp patch     # makes v0.1.0 → v0.1.1
  		 *     gulp feature   # makes v0.1.1 → v0.2.0
  		 *     gulp release   # makes v0.2.1 → v1.0.0
  		 *
  		 * To bump the version numbers accordingly after you did a patch,
  		 * introduced a feature or made a backwards-incompatible release.
  		 */
  function inc(releaseType) {
      runSequence('push');
    }

  pipes.runReleaseType = (releaseType, branch) => {
    if (releaseType === null) {
      return gulp.src('')
.pipe($.prompt.prompt({
  type: 'rawlist',
  name: 'bump',
  message: 'What type of release would you like to do ?',
  choices: [
  'patch',
  'minor',
  'major',
  'prerelease',
  ],
					}, res => {
  inc(res.bump, branch);
					}));
    } else {
      return inc(releaseType, branch);
    }
  };

  gulp.task('checkRepo', 'Check the local files for pending changes', pipes.checkRepo);
  gulp.task('bumpVersion', 'Increase version number', pipes.bumpVersion);
  gulp.task('tag', ['bumpVersion'], pipes.tag);
  gulp.task('zip', ['tag'], pipes.zip);
  gulp.task('nextVersion', ['zip'], pipes.nextVersion);
  gulp.task('push', ['nextVersion'], pipes.push);
  gulp.task('runReleaseType', 'Release script', pipes.runReleaseType);
  gulp.task('release', ['runReleaseType']);

};
