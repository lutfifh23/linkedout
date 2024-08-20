
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_KEY;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const database = client.db('GC1_LinkedOut')
module.exports = database