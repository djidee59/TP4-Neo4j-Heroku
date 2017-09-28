var express = require('express');
var path = require('path');
// heroku: on récupère le port sur lequel heroku à ouvert l'app
const PORT = process.env.PORT || 3000;

var app = express();

// INIT NEO4J
var neo4j = require('neo4j-driver').v1;
var graphenedbURL = process.env.GRAPHENEDB_BOLT_URL;
var graphenedbUser = process.env.GRAPHENEDB_BOLT_USER;
var graphenedbPass = process.env.GRAPHENEDB_BOLT_PASSWORD;
var driver = neo4j.driver(graphenedbURL, neo4j.auth.basic(graphenedbUser, graphenedbPass));

// TEST NEO4J
var session = driver.session();
var name = "Bob";
session
    .run('CREATE(n:Person {name:{nameParam}})', {nameParam: name})
    .then(function(result) {
        result.records.forEach(function(record) {
            console.log(record)
        });

        session.close();
    })
    .catch(function(error) {
        console.log(error);
    });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(req,res){
	res.render('index');
});

// on lance l'écoute
app.listen(PORT);
console.log('Server started on Port ' + PORT);