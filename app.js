var express = require('express');
var path = require('path');
// heroku: on récupère le port sur lequel heroku à ouvert l'app
const PORT = process.env.PORT || 3000;

var app = express();

// NEO4J
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(process.env['GRAPHENEDB_URL']);

// TEST NEO4J
db.cypher({
    query: 'CREATE (n:Person {name: {personName}}) RETURN n',
    params: {
        personName: 'Bob'
    }
}, function(err, results){
    var result = results[0];
    if (err) {
        console.error('Error saving new node to database:', err);
    } else {
        console.log('Node saved to database with id:', result['n']['_id']);
    }
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(req,res){
	res.render('index');
});

app.listen(PORT);
console.log('Server started on Port ' + PORT);