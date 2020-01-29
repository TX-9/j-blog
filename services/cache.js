const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const keys = require('../config/keys');

const client = redis.createClient(keys.redisUrl);
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = async function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');
    return this; //query instance is chainable
}
mongoose.Query.prototype.exec = async function () {
    console.log('ABOUT TO RUN A QUERY');
    console.log(this.getQuery());
    console.log(this.mongooseCollection.name);
    // this is reference to Query
    if (!this.useCache) {
        return exec.apply(this, arguments);
    }
    const key = JSON.stringify(Object.assign({}, this.getQuery(),
        {collection: this.mongooseCollection.name}));

    // See if there is a value for 'key' in redis
    const cacheValue = await client.hget(this.hashKey, key);

    // If do, return that
    if (cacheValue) {
        const doc = JSON.parse(cacheValue);
        // new this.model(JSON.parse(cacheValue) === new Blog({title:'new', content:'hi});
        return Array.isArray(doc)
            ? doc.map(d => new this.model(d)) : new this.model(doc);

    }

    // Otherwise, issue the query and store the result in redis
    const result = await exec.apply(this, arguments);

    client.hmset(this.hashKey, key, JSON.stringify(result), 'EX', 10);
    console.log('result--------', result);
    return result;
};

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
};