module.exports = (grunt) ->

  # Project configuration
  grunt.initConfig
    coffee:
      compile:
        files:
          'lib/ostest.js': 'src/ostest.coffee'

    jshint:
      all: ['lib/**/*.js']

  # Load grunt plugins
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-jshint'

  # Default task(s)
  grunt.registerTask 'default', ['coffee', 'jshint']
