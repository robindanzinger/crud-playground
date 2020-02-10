const { ApolloServer, gql } = require('apollo-server-express')
const typeDefs = require('./types.gql')
const mongoose = require('mongoose')

const Schema = mongoose.Schema
const authorMschema = new mongoose.Schema({
  name: String,
  books: [{ type: Schema.Types.ObjectId, ref: 'book' }]
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

// Testdata
async function initDb() {

  await authorM.deleteMany()
  await bookM.deleteMany()

  // authors
  const rowling = new authorM({
    name: 'J.K. Rowling'
  })
  const rid = await rowling.save()
  const crichton = new authorM({
    name: 'Michael Crichton'
  })
  const cid = await crichton.save()

  // books
  const hp1 = new bookM( {
    title: 'The Philosopher\'s Stone',
    author: rid._id,
  })

  const hp2 = new bookM({
    title: 'Harry Potter and the Chamber of Secrets',
    author: rid._id,
  })

  const jp = new bookM({
    title: 'Jurassic Park',
    author: cid._id,
  })

  hp1.save()
  hp2.save()
  jp.save()
}

initDb()

module.exports = function(app) {
  server.applyMiddleware({ app, path: '/graphql' })
}

