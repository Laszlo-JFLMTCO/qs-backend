const express = require('express')
const server = express()
const bodyParser = require('body-parser')

const databaseService = require('./lib/models/database-service')

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

function newFood(newFoodDetails, requestedId){
  const newId = requestedId || Date.now()
  return {
    id: newId,
    name: newFoodDetails.name,
    calories: newFoodDetails.calories
  }
}

function addToFoods(newFoodDetails){
  server.locals.foods.push(newFood(newFoodDetails))
  return server.locals.foods[server.locals.foods.length - 1]
}

function findFood(requestedId){
  result = null
  server.locals.foods.forEach((food) => {
    if (food.id == requestedId) {
      result = food
    }
  })
  return result
}

function findFoodIndex(food){
  return server.locals.foods.indexOf(food)
}

function updateFoodItem(newFoodDetails, requestedId){
  const updatedFood = newFood(newFoodDetails, requestedId)
  const indexOfUpdatedFood = findFoodIndex(findFood(requestedId))
  server.locals.foods[indexOfUpdatedFood] = updatedFood
  return server.locals.foods[indexOfUpdatedFood]
}

function deleteFoodItem(requestedId){
  const indexOfFoodToDelete = findFoodIndex(findFood(requestedId))
  server.locals.foods.splice(indexOfFoodToDelete, 1)
  return server.locals.foods.length
}

server.get('/api/foods', (request, response) => {
  databaseService.returnAllEntries('foods')
    .then(data => {
      response.status(200).json(
        data.rows
      )
    })
})

server.get('/api/foods/:id', (request, response) => {
  const searchResult = findFood(request.params.id)
  if (searchResult) {
    return response.status(200).json(searchResult)
  } else {
    return response.sendStatus(404)
  }
})

server.post('/api/foods', (request, response) => {
  if (request.body.name && request.body.calories){
    const newFoodDetails = {name: request.body.name, calories: request.body.calories}
    return response.status(200).json(addToFoods(newFoodDetails))
  } else {
    return response.status(422).json({
      status: 422,
      details: 'Food detail missing'
    })
  }
})

server.put('/api/foods/:id', (request, response) => {
  const newFoodDetails = {name: request.body.name, calories: request.body.calories}  
  return response.status(200).json(updateFoodItem(newFoodDetails, request.params.id))
})

server.delete('/api/foods/:id', (request, response) => {
  const foodCountBeforeDelete = server.locals.foods.length
  const foodCountAfterDelete = deleteFoodItem(request.params.id)
  if ((foodCountBeforeDelete - foodCountAfterDelete) === 1) {
    return response.sendStatus(200)
  } else {
    return response.sendStatus(500)
  }
})