const { ApolloServer } = require('apollo-server-express')

const database = require('../database')
database.connect()

const authController = require('../controller/auth.controller')

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  async context({ req }) {
    const token = req.headers.authorization || ''
    let user = undefined
    if (token) {
      const AuthController = new authController()
      user = await AuthController.getUser(token.replace('Bearer ', ''))
    }
    return {
      _token: token.replace('Bearer ', ''),
      user
    }
  }
})
module.exports = server
