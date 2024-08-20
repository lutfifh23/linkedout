const Follow = require("../models/Follow");

const typeDefs = `#graphql
  type Follow {
    _id: ID
    followingId: String
    followerId: String
    createdAt: String
    updatedAt: String
  }

    type Query {
    follows: [Follow]
  }
  type Mutation{
    following(_id:String):String
  }
`;

const resolvers = {
  Query: {
    follows: async (_, args) => {
      const follower = await Follow.getAll()
      return follower
    }
  },
  Mutation: {
    following: async (_, args, contextValue) => {
      const { _id } = args
      const user = contextValue.auth();
      console.log(user, "<<<ISIUSERAPA");
      console.log({ _id }, "<<<KALAUID");
      try {
        const result = await Follow.addFollow(_id, user._id);
        console.log('Follow result:', result);
        return 'success';
      } catch (error) {
        console.error('Error following user:', error.message);
        if (!user || !user._id || !_id) {
          throw new Error('Invalid user or target user ID');
        }
        throw new Error('Failed to follow user');
      }
    }
  }
}

module.exports = { typeDefs, resolvers }