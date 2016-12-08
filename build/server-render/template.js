'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _server = require('react-dom/server');

exports.default = function (el, state) {
  return '<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="utf-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <meta name="description" content="UPDATE_DESCRIPTION">\n    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css" integrity="sha384-AysaV+vQoT3kOAXZkl02PThvDr8HYKPZhNT5h/CXfBThSRXQ6jW5DO2ekP5ViFdi" crossorigin="anonymous">\n    <link href="/assets/bundle.css" rel="stylesheet">\n    <title>FCC Nightlife Coordination App</title>\n  </head>\n  <body>\n    <div id="root">' + (0, _server.renderToString)(el) + '</div>\n    <script>\n      window.__INITIAL_STATE__ = ' + JSON.stringify(state) + '\n    </script>\n    <script src="/assets/bundle.js"></script>\n  </body>\n</html>';
};