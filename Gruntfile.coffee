module.exports = (grunt) ->

  # Project configuration
  grunt.initConfig
    coffee:
      compile:
        files:
          'lib/ostest.js': 'src/ostest.coffee'

  # Load the plugin that provides the "compile" task
  grunt.loadNpmTasks 'grunt-contrib-coffee'

  # Default task(s)
  grunt.registerTask 'default', ['coffee']
