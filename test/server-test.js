const assert = require('chai').assert
const request = require('request')

const server = require('../lib/server')

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
        console.log('sdfsdfsdfsdf');
        if (error) { done(error) }
        foods = JSON.parse(response.body)
        assert.equal(foods.length, 1)
        assert.equal(foods.first.id, food.id)
        assert.equal(foods.first.name, food.name)
        assert.equal(foods.first.calories, food.calories)
      done()
      })
    })
  })
})