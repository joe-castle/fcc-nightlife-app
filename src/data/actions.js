import client from './client';

export default hash => ({
  exists: field => client.hexistsAsync(hash, field),
  del: field => client.hdel(hash, field),
  set: (field, value) => client.hset(hash, field, JSON.stringify(value)),
  get: field => client.hgetAsync(hash, field).then(JSON.parse),
  getAll: () => client.hgetallAsync(hash).then(data => (
    data && Object
      .keys(data)
      .map(x => JSON.parse(data[x]))
  )),
});
