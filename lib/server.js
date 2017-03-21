const express = require('express')
const server = express()

module.exports = server

server.set('port', process.env.PORT || 3000)
server.locals.title = "QS BackEnd"
server.locals.foods = []

server.get('/api/foods', (request, response) => {
  response.status(200).json(server.locals.foods)
})