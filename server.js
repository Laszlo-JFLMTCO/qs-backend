const express = require('express')
const server = express()
const bodyParser = require('body-parser')

module.exports = server

server.set('port', process.env.PORT || 3000)
server.locals.title = "QS BackEnd"
server.locals.foods = []

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended: true}))

if (!module.parent) {
  server.listen(server.get('port'), () => {
    console.log(`${server.locals.title} is running on ${server.get('port')}.`)
  })
}

function newFood(newFoodDetails){
  return {
    id: Date.now(),
    name: newFoodDetails.name,
    calories: newFoodDetails.calories
  }
}

function addToFoods(newFoodDetails){
  server.locals.foods.push(newFood(newFoodDetails))
  return server.locals.foods[server.locals.foods.length - 1]
}

server.get('/api/foods', (request, response) => {
  response.status(200).json(server.locals.foods)
})

server.post('/api/foods', (request, response) => {
  const newFoodDetails = {name: request.body.name, calories: request.body.calories}

  response.status(200).json(addToFoods(newFoodDetails))
})