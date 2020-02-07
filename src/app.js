const express = require('express')
const app = express()
const movieRouter = require('./router')
const graphql = require('./graphql')
const graphql2 = require('./graphql2')

app.use('/movie', movieRouter)

graphql(app)
graphql2(app)

app.listen(8080, () => {
  console.log('Server listening on port 8080')
})
