const Redis = require('ioredis')
const redis = new Redis({
    port: 10901,
    host: 'redis-10901.c89.us-east-1-3.ec2.redns.redis-cloud.com',
    username: 'default',
    password: process.env.REDIS_KEY,
    db: 0
})

module.exports = redis