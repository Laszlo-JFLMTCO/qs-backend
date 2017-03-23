const environment = process.env.NODE_ENV || 'test';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);


  // database.raw('SELECT * FROM foods')
  database.raw('INSERT INTO foods (name, calories) VALUES (?, ?)', ['test', 111])
  .then( (data) => {
    console.log(data)
    process.exit();
  });
