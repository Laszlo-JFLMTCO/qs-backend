const dbService = require('./lib/models/database-service')



const whichTable = 'foods'
  // dbService.addToDatabase(whichTable, 'namefromdbservice', 99)
  dbService.returnLastItem('foods')
  // database.raw('INSERT INTO foods (name, calories) VALUES (?, ?)', ['test', 111])
  .then( (data) => {
    process.exit();
  });
