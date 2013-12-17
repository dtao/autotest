var fs       = require('fs'),
    path     = require('path');
    Mustache = require('mustache'),
    Autotest = require('./autotest');

Autotest.templateEngine = Mustache;

function handleError(message) {
  if (message) {
    var error = new Error(message);
    console.error(error.stack);
    process.exit();
  }
}

function readFile(path, callback) {
  fs.readFile(path, 'utf-8', function(err, data) {
    handleError(err);
    callback(data);
  });
}

function loadTemplates(callback) {
  fs.readdir('templates', function(err, files) {
    handleError(err);

    var templates = {},
        fileCount = files.length,
        filesRead = 0;

    files.forEach(function(file) {
      var templateName = path.basename(file, '.js.mustache');

      readFile(path.join('templates', file), function(data) {
        templates[templateName] = data;

        if (++filesRead === fileCount) {
          callback(templates);
        }
      });
    });
  });
}

loadTemplates(function(templates) {
  Autotest.templates = templates;

  readFile('example.js', function(data) {
    var example = Autotest.Example.parse(data);
    console.log(JSON.stringify(example, null, 2));
  });
});
