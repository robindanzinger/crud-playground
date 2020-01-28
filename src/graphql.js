const buildSchema = require('graphql').buildSchema
const movieModel = require('./model')
const graphqlHTTP = require('express-graphql')

const schema = buildSchema(`
  type Movie {
    id: Int!
    title: String!
    year: Int
    public: Int
    user: Int
  }
  input MovieInput {
    title: String!
    year: Int
    public: Int
    user: Int
  }
  type Query {
    movie: [Movie]
  }
  type Mutation {
    createMovie(movie: MovieInput): Movie
  }
`)


const rootValue = {
  movie() {
    return movieModel.getAll({ userId: 1})
  },
  createMovie ({movie}) {
    return movieModel.save(movie, 1)
  }
}

module.exports = function(app) {
  app.use('/graphql', graphqlHTTP( {schema, rootValue, graphiql: true}))
}
