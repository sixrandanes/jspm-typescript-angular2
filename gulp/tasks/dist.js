'use strict';

module.exports = (gulp, pipes, $, options) => {

  $.sequence.use(gulp);

  pipes.delDist = (cb) => {
    return $.del([options.dist], cb);
  };

  pipes.copyFonts = () => {
    gulp.src(options.fontFiles)

        //gestion police firefox & chrome
        .pipe($.filter(['**/*.woff2', '**/*.woff', '**/*.ttf']))
        .pipe(gulp.dest(options.dist + '/assets/font'));
  };

  pipes.copyImages = () => {
    gulp.src(options.imgFiles, {
      base: process.cwd(),
    })
        .pipe($.filter('**/*.{png,jpg,jpeg,gif}'))
                .pipe($.rename({
                  dirname: options.dist + '/assets/images',
                }))
                .pipe(gulp.dest('.'));
  };

  pipes.copyTinyMce = () => {
    gulp.src(options.tinymceFiles)
        .pipe(gulp.dest(options.dist + '/assets/tinymce'));
  };

  pipes.copyImagesJspm = () => {
    gulp.src('./' + options.src + '/jspm_packages/**/DataTables/**/*.png')
                .pipe($.rename({
                  dirname: options.dist + '/assets/images/jspm/',
                }))
                .pipe(gulp.dest('.'));
  };

  pipes.postProcessImagesJspm = () => {
    //Le replace est appliqué sur les images du répertoire de datatables, quelque soit
    //la version de la lib.
    const regexp = new RegExp(
        'jspm_packages/github/DataTables/DataTables@[0-9].[0-9]?[0-9].[0-9]?[0-9]/images/', 'g');
    return gulp.src(options.dist + '/bundle.js')
        .pipe($.replace(regexp, './assets/images/jspm/'))
        .pipe(gulp.dest(options.dist));
  };

  pipes.minifyImages = () => {
    gulp.src([options.dist + '/assets/images'])
        .pipe($.filter('**/*.{png,jpg,jpeg,gif}'))
                .pipe($.imageOptimization({
                  optimizationLevel: 5,
                  progressive: true,
                  interlaced: true,
                })).pipe(gulp.dest(options.dist + '/assets/images'));
  };

  pipes.copyConfig = () => {
    gulp.src([options.src + '/conf/ocean-front.json'])
        .pipe($.jsonminify())
        .pipe(gulp.dest(options.dist + '/conf/'));
  };

  pipes.copyIndex = () => {
    gulp.src([options.src + '/index.html'])
        .pipe(gulp.dest(options.dist));
  };

  pipes.copyMisc = () => {
    gulp.src('./' + options.src + '/assets/misc/**')
        .pipe($.jsonminify())
        .pipe(gulp.dest(options.dist + '/assets/misc'));
  };

  pipes.templateCache = () => {
    gulp.src(options.htmlFiles)
        .pipe($.angularHtmlify())
        .pipe($.htmlMinifier({ collapseWhitespace: true,
            removeComments:true,
            removeCommentsFromCDATA:true, }))
                .pipe($.angularTemplatecache('templates.module.js', {
                  moduleSystem: 'ES6',
                  standalone: 'true',
                  root: './',
                }))
                .pipe(gulp.dest(options.src + '/shared/modules/'));
  };

  pipes.saveTemplate = () => {
    gulp.src('./' + options.src + '/shared/modules/templates.module.js')
        .pipe(gulp.dest(options.dest));
  };

  pipes.restoreTemplate = () => {
    gulp.src('./' + options.dest + '/templates.module.js')
        .pipe(gulp.dest(options.src + '/shared/modules/'));
  };

  pipes.cleanTemplate = () => {
    $.del([options.dest]);
  };

  pipes.minifyCssTask = () => {
    gulp.src(options.dist + '/assets/stylesheets/ocean.css')
        .pipe($.minifyCss())
        .pipe(gulp.dest(options.dist + '/assets/stylesheets/'));
  };

  pipes.bundle = () => {
    gulp.src('./' + options.dist + '/')
       .pipe($.exec('jspm bundle-sfx ./client/app/bootstrap dist/bundle.js --skip-source-maps'));
  };

  // A voir si on peut ameliorer cette tâche, pour que le ng-annotate ne s'applique que sur
  // notre code source et pas les librairies tierces
  pipes.ngAnnotate = () => {
    gulp.src('dist/bundle.js')
        .pipe($.replace('strictDi: false', 'strictDi: true'))
        .pipe($.ngAnnotate())
        .pipe(gulp.dest('dist'));
  };

  // Idem ici pour le uglify, surtout pour les perfs
  pipes.uglify = () => {
    gulp.src(options.dist + '/bundle.js')
        .pipe($.uglify())
        .pipe(gulp.dest(options.dist));
  };

  pipes.injectJS = () => {
    gulp.src(options.dist + '/index.html')
                .pipe($.inject(gulp.src(options.dist + '/bundle.js', {
                  read: false,
                }), { relative: true }))
                .pipe(gulp.dest(options.dist));
  };

  pipes.buildDist = (cb) => {
    return $.sequence('clean:dist',
        'images',
        'imagesJspm',
        'tinymce',
        'copyMisc',
        'fonts',
        'minifyImages',
        'sassBuild',
        'minifyCss',
        'copyIndex',
        'conf',
        'buildHtml',
        'bundle',
        'cleanHtml',
        'postProcessImagesJspm',
        'ngAnnotate',
        'uglify',
        'injectJS', cb);
  };

  gulp.task('clean:dist', 'Vide le contenu du dossier de build', pipes.delDist);

  gulp.task('copyIndex', 'Copie index.html', pipes.copyIndex);

  gulp.task('copyMisc', 'Copie l ensemble du répertoire misc', pipes.copyMisc);

  gulp.task('fonts', 'Copie les fonts dans le dossier dest', pipes.copyFonts);

  gulp.task('images', 'Copie les images du dossier assets', pipes.copyImages);

  gulp.task('tinymce', 'Copie les fichiers de tinymce', pipes.copyTinyMce);

  gulp.task('imagesJspm', 'Copie les images du dossier assets', pipes.copyImagesJspm);

  gulp.task('minifyImages', 'Minifie les images', pipes.minifyImages);

  gulp.task('conf', 'Copie le fichier de conf', pipes.copyConfig);

  gulp.task('minifyCss', 'Minimifie le css', pipes.minifyCssTask);

  gulp.task('bundle', 'genere le bundle (transpilation ecma5, concatenation)', pipes.bundle);

  gulp.task('ngAnnotate', 'ng-Annotation du code angular', pipes.ngAnnotate);

  gulp.task('uglify', 'JS minification', pipes.uglify);

  gulp.task('injectJS', 'Injecte les fichiers javascript dans le fichier index.html du build',
    pipes.injectJS);

  gulp.task('postProcessImagesJspm', 'Mise a jour des liens images jspm dans le bundle',
    pipes.postProcessImagesJspm);

  gulp.task('dist', 'Créée le livrable destinée à la release', cb => {
    return pipes.buildDist(cb);
  });

  gulp.task('saveTemplate', 'Sauvegarde du fichier de dev', pipes.saveTemplate);

  gulp.task('templateCache',
    'Generation du module qui  insere les fichiers HTML dans le cache angular',
    pipes.templateCache);

  gulp.task('restoreTemplate', 'Restauration du fichier de dev', pipes.restoreTemplate);

  gulp.task('cleanTemplate', 'Suppression du dossier temporaire', pipes.cleanTemplate);

  gulp.task('buildHtml', 'Minification HTML et mise en cache angular', cb => {
    $.sequence('saveTemplate', 'templateCache')(cb);
  });

  gulp.task('cleanHtml',
    'Restauration du module template et suppression dossier temporaire', cb => {
      $.sequence('restoreTemplate', 'cleanTemplate')(cb);
    });

};
