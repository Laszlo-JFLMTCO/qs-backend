const environment = process.env.NODE_ENV || 'development'
const configuration = require('../../knexfile')[environment]
const database = require('knex')(configuration)

module.exports = {
  clearDatabase: clearDatabase,
  addToDatabase: addToDatabase,
  returnAllEntries: returnAllEntries,
  returnOneEntryById: returnOneEntryById
}

function clearDatabase(){
  return database.raw('TRUNCATE foods RESTART IDENTITY')
}

function addToDatabase(whichTable, foodName, foodCalories){
  return database.raw('INSERT INTO ' + whichTable + ' (name, calories) VALUES (?, ?)', [foodName, foodCalories])
}

function returnAllEntries(whichTable){
  return database.raw('SELECT * FROM ' + whichTable)
}

function returnOneEntryById(whichTable, id){
  return database.raw('SELECT * FROM ' + whichTable + ' WHERE id = ?', [id])
}