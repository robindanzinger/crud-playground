const express = require('express')
const app = express()
const movieRouter = require('./router')
const graphql2 = require('./graphql2')

app.use('/movie', movieRouter)

graphql2(app)

app.listen(8080, () => {
  console.log('Server listening on port 8080')
})
