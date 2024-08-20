const redis = require("../configs/redis");
const Posts = require("../models/Posts");

const typeDefs = `#graphql
  type AuthorDetail{
    username:String
    email:String
    _id:ID
  }
  type Posts {
    _id: ID
    content: String
    tags: [String]
    imgUrl: String
    authorId: String
    author: AuthorDetail
    comments: [Comments]
    likes: [Likes]
    createdAt: String
    updatedAt: String
  }
  type Comments{
    content: String
    username: String
    createdAt: String
    updatedAt: String
  }
  type Likes{
    username: String
    createdAt: String
    updatedAt: String
  }

  type Query {
    posts: [Posts]
    postsById(_id:ID):Posts
  }
  type Mutation{
    addPost(content:String, tags:[String], imgUrl:String):String
    addComment(content:String, postsId:String):String
    addLike(postsId:String):String
  }
`;

const resolvers = {
  Query: {
    posts: async (_, __, { auth }) => {
      auth()
      const postCache = await redis.get('posts:all')
      if (postCache) {
        console.log('dari redis');
        return JSON.parse(postCache)
      }
      const posts = await Posts.getAll()
      console.log('dari mongodb');
      await redis.set('posts:all', JSON.stringify(posts))
      return posts
    },
    postsById: async (_, args) => {
      const { _id } = args
      const post = await Posts.postById(_id)
      return post
    }
  },
  Mutation: {
    addPost: async (_, args, contextValue) => {
      const user = contextValue.auth();
      const { content, tags, imgUrl } = args
      if (!content) throw new Error('Content is required')
      if (!user._id) throw new Error('Author is empty')
      await Posts.create({ content, tags, imgUrl }, user._id)
      await redis.del('posts:all')
      return 'success'
    },
    addComment: async (_, args, contextValue) => {
      const { content, postsId } = args
      const { username } = contextValue.auth()
      if (!content) throw new Error('Content is required')
      if (!username) throw new Error('username is empty')
      const result = await Posts.addComment({ content, username }, postsId)
      await redis.del('posts:all')
      return result
    },
    addLike: async (_, args, contextValue) => {
      const { postsId } = args
      const { username } = contextValue.auth()
      if (!username) throw new Error('username is empty')
      const result = await Posts.like({ username }, postsId)
      await redis.del('posts:all')
      return result
    }
  }
}

module.exports = { typeDefs, resolvers }