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
	    .run('MATCH(n:Person) RETURN n')
	    .then(function(result) {
	    	var personArr = [];
	        result.records.forEach(function(record) {
	        	personArr.push({
	        		id : record.get(0).identity,
	        		name: record._fields[0].properties.name,
	        		age: record._fields[0].properties.age,
	        		job: record._fields[0].properties.job,
	        	});
	        });

	    session
	    	.run('MATCH(n:Building) RETURN n')
	    	.then(function(result2){
	    		var buildingArr = [];
	    		result2.records.forEach(function(record){
					buildingArr.push({
					id : record.get(0).identity,
					name: record._fields[0].properties.name,
					adress: record._fields[0].properties.adress,
					});
				})

	    		// RENDER avec personnes et batiments
		    	res.render('index',{
		        	persons: personArr,
		        	buildings: buildingArr
		        });

	    	})
	    	.cath(function(error){
	    		console.log(error);
	    	})

	    })
	    .catch(function(error) {
	        console.log(error);
	});

});

// AJOUT PERSONNE
app.post('/person/add',function(req,res){
	var nom = req.body.nom;
	var age = req.body.age;
	var job = req.body.job;

	session
		.run('CREATE(n:Person {name:{nameParam},age:{ageParam}, job:{jobParam}})', {nameParam: nom, ageParam: age, jobParam: job})
		.then(function(result){
			res.redirect('/');
			session.close();
		})
		.catch(function(err){
			console.log(err);
		});

});

// SUPPRESSION PERSONNE
app.get('/pers/del/:id', function(req, res) {
    if (req.params.id != '') {
        var id = parseInt(req.params.id,10);
        console.log("suppression personne: " + id);

        session
        .run('MATCH (n) where id(n) = 23 DETACH DELETE n', {iddPAram: id})
		.then(function(result){
			res.redirect('/');
			session.close();
		})
		.catch(function(err){
			console.log(err);
		});

    }
    res.redirect('/');
});

// AJOUT lIEU
app.post('/building/add',function(req,res){
	var nom = req.body.nameBat;
	var adress = req.body.adresse;

	session
		.run('CREATE(n:Building {name:{nameParam},adress:{adressParam}})', {nameParam: nom, adressParam: adress})
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

