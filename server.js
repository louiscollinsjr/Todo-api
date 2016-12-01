var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;

var _ = require('underscore');

app.use(bodyParser.json());
var todos = [];



var todoNextId = 1;

app.get('/', function (req, res) {
    res.send('TODO API Root.');
});

// GET /todos
// todos?completed=true&q=work

app.get('/todos', function (req, res) {
    var queryParams = req.query;
    var filteredTodos = todos;
    // if has property and completed
    // call .where; set filteredTodos

    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
        filteredTodos = _.where(filteredTodos, { completed: true });
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        filteredTodos = _.where(filteredTodos, { completed: false });
    }
  // filteredTodos.indexOf(queryParams.q)
  if ( queryParams.hasOwnProperty('q') && queryParams.q.length > 0 ) {
        filteredTodos = _.filter(filteredTodos, function (todo) {
             return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;  
            });
    } 

    res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
    var todoID = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, { id: todoID });


    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(400).send();
    }
});

// POST

app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }

    body.description = body.description.trim();
    console.log(body);
    body.id = todoNextId++;
    todos.push(body);
    //console.log('description:' + body.description);
    res.json(body);
});

// DELETE /todos/:id

app.delete('/todos/:id', function (req, res) {
    var todoID = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, { id: todoID });

    if (!matchedTodo) {
        res.status(404).json({ "error": "no todo found with that value" });
    } else {
        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo);
    }
});

// PUT /todos/:id

app.put('/todos/:id', function (req, res) {
    var todoID = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, { id: todoID });
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};


    if (!matchedTodo) {
        return res.status(404).send();
    }

    //body.hasownproperty('completed');
    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }

    //body.hasownproperty('description');
    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }

    //Ready to update
    _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);
});

app.listen(PORT, function () {
    console.log('Express listeing on port ' + PORT + '.');
});