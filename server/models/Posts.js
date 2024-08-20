const { ObjectId } = require("mongodb")
const database = require("../configs/mongodb")

module.exports = class Posts {
    static async create(newPost, authorId) {
        newPost.createdAt = newPost.updatedAt = new Date()
        newPost.authorId = new ObjectId(String(authorId))
        await database.collection('posts').insertOne(newPost)
        return newPost
    }
    static async getAll() {
        const agg = [
            {
                $lookup: {
                    from: 'users',
                    localField: 'authorId',
                    foreignField: '_id',
                    as: 'author'
                }
            }, {
                $unwind: {
                    path: '$author',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $unset: ['author.password']
            }, {
                $sort: {
                    '_id': -1
                }
            }
        ]
        const posts = await database.collection('posts').aggregate(agg).toArray()
        return posts
    }
    static async addComment(payload, postId) {
        payload.createdAt = payload.updatedAt = new Date()
        console.log(payload, postId, "<<<INIAPA");
        await database.collection('posts').updateOne({
            _id: new ObjectId(String(postId))
        },
            {
                $push: {
                    comments: payload
                }
            })
        return 'success'
    }
    static async like(payload, postId) {
        payload.createdAt = payload.updatedAt = new Date()
        await database.collection('posts').updateOne({
            _id: new ObjectId(String(postId))
        },
            {
                $push: {
                    likes: payload
                }
            })
        return 'success likes'
    }
    static async postById(_id) {
        const agg = [
            {
                $match: {
                    _id: new ObjectId(String(_id))
                }
            }, {
                $lookup: {
                    from: 'users',
                    localField: 'authorId',
                    foreignField: '_id',
                    as: 'author'
                }
            }, {
                $unwind: {
                    path: '$author',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $unset: ['author.password']
            }, {
                $sort: {
                    '_id': -1
                }
            }
        ]
        const posts = await database.collection('posts').aggregate(agg).toArray()
        return posts[0]
    }
}