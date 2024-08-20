const { ObjectId } = require("mongodb");
const database = require("../configs/mongodb");

module.exports = class Follow {
    static async addFollow(followingId, followerId) {
        console.log(followingId, "<<<FOLLOWINGID");
        console.log(followerId, "<<<FOLLOWERID");

        const now = new Date();

        const existingFollow = await database.collection('follows').findOne({
            followerId: new ObjectId(followerId),
            followingId: new ObjectId(followingId)
        });

        if (existingFollow) {
            console.log('Follow relationship already exists');
            return existingFollow;
        }

        const followData = {
            createdAt: now,
            updatedAt: now,
            followerId: new ObjectId(followerId),
            followingId: new ObjectId(followingId)
        };

        const result = await database.collection('follows').insertOne(followData);
        return result.ops[0];
    }
};
