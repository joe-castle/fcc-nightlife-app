function afunction(array, namespace) {
  let keys;

  let _keys;
  try {
    _keys = require('../_keys');
  } catch (e) {
    _keys = { twitterStrategy: {} };
  }
}