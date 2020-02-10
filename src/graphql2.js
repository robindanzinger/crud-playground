const { ApolloServer, gql } = require('apollo-server-express')
// const { typeDefs, resolvers } = require('./schema')
const typeDefs = require('./types.gql')
const mongoose = require('mongoose')

const Schema = mongoose.Schema
const authorMschema = new mongoose.Schema({
  name: String
})
const bookMschema = new mongoose.Schema({
  title: String,
  author: { type: Schema.Types.ObjectId, ref: 'author' }
})

const authorM = mongoose.model('author', authorMschema)
const bookM = mongoose.model('book', bookMschema)

const url = 'mongodb://127.0.0.1:27017/testdb'
mongoose.connect(url, { useNewUrlParser: true })
const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})


const model = {
  books: bookM,
  authors: authorM,
}

const server = new ApolloServer({
  typeDefs: typeDefs.schema,
  resolvers: typeDefs.resolvers(model),
  playground: true,
})

async function initDb() {
  const rowling = new authorM({
    name: 'J.K. Rowling'
  })
  const rid = await rowling.save()
  const crichton = new authorM({
    name: 'Michael Crichton'
  })
  const cid = await crichton.save()

  // Testdata
  const hp = new bookM({
    title: 'Harry Potter and the Chamber of Secrets',
    author: rid['_id'],
  })

  const jp = new bookM({
    title: 'Jurassic Park',
    author: cid['_id'],
  })
  hp.save()
  jp.save()
}

initDb()

module.exports = function(app) {
  console.log('apply middleware')
  server.applyMiddleware({ app, path: '/graphql2' })
}

