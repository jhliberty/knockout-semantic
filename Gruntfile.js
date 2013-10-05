'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        watchify: {
            basic: {
                src: './src/*.js',
                dest: 'build/sui-ko.js',
                options: {
                    callback: function(b) {
                        b.require('./src/sui-ko.js', {
                            /*expose: 'semantic'*/
                        });
                        b.transform('brfs');
                        return b;
                    },
                    keepalive: true
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-watchify');

    grunt.registerTask('default', ['watchify']);
};