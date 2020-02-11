const express = require('express')
const app = express()
const graphql = require('./graphql').applyMiddleware
const createSampleData = require('./sampledata')

graphql(app)

createSampleData()

app.listen(8080, () => {
  console.log('Server listening on port 8080')
})
