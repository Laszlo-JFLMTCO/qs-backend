const assert = require('chai').assert
const request = require('request')

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

})