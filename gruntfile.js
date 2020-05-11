const path = require('path')
const serverlintPath = path.resolve(__dirname, './src/server/**/*.js')
const applintPath = path.resolve(__dirname, './src/core/**/*.js')
// const _ = require('lodash')

module.exports = function (grunt) {
  'use strict'
  //  Project configuration
  grunt.initConfig({
    babel: {
      dist: {
        files: [
          { expand: true, cwd: './src/server', src: '**/*.js', dest: './dist/server', ext: '.js' }
        ]
      }
    },
    eslint: {
      options: {
        format: 'node_modules/eslint-formatter-pretty'
      },
      target: [serverlintPath, applintPath]
    },
    copy: {
      distcontent: {
        files: [
          { expand: true, cwd: './other/images/', src: ['**'], dest: 'dist/content/images/' }
        ]
      }
    },
    nodemon: {
      dev: {
        script: 'dist/server/server.js',
        options: {
          env: {
            PORT: '3001'
          },
          // omit this property if you aren't serving HTML files and
          // don't want to open a browser tab on start
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour)
            })
          },
          watch: ['dist/server/'],
          delay: 5000
        }
      }
    },
    clean: {
      core: ['./dist/core/*'],
      server: ['./dist/server/*'],
      content: ['./dist/content/*']
    }
  })

  grunt.loadNpmTasks('grunt-nodemon')
  grunt.loadNpmTasks('grunt-eslint')
  grunt.loadNpmTasks('grunt-babel')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')

  // setup tasks
  grunt.registerTask('start', 'Start debugging', function () {
    grunt.task.run('clear')
    grunt.task.run('init')
    grunt.task.run('check')
    grunt.task.run('build')
    grunt.task.run('debug')
  })
  grunt.registerTask('clear', ['clean:core', 'clean:server', 'clean:content'])
  grunt.registerTask('init', ['copy:distcontent'])
  grunt.registerTask('debug', ['nodemon:dev'])
  grunt.registerTask('check', ['eslint'])
  grunt.registerTask('build', ['babel'])
}
