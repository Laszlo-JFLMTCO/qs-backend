QS BackEnd

This is an internal API which was built with the purpose to provide a backend behind the QS FrontEnd Calorie Tracker app.  
There has been a special focus on creating RESTful routes for CRUD functionality of both the `foods-list` and `meal-diary` functionality of the QS FrontEnd.

This API provides the following endpoints:  
- `GET /api/foods`: returns all items from the Foods List. The return value is an array of food objects in `JSON`  
Example:  
Request: `GET /api/foods`  
Response:  
  ```
  HTTP code: 200
  {[
    {
      id: 1111111,
      name: 'FoodName1',
      calories: '111'
    },
    {
      id: 222222,
      name: 'FoodName2',
      calories: '222'
    }
  ]}
  ```
- `GET /api/foods/:id`: returns details of a single food item with `id`. The `id` is a unique number generated when the new food item is created. When there is no food item with the requested `id`, an HTTP status `404` will be returned. 
Example:  
Request: `GET /api/foods/9876543210`  
Response:  
  ```
  HTTP status: 200
  {
    id: 9876543210,
    name: 'FooodName',
    calories: '123'
  }
  ```
- `POST /api/foods`: adds a food item to the foods list. It returns a copy of the entire foods item object upon successfully adding the new food item to the foods list. If the request is incomplete, it returns a `402` HTTP status along with a `JSON` formatted error message.     Example:  
Complete input request:  
  ```
  {
    name: 'FoodName',
    calories: '123'
  }
  ```
  Return value when submission was successful:  
  ```
  HTTP status: 200
  {
    id: 9876543210,
    name: 'FoodName',
    calories: '123'
  }
  ```
  Return value when submission details were incomplete (name and/or calories missing):
  ```
  HTTP status: 402
  {
    status: 402,
    details: 'Food detail missing'
  }
  ```
- `PUT /api/foods/:id`: update the details of the selected food item with `id`. All food details (name, calories) have to sent. There is no logic implemented on the BackEnd side to try to find out one or both of the values need to be updated. Once the food item is updated, it will return an `HTTP status 200` and readout of the updated updated food item object as a `JSON`.  
Example:  
Request: `PUT /api/foods/9876543210` with the following food details submitted:  
  ```
  {
    name: 'UpdatedName',
    calories: 'SameCalories'
  }
  ```
  Response:  
  ```
  HTTP status: 200
  {
    id: 9876543210,
    name: 'UpdatedName',
    calories: 'SameCalories'
  }
  ```