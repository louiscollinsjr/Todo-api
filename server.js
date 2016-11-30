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
app.get('/todos', function (req, res) {
    res.json(todos);
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
        
    if ( !_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0 ){
        return res.status(400).send();
    }
   
    body.description = body.description.trim();
    console.log(body);
    body.id = todoNextId++;
    todos.push(body);
    //console.log('description:' + body.description);
    res.json(body);
});



app.listen(PORT, function () {
    console.log('Express listeing on port ' + PORT + '.');
});