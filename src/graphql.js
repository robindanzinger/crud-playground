const { ApolloServer, gql } = require('apollo-server-express')
const mongoose = require('mongoose')
const typeDefs = require('./types.gql')
const models = require('./model')

const url = 'mongodb://127.0.0.1:27017/testdb'
mongoose.connect(url, { useNewUrlParser: true })
const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})

const server = new ApolloServer({
  typeDefs: typeDefs.schema,
  resolvers: typeDefs.resolvers(models),
  playground: true,
})

module.exports = {
  applyMiddleware: (app) => {
    server.applyMiddleware({ app, path: '/graphql' })
  },
  server,
  db,
}

