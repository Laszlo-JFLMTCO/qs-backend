const environment = process.env.NODE_ENV || 'development'
const configuration = require('../../knexfile')[environment]
const database = require('knex')(configuration)

module.exports = {
  clearDatabase: clearDatabase,
  addToDatabase: addToDatabase
}

function clearDatabase(){
  return database.raw('TRUNCATE foods RESTART IDENTITY')
}

function addToDatabase(whichTable, foodName, foodCalories){
  return database.raw('INSERT INTO ' + whichTable + ' (name, calories) VALUES (?, ?)', [foodName, foodCalories])
}