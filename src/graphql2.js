const { ApolloServer, gql } = require('apollo-server-express')
// const { typeDefs, resolvers } = require('./schema')
const typeDefs = require('./types.gql')

const resolvers = {
  Query: {
    books: () => books,
  },
  Book: {
    author(book) {
      return authors[book.author]
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
})

const authors = {
  234: {name: 'J.K. Rowling'},
  119: {name: 'Michael Crichton'},
}

const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 234,
  },
  {
    title: 'Jurassic Park',
    author: 119,
  },
]

module.exports = function(app) {
  console.log('apply middleware')
  server.applyMiddleware({ app, path: '/graphql2' })
}

