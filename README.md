# Todo- list server
Basic Express/Node Server using Mongoose to preform CRUD actions

Added users model, basic and bearer auth functionality to restrict access to the database.

ACL implemented to allow basic access (read) to all users with a jwt; create/update/delete functions are restricted to editor and admin levels of access.

## Author: Anne Thorsteinson

**[Tests](https://github.com/AnneThor/api-server/actions)**

**[Front End](https://at-taskmanager.herokuapp.com/)**

## Setup

```.env``` requirements:

- ```PORT``` - port number
- `MONGO_URI` - mongo db connection

## Running the App

- ```npm start```
- Endpoints:
* ```/product``` or ```/category``` will return a json list of all current records including the id and data about the item
* ```/product/:id``` or ```/category/:id``` will return just the item at the supplied id
* ```POST``` requests to ```/product``` or ```category``` will create a new item with a mongoose hashed index and the data from the ```req.body``` (product and categories have slightly different models, so different details will display)
* ```PUT``` requests to ```/product/:id``` or ```/category/:id``` will find the item at the given index from the respective database and update the data stored in that index with the data from ```req.body```
* ```DELETE``` requests to ```/product/:id``` or ```/category/:id``` will delete the item at the provided index (if it exits) and will return the item that was removed

## Tests

- Unit Tests: ```npm run test``` (tests for server, routes, and models currently implemented)
- Lint Tests: ```npm run lint```(these lint tests are still not running properly with the global command)


## UML Diagram

