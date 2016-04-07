'use strict';

module.exports = (gulp, pipes, $, options) => {
  //Sass task
  pipes.sassTask = () => {
    gulp.src(options.scssFiles)
    .pipe(pipes.plumberTask())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync()
        .on('error', $.sass.logError))
            .pipe($.autoprefixer({
              cascade: false,
            }))
            .pipe($.concat('ocean.css'))
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest('./' + options.src + '/assets/stylesheets/'));
  };

  //Sass Build task
  pipes.sassBuildTask = () => {
    gulp.src(options.scssFiles)
    .pipe(pipes.plumberTask())
        .pipe($.sass.sync({ sourcemap: 'none' })
            .on('error', $.sass.logError))
                .pipe($.autoprefixer({
                  cascade: false,
                }))
                .pipe($.concat('ocean.css'))
                .pipe(gulp.dest(`./${options.dist}/assets/stylesheets/`));
  };

  gulp.task('sass', `Transpile les fichiers scss en css, créée les fichiers sourcemaps, autoprefixe
   les balises puis concatène tous les fichiers dans index.css`,
      pipes.sassTask);

  gulp.task('sassBuild', `Transpile les fichiers scss en css, créée les fichiers sourcemaps,
  autoprefixe les balises puis concatène tous les fichiers dans index.css`,
      pipes.sassBuildTask);

};
