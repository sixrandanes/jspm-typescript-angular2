(function() {
    module.exports = {
        src: 'src/app',
        dist: 'dist',
        e2e: 'e2e',
        port: 5000,
        livereloadPort: 35729,
        errorHandler: function (title) {
            return function (err) {
                $.util.log($.util.colors.red('[' + title + ']'), err.toString());
                this.emit('end');
            };
        },
        htmlFiles: ['./src/app/**/*.html', '!./src/jspm_packages/**', '!./src/app/assets/**'],
        jsFiles: ['./src/app/**/**.js', '!./src/jspm_packages/**', '!./src/app/assets/**'],
        tsFiles: ['./src/app/**/**.ts', '!./src/jspm_packages/**', '!./src/app/assets/**'],
        scssFiles: ['./src/app/assets/stylesheets/**/*.scss'],
        cssFiles: ['./src/app/assets/stylesheets/**/**.css'],
        fontFiles: ['./src/app/assets/font/**'],
        tinymceFiles: ['./src/app/assets/tinymce/**'],
        imgFiles: ['./src/app/assets/images/**']
    };
})();
