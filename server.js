var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');



// configuration ================

mongoose.connect('mongodb://localhost/toDo');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));
app.use(methodOverride());

// define model ===================

var Todo = mongoose.model('Todo', {
	text : String,
	done: Boolean
});

// routes ========================

	// api -----------------------
	// get all todos
	app.get('/api/todos', function(req, res){
		Todo.find(function(err, todos){
			if (err)
				res.send(err)
			res.json(todos);
		});
	});

	// create todo and send back all todos after creation
	app.post('/api/todos', function(req, res){

		// create todo with information from AJAX request from Angular
		Todo.create({
			text : req.body.text,
			done: false
		}, function(err, todo) {
			if (err)
				res.send(err);
			// get and return all todos after another is created
			Todo.find(function(err, todos){
				if (err)
					res.send(err)
				res.json(todos);
			});
		});
	});

	//delete a todo
	app.delete('/api/todos/:todo_id', function(req, res){
		Todo.remove({
			_id : req.params.todo_id
		}, function(err, todo) {
			if (err)
				res.send(err);
			// get and return all todos after another is deleted
			Todo.find(function(err, todos){
				if (err)
					res.send(err)
				res.json(todos);
			});			
		});
	});

	app.put('/api/todos/:todo_id', function(req, res){
		Todo.findById(
			{_id : req.params.todo_id},
		function(err, todo) {
				if (err)
					res.send(err);
				todo.done = !todo.done;
				todo.save(function(err){
					if(err)
						res.send(err)
				});
			// get and return all todos after update
			Todo.find(function(err, todos){
				if (err)
					res.send(err)
				res.json(todos);
			});			
		});
	});


//aplication ==============================================
app.get('*', function(req, res){
	res.sendFile('./public/index.html'); //load the single view
});




// listen on 8080 ==================

app.listen(8080, function(){
	console.log("App listening on port 8080");
});