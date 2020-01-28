const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
  res.send('My first express application')
})

module.exports = router
