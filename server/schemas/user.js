const User = require('../models/User');
const { ObjectId } = require('mongodb');
const { hashPassword, checkPassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');

const typeDefs = `#graphql
  type User {
    _id: ID
    name: String
    username: String
    email: String
    password: String
    follower:[Follow]
    followerDetail: [FollowDetail]
    following:[Follow]
    followingDetail: [FollowDetail]
  }
  type FollowDetail{
    _id:ID
    name: String
    username: String
  }

input NewUser{
    name:String
    username: String
    email:String
    password:String
}
input UserLogin{
    username:String
    password:String
}

type AccessToken{
    access_token:String,
    userId:String
}

type Query{
    userById(_id:ID):User
    searchUser(username:String):[User]
}

type Mutation{
    register(user:NewUser):User
    login(user:UserLogin):AccessToken
}
`;

const resolvers = {
    Query: {
        userById: async (_, args) => {
            const { _id } = args
            const user = await User.findById(_id)
            return user
        },
        searchUser: async (_, args, { auth }) => {
            auth()
            const { username } = args
            console.log(username, "<<<USERNAME");
            const user = await User.search(username)
            console.log(user, "<<USER");
            return user
        }
    },
    Mutation: {
        register: async (_, args) => {
            const newUser = { ...args.user }
            if (!newUser.password) throw new Error('Password is required')
            if (newUser.password.length < 5) throw new Error('Password must be more than 5 characther')
            const hashedPassword = hashPassword(newUser.password)
            newUser.password = hashedPassword

            const result = await User.create(newUser)
            return result
        },
        login: async (_, args) => {
            console.log(args, "<<<ARGS");
            try {

                const data = { ...args.user }
                if (!data.username) throw new Error('Username is required')
                if (!data.password) throw new Error('Password is required')
                const user = await User.findOne({ username: data.username })
                if (!user) throw new Error("Invalid User")
                let check = checkPassword(data.password, user.password);
                if (check === false) throw new Error("Invalid User")
                var token = signToken({ _id: new ObjectId(String(user._id)), username: data.username }, process.env.JWT_SECRET);
                console.log(token, "<<<TOKEN");
                return { access_token: token, userId: user._id }
            } catch (error) {
                console.log(error.message)
                throw new Error(error.message)
            }
        }
    }
}

module.exports = { typeDefs, resolvers }
