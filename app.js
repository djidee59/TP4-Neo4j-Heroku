var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
// heroku: on récupère le port sur lequel heroku à ouvert l'app
const PORT = process.env.PORT || 3000;

var app = express();

// Body parser pour récupérer facilemnt les élements du DOM
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// INIT NEO4J
var neo4j = require('neo4j-driver').v1;
var graphenedbURL = process.env.GRAPHENEDB_BOLT_URL;
var graphenedbUser = process.env.GRAPHENEDB_BOLT_USER;
var graphenedbPass = process.env.GRAPHENEDB_BOLT_PASSWORD;
var driver = neo4j.driver(graphenedbURL, neo4j.auth.basic(graphenedbUser, graphenedbPass));

// TEST NEO4J
var session = driver.session();

// dossier views et EJS pour le render
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

// ROOT
app.get('/', function(req,res){

	session
	    .run('MATCH(n:Person) RETURN {n, id2 : ID(n) }')
	    .then(function(result) {
	    	var personArr = [];
	        result.records.forEach(function(record) {
	        	personArr.push({
	        		id: id2,
	        		name: record._fields[0].properties.name,
	        		age: record._fields[0].properties.age,
	        	});
	        });

	        res.render('index',{
	        	persons: personArr,
	        });
	    })
	    .catch(function(error) {
	        console.log(error);
	    });

});

// AJOUT PERSONNE
app.post('/person/add',function(req,res){
	var nom = req.body.nom;
	var age = req.body.age;

	session
		.run('CREATE(n:Person {name:{nameParam},age:{ageParam}})', {nameParam: nom, ageParam: age})
		.then(function(result){
			res.redirect('/');
			session.close();
		})
		.catch(function(err){
			console.log(err);
		});

});

// SUPPRESSION DB
app.post('/db/delete',function(req,res){

	session
		.run('MATCH(n) DETACH DELETE n')
		.then(function(result){
			res.redirect('/');
			session.close();
		})
		.catch(function(err){
			console.log(err);
		});

});

// on lance l'écoute
app.listen(PORT);
console.log('Server started on Port ' + PORT);