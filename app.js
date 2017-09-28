var express = require('express');
var path = require('path');
// heroku: on récupère le port sur lequel heroku à ouvert l'app
const PORT = process.env.PORT || 3000;

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(req,res){
	res.render('index');
});

app.listen(PORT);
console.log('Server started on Port ' + PORT);