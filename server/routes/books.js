var express = require('express');

//in order to use as a router
var router = express.Router();
//making a connection string:
//first make a connect to PG and require it;
var pg = require('pg');
//tell it where it is located with the connection string;
//5432 is default postgress localhost;
//omicron is name of database;
var connectionString = 'postgres://localhost:5432/omicron';

router.get('/', function (req, res) {
  //retreive books from database
  //do message OK to see if it works;
  // res.send({ message: 'OK' });
  //first parameter is where am I going to connect to (connectionString var that we set)
  //second is a function: err: what happens if there is an error; client: calls the query on the client;
  pg.connect(connectionString, function(err, client, done){
    //this is where we will actually preform the query
    if(err) {
      //500 is pretty much an error code;
      res.sendStatus(500);
    }
    //client.query takes in two functions: 1st is query we are writing;
    //second is a func - 2 parameters: error then the actual result;
    client.query('SELECT * FROM books', function(err, result){
      //done here because we are done with the connection; we can run 10 at a time; if we dont call done, it will stay open; put it here; closes connection-query is done!
      done();

      if(err){
        res.sendStatus(500);
      }

      //we just want to send the rows back: the actual result are the rows in the database;
      res.send(result.rows);
    });
  });
});

router.post('/', function(req, res){
  //set a var to ref the body - where all the stuff is;
  var book = req.body;

  pg.connect(connectionString, function (err, client, done){
    if(err){
      res.sendStatus(500);
    }
    //dont need parenthesis like we did in portico; props of the database
    client.query('INSERT INTO books (author, title, published, publisher, edition)'
                //those blings represent the columns (instead of contatonating the values); using $references; will always match the first field, second, etc.
                //use this because of SQL injections: get data from browser from form that has a SQL query in it, might mess everthing up; this will prevent it from happening;
                + 'VALUES ($1, $2, $3, $4, $5)',
                //propertities on the object;
                [book.author, book.title, book.published, book.publisher, book.edition],
                function(err, result){
                  done();

                  if(err){
                    res.sendStatus(500);
                  }
                  //201 is created, more specific than 200
                  res.sendStatus(201);
                });
  });
});

//do this to make it avail to app.js
module.exports = router;
