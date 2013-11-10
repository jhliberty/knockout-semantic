'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        browserify: {
            dist: {
                src: './src/**/*.js',
                dest: 'build/knockout-semantic.js',
                options: {
                    transform: ["brfs"]
                }
            }
        }
    });

    // Loading dependencies
    for (var key in grunt.file.readJSON("package.json").devDependencies) {
        if (key !== "grunt" && key.indexOf("grunt") === 0) grunt.loadNpmTasks(key);
    }

    grunt.registerTask('default', ['browserify']);
};