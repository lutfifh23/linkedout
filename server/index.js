require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { verifyToken } = require('./helpers/jwt');

const {
    typeDefs: userTypeDefs,
    resolvers: userResolvers
} = require('./schemas/user');

const {
    typeDefs: postTypeDefs,
    resolvers: postResolvers
} = require('./schemas/posts');

const {
    typeDefs: followsTypeDefs,
    resolvers: followsResolvers
} = require('./schemas/follow');

const server = new ApolloServer({
    introspection: true,
    typeDefs: [userTypeDefs, postTypeDefs, followsTypeDefs],
    resolvers: [userResolvers, postResolvers, followsResolvers],
});

startStandaloneServer(server, {
    listen: { port: process.env.PORT || 3000 },
    context: ({ req, res }) => {
        return {
            msg: "hello world",
            auth: () => {
                const auth = req.headers.authorization
                if (!auth) throw new Error('Unauthenticated')
                const [type, token] = auth.split(' ')
                if (type !== "Bearer") throw new Error('Invalid token')
                const decoded = verifyToken(token)
                return decoded
            }
        }
    }
}).then(({ url }) => {
    console.log(`🚀  Server ready at: ${url}`);
})
