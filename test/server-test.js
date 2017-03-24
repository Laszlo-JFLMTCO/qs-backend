const assert = require('chai').assert
const request = require('request')

const databaseService = require('../lib/models/database-service')

const server = require('../server')

describe('QS-Server', () => {
  before((done) => {
    this.port = 9876
    this.server = server.listen(this.port, (error, result) => {
      if (error) {done(error)}
      done()
    })

    this.request = request.defaults({
      baseUrl: 'http://localhost:9876'
    })
  })

  after(() => {
    this.server.close()
  })

  it('should exist', () => {
    assert(server)
  })

  describe('GET /api/foods', () => {
    beforeEach((done) => {
      databaseService.clearDatabase().then(() => {
      databaseService.addToDatabase('foods', 'FoodName', 100)
        .then(() => done())
      })
    })
    it('should return all foods items', (done) => {
      this.request.get('/api/foods', (error, response) => {
        if (error) { done(error) }
        foods = JSON.parse(response.body)
        databaseService.returnAllEntries('foods')
          .then(data => {
            expectedResponse = data.rows

            assert.equal(foods.length, 1)
            assert.equal(foods[0].id, expectedResponse[0].id)
            assert.equal(foods[0].name, expectedResponse[0].name)
            assert.equal(foods[0].calories, expectedResponse[0].calories)
            done()
          })
      })
    })
  })

  describe('GET /api/foods/:id', () => {
    beforeEach((done) => {
      databaseService.clearDatabase().then(() => {
      databaseService.addToDatabase('foods', 'FoodName', 100)
        .then(() => done())
      })
    })
    it('should return details of a single food item for valid id', (done) => {
      this.request.get('/api/foods/1', (error, response) => {
        if (error) { done(error) }
        returnedFood = JSON.parse(response.body)
        databaseService.returnOneEntryById('foods', 1)
          .then(expectedFood => {
            assert.equal(response.statusCode, 200)
            assert.equal(returnedFood.id, expectedFood.rows[0].id)
            assert.equal(returnedFood.name, expectedFood.rows[0].name)
            assert.equal(returnedFood.calories, expectedFood.rows[0].calories)
            done()
          })
      })
    })
    it('should return HTTP status 404 for id not in database', (done) => {
      const requestPath = '/api/foods/2'
      this.request.get(requestPath, (error, response) => {
        if (error) { done(error) }
        assert.equal(response.statusCode, 404)
        done()
      })
    })
    it('should return HTTP status 404 when string is entered for id', (done) => {
      const requestPath = '/api/foods/invalid'
      this.request.get(requestPath, (error, response) => {
        if (error) { done(error) }
        assert.equal(response.statusCode, 404)
        done()
      })
    })
  })

  describe('POST /api/foods', () => {
    beforeEach(() => {
      server.locals.foods = []
    })
    it('should store the submitted food item', (done) => {
      const newFood = {name: 'NewName', calories: 'NewCalories'}
      this.request.post('/api/foods', {form: newFood}, (error, response) => {
        if (error) { done(error) }
        const addedToFoods = server.locals.foods[0]
        assert.equal(response.statusCode, 200)
        assert.equal(server.locals.foods.length, 1)
        assert.equal(addedToFoods.name, newFood.name)
        assert.equal(addedToFoods.calories, newFood.calories)
        const requestResponse = JSON.parse(response.body)
        assert.equal(requestResponse.id, addedToFoods.id)
        assert.equal(requestResponse.name, addedToFoods.name)
        assert.equal(requestResponse.calories, addedToFoods.calories)
        done()
      })
    })
    it('should return JSON with error if food details are missing', (done) => {
      this.request.post('/api/foods', (error, response) => {
        if (error) { done(error) }
        const message = JSON.parse(response.body)
        assert.equal(message.status, 422)
        assert.equal(message.details, 'Food detail missing')
        done()
      })
    })
  })

  describe('PUT /api/foods/:id', () => {
    before(() => {
      const food = {id: Date.now(), name: 'FoodName', calories: 'FoodCalories'}
      server.locals.foods = [food]
    })
    it('should update food with specific ID', (done) => {
      foodToUpdate = server.locals.foods[0]
      foodToUpdate.name = "UpdatedName"
      foodToUpdate.calories = "UpdatedCalories"
      const requestPath = '/api/foods/' + foodToUpdate.id
      this.request.put(requestPath, {form: foodToUpdate}, (error, response) => {
        if (error) { done(error) }
        returnedFood = JSON.parse(response.body)
        assert.equal(response.statusCode, 200)
        assert.equal(returnedFood.id, foodToUpdate.id)
        assert.equal(returnedFood.name, foodToUpdate.name)
        assert.equal(returnedFood.calories, foodToUpdate.calories)
        done()
      })
    })
  })

  describe('DELETE /api/foods/:id', () => {
    before((done) => {
      food = {id: Date.now(), name: 'FoodName', calories: 'FoodCalories'}
      server.locals.foods = [food]
      setTimeout(() => {
        food = {id: Date.now(), name: 'SecondFoodName', calories: 'SecondFoodCalories'}
        server.locals.foods.push(food)
        done()
      }, 50)
    })
    it('should delete food with specific ID when foods list has TWO items', (done) => {
      foodToDelete = server.locals.foods[0]
      const requestPath = '/api/foods/' + foodToDelete.id
      this.request.delete(requestPath, (error, response) => {
        if (error) { done(error) }
        assert.equal(response.statusCode, 200)
        assert.equal(server.locals.foods.length, 1)
        done()
      })
    })
    it('should delete food with specific ID when foods list has ONE item', (done) => {
      foodToDelete = server.locals.foods[0]
      const requestPath = '/api/foods/' + foodToDelete.id
      this.request.delete(requestPath, (error, response) => {
        if (error) { done(error) }
        assert.equal(response.statusCode, 200)
        assert.equal(server.locals.foods.length, 0)
        done()
      })
    })
  })

})