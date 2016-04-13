'use strict';
require('babel-register');
let gulp = require('gulp-help')(require('gulp'));

gulp.paths = {
  src: 'src',
  prod: 'app',
  dist: 'dist',
};

let $ = require('gulp-load-plugins')({
  pattern: ['gulp-*',
      'del',
      'fs',
      'q',
  ],
  camelize: true,
  lazy: true,
});

let wrench = require('wrench');

let options = require('./gulp/options');

let pipes = {};

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
