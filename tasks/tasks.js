/*
 * grunt-tasks-lister
 * https://github.com/gigafied/grunt-tasks-lister
 *
 * Copyright (c) 2013 Taka Kojima
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerTask('tasks', 'A grunt task to show all tasks and multi task options.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({});

    var done = this.async();
    var path = require('path');

    // Initialize task system so that the tasks can be listed.
    grunt.task.init([], {help: true});

    // Build 2-column array for table view.
    var col1len = 0;
    var opts = Object.keys(grunt.cli.optlist).map(function (long) {
            var o = grunt.cli.optlist[long];
            var col1 = '--' + (o.negate ? 'no-' : '') + long + (o.short ? ', -' + o.short : '');
            col1len = Math.max(col1len, col1.length);
            return [col1, o.info];
    });

    var taskNames = Object.keys(grunt.task._tasks).sort();

    var tasks = taskNames.map(function (name) {
            var arr = [];
            col1len = Math.max(col1len, name.length);
            var info = grunt.task._tasks[name].info;
            if (grunt.task._tasks[name].multi || name === "watch") {
                    info += ' *';

                    var config = grunt.config.get([name]);
                    if (config) {
                            arr.push(config);

                            for (var key in config) {
                                    col1len = Math.max(col1len, (name + ":" + key).length);
                            }
                    } else {
                            arr.push("none");
                    }
            }
            return [name, info].concat(arr);
    });

    // Widths for options/tasks table output.
    var widths = [1, col1len, 2, 76 - col1len];

    grunt.log.writeln();
    tasks.forEach(function (a) {
            var b = a[0].split(":"),
                    c = a[1],
                    opts = a[2];

            if (b.length > 1) {
                    b[0] = b[0].grey;
                    b[1] = b[1].white;
            }

            b = b.join(":");

            if (b !== "tasks" && (!opts || opts !== "none")) {
                    grunt.log.writetableln(widths, ['', b.white, '', c.cyan]);

                    if (opts) {
                            for (var key in opts) {
                                    if (key !== "" && opts.hasOwnProperty(key)) {
                                            grunt.log.writetableln(widths, ['', b.grey + (":" + key).white, '', '']);
                                    }
                            }
                    }
            }
    });
    grunt.log.writeln();

    done();

  });

};
