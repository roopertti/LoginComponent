var express = require('express');
var app = express();
var path = require('path');
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require('body-parser');
var sha1 = require('sha1');

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var url = 'mongodb://localhost:27017/logindata';
var salt = "oTQzsGB03llIUXMbL80V";

app.get('/login', function(req, res){
	var username = req.query.username;
	var password = sha1(salt + req.query.password);
	console.log(req.query);
	console.log("searching for user " + username);

	mongo.connect(url, function(err, db){
		var result = null;

		assert.equal(null, err);
		var cursor = db.collection('userdata').find({"username": username, "password": password});
		cursor.forEach(function(doc, err){
			assert.equal(null, err);
			console.log(doc.username + " found");
			result = doc;			
		}, function(){
			db.close();
			if(result != null){
				res.send(true);
			} else {
				console.log("user was not found");
				res.send(false);
			}
		});	
	});		
});

/*app.post('/register', function(req, res){

	//TODO
});*/

app.listen(8080);
console.log('App listening to port 8080');