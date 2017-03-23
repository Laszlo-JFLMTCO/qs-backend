const assert = require('chai').assert
const request = require('request')
const environment = process.env.NODE_ENV || 'test'
const configuration = require('../knexfile')[environment]
const database = require('knex')(configuration)

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
      database.raw('TRUNCATE foods RESTART IDENTITY')

      database.raw('INSERT INTO foods (name, calories) VALUES (?, ?)', ['test', 111])
        //   // .then(() => done()))
          .then(() => {
            database.raw('SELECT * FROM foods')
              .then(data => {
                console.log(data.rowCount)
              })
          })
        .then(() => done())
        //     done()
        //   }))
    })
    it('should return all foods items', (done) => {
      const food = {id: Date.now(), name: 'FoodName', calories: 'FoodCalories'}
      server.locals.foods = [food]
      this.request.get('/api/foods', (error, response) => {
        if (error) { done(error) }
        foods = JSON.parse(response.body)
        assert.equal(foods.length, 1)
        assert.equal(foods[0].id, food.id)
        assert.equal(foods[0].name, food.name)
        assert.equal(foods[0].calories, food.calories)
        done()
      })
    })
  })

  describe('GET /api/foods/:id', () => {
    before(() => {
      const food = {id: Date.now(), name: 'FoodName', calories: 'FoodCalories'}
      server.locals.foods = [food]
    })
    it('should return details of a single food item for valid id', (done) => {
      const expectedFood = server.locals.foods[0]
      const requestPath = '/api/foods/' + expectedFood.id
      this.request.get(requestPath, (error, response) => {
        if (error) { done(error) }
        returnedFood = JSON.parse(response.body)
        assert.equal(response.statusCode, 200)
        assert.equal(returnedFood.id, expectedFood.id)
        assert.equal(returnedFood.name, expectedFood.name)
        assert.equal(returnedFood.calories, expectedFood.calories)
        done()
      })
    })
    it('should return HTTP status 404 for invalid id', (done) => {
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