const buildSchema = require('graphql').buildSchema
const movieModel = require('./model')
const graphqlHTTP = require('express-graphql')

const schema = buildSchema(`
  type Movie {
    id: String!
    title: String!
    year: Int
    public: Int
    user: Int
    director: Director
  }
  type Director {
    id: String
    name: String
  }
  input MovieInput {
    title: String!
    year: Int
    public: Int
    user: Int
    director: String 
  }
  type Query {
    movie: [Movie]
    director: [Director]
  }
  type Mutation {
    createMovie(movie: MovieInput): Movie
  }
`)


const rootValue = {
  movie() {
    return movieModel.getAll({ userId: 1})
  },
  director() {
    return movieModel.getDirectors({})
  },
  createMovie ({movie}) {
    return movieModel.save(movie, 1)
  }
}

module.exports = function(app) {
  app.use('/graphql', graphqlHTTP( {schema, rootValue, graphiql: true}))
}
