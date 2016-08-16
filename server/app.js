var express =  require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

//routes below - link to all stuff in books file in routes;
var books = require('./routes/books');
app.use(bodyParser.urlencoded({ extended: true }));

//everytime we create a new route, bring in via require and also app.use(we are expecting a request to books);
//books looks to var books that points to ./routes/books;
app.use('/books', books);

// Catchall route to show index page;
app.get('/*', function (req, res) {
  var file = req.params[0] || '/views/index.html';
  res.sendFile(path.join(__dirname, './public', file));
});

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function () {
  console.log('Listening on port ', app.get('port'));
});
