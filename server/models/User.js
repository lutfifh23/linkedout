const { ObjectId } = require("mongodb")
const database = require("../configs/mongodb");
const isEmail = require("../helpers/isEmail");

module.exports = class User {
    static async validateUsername(username) {
        return await database.collection("users").findOne({ username: username });
    }
    static async validateEmail(email) {
        return await database.collection("users").findOne({ email: email });
    }
    static async create(newUser) {
        if (!newUser.username) throw new Error("Username required");
        const dataByUsername = await this.validateUsername(newUser.username);
        if (dataByUsername) throw new Error("Username must be unique!");

        if (!newUser.email) throw new Error("Email required");

        const emailFormat = isEmail(newUser.email);
        if (!emailFormat) throw new Error("Invalid email format");

        const dataByEmail = await this.validateEmail(newUser.email);
        if (dataByEmail) throw new Error("Email must be unique!");
        await database.collection("users").insertOne(newUser)
        return newUser
    }
    static async findById(_id) {
        const agg = [
            {
                '$match': {
                    _id: new ObjectId(String(_id))
                }
            }, {
                '$lookup': {
                    'from': 'follows',
                    'localField': '_id',
                    'foreignField': 'followingId',
                    'as': 'follower'
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'follower.followerId',
                    'foreignField': '_id',
                    'as': 'followerDetail'
                }
            }, {
                '$lookup': {
                    'from': 'follows',
                    'localField': '_id',
                    'foreignField': 'followerId',
                    'as': 'following'
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'following.followingId',
                    'foreignField': '_id',
                    'as': 'followingDetail'
                }
            }
        ]
        const user = await database.collection('users').aggregate(agg).toArray()
        return user[0]
    }
    static async findOne(userLogin) {
        const data = await database.collection("users").findOne(userLogin)
        return data
    }
    static async search(q) {
        console.log(q, '<<<USERNAMEMOD');
        const user = await database.collection('users').aggregate([
            {
                $match: {
                    $or: [
                        {
                            username: {
                                $regex: q,
                                $options: 'i'
                            }
                        }
                    ]
                }
            }
        ]).toArray()
        return user
    }
}