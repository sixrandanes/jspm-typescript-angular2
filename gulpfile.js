(function () {
    'use strict';

    var gulp = require('gulp-help')(require('gulp'));
	
	gulp.paths = {
		src: 'src',
		prod: 'app',
		dist: 'dist'
	};

    var $ = require('gulp-load-plugins')({
        pattern: ['gulp-*',
            'del',
            'fs',
            'q'
        ],
        camelize: true,
        lazy: true,
    });

    var wrench = require('wrench');

    var options = require('./gulp/options');

    var pipes = {};

    wrench.readdirSyncRecursive('./gulp/tasks/')
        .filter(function (file) {
            return (/\.(js|coffee)$/i)
                .test(file);
        })
        .map(function (file) {
            require('./gulp/tasks/' + file)(gulp, pipes, $, options);
        });

    // Start the tasks
    gulp.task('default', ['server', 'open']);
    
})();