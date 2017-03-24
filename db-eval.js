const environment = process.env.NODE_ENV || 'test';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const whichTable = 'foods'
  database.raw('SELECT max(id) FROM ' + whichTable)
  // database.raw('INSERT INTO foods (name, calories) VALUES (?, ?)', ['test', 111])
  .then( (data) => {
    console.log(data.rows[0].max)
    process.exit();
  });
