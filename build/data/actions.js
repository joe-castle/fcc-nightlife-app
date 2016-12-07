'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (hash) {
  return {
    exists: function exists(field) {
      return _client2.default.hexistsAsync(hash, field);
    },
    del: function del(field) {
      return _client2.default.hdel(hash, field);
    },
    set: function set(field, value) {
      return _client2.default.hset(hash, field, JSON.stringify(value));
    },
    get: function get(field) {
      return _client2.default.hgetAsync(hash, field).then(JSON.parse);
    },
    getAll: function getAll() {
      return _client2.default.hgetallAsync(hash);
    }
  };
};