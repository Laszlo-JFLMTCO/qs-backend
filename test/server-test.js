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

  describe('POST /api/foods', () => {
    beforeEach(() => {
      server.locals.foods = []
    })
    it('should store the submitted food item', (done) => {
      const newFood = {name: 'NewName', calories: 'NewCalories'}
      this.request.post('/api/foods', {form: newFood}, (error, response) => {
        if (error) { done(error) }
        addedToFoods = server.locals.foods[0]
        assert.equal(response.statusCode, 200)
        assert.equal(server.locals.foods.length, 1)
        assert.equal(addedToFoods.name, newFood.name)
        assert.equal(addedToFoods.calories, newFood.calories)
        requestResponse = JSON.parse(response.body)
        assert.equal(requestResponse.id, addedToFoods.id)
        assert.equal(requestResponse.name, addedToFoods.name)
        assert.equal(requestResponse.calories, addedToFoods.calories)
        done()
      })
    })
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
})