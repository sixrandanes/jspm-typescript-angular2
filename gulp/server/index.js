(function () {
    'use strict';
    module.exports = {
        express: require('express'),
        path: require('path'),

        lr: null,
        app: null,
        server: null,

        startLiveReload: function (options) {
            this.lr = require('tiny-lr')();
            this.lr.listen(options.livereloadPort);
        },

        notifyLivereload: function (options) {

            this.lr.changed({
                body: {
                    files: ['*']
                }
            });
        },

        stopExpress: function () {
            console.log('stop server');
            this.server.close();
        },

        startExpress: function (options) {
            var express = require('express');
            var bodyParser = require('body-parser');
            var path = require('path');

            var _ = require('lodash');

            this.app = express();
            this.app.use(require('connect-livereload')());
            // les repertoires sont merges
            this.app.use( express.static(path.join(__dirname, '../../src')));
            //this.app.use(express.static(path.join(__dirname, '../../' + 'config.js')));
            //this.app.use( express.static(path.join(__dirname, '../../' + 'jspm_packages')));
            // configure app to use bodyParser()
            // this will let us get the data from a POST
            this.app.use(bodyParser.urlencoded({
                extended: true
            }));
            this.app.use(bodyParser.json());


            this.server = this.app.listen(options.port, function () {
                console.log('Express server listening on port %d', options.port);
            });
        }
    };
})();