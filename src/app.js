const express = require('express')
const app = express()
const movieRouter = require('./router')
const graphql = require('./graphql')

app.use('/movie', movieRouter)

graphql(app)

app.listen(8080, () => {
  console.log('Server listening on port 8080')
})
