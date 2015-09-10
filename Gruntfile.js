'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            allFiles: ['*.js', 'lib/**/*.js', 'test/**/*.js'],
            options: {
                jshintrc: '.jshintrc',
            }
        },
        browserify: {
            dist: {
                files: {
                    'ltx.js': ['./lib/index.js']
                },
                options: {
                    debug: grunt.cli.options.debug
                }
            }
        },
        clean: ['ltx.js'],
        vows: {
            all: {
                options: {
                    reporter: 'spec',
                    coverage: 'json'
                },
                src: ['test/**/*.js']
            }
        }
    })

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-jshint')
    grunt.loadNpmTasks('grunt-browserify')
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-vows')

    // Configure tasks
    grunt.registerTask('default', ['test'])
    grunt.registerTask('test', ['clean', 'vows', 'jshint', 'browserify'])
}
