'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        watchify: {
            basic: {
                src: './src/**/*.js',
                dest: 'build/knockout-semantic.js',
                options: {
                    callback: function(b) {
                        b.require('./src/main.js', {
                            /*expose: 'semantic'*/
                        });
                        b.transform('brfs');
                        console.warn("Built.");
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