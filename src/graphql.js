const buildSchema = require('graphql').buildSchema
const graphqlHTTP = require('express-graphql')
const model = require('./mongomodelmanual')

const schema = buildSchema(`
  type Movie {
    _id: ID!
    title: String!
    rating: [Rating]
  }
  type Rating {
    user: User
    rate: Int
  }
  type Address {
    street: String
    city: String
  }
  type User {
    _id: String
    name: String
    address: Address
  }
  type Query {
    movies: [Movie]
    users: [User]
    user(id: String): User
    movie(id: String): Movie
  }
`)


const rootValue = {
  movies(obj, args, context, info) {
    return model.getMovie({})
  },
  users() {
    return model.getUser({})
  },
  async User({_id}) {
    console.log('ask for USER')
    return (await model.getUser({_id}))[0]
  },
  async user({id}, args, context, info) {
    console.log("ask for user")
    return (await model.getUser())[0]
  },
  async changeMovie({movie}) {
    const res = await model.updateMovie(movie)
    return `changed ${movie._id} and result is ${res}`
  },
  async removeMovie({movie}) {
    await model.removeMovie(movie)
    return "should be removed"
  }
}

module.exports = function(app) {
  app.use('/graphql', graphqlHTTP( {schema, rootValue, graphiql: true}))
}
