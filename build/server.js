'use strict';

var _server = require('./routes/server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var port = process.env.PORT || 3000;

_server2.default.listen(port, function () {
  console.log('Express server listening on port:', port);
});