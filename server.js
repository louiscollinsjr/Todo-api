var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;

var _ = require('underscore');
var db = require('./db.js');

app.use(bodyParser.json());
var todos = [];



var todoNextId = 1;

app.get('/', function (req, res) {
    res.send('TODO API Root.');
});

// GET /todos
// todos?completed=true&q=work

app.get('/todos', function (req, res) {
    var query = req.query;
    var where = {};


    if (query.hasOwnProperty('completed') && query.completed === 'true') {
        where.completed = true
    } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
        where.completed = false
    }

    if (query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {
            $like: '%' + query.q + '%'
        };
    }

    db.todo.findAll({ where: where }).then(function (todos) {
        res.json(todos);
    }), function (e) {
        return res.status(500).send();
    }
});



// POST
app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    db.todo.create(body).then(function (todo) {
        res.json(todo.toJSON());
    }).then(function (e) {
        return res.status(400).json(e);
    });
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
    var todoID = parseInt(req.params.id, 10);

    db.todo.findById(req.params.id).then(function (todo) {
        if (!!todo) {
            res.json(todo.toJSON());
        } else {
            res.status(404).send();
        }
    }, function (e) {
        return res.status(500).json(e);
    });
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);

    db.todo.destroy({
        where: {
            id: todoId
        }
    }).then(function(rowsDeleted) {
        if (rowsDeleted === 0) {
            res.status(404).json({ "error": "no todo found with that value" });
        } else {
            res.status(204).send();
        }
    }, function () {
          return res.status(500).send();  
    });
  
});

// PUT /todos/:id

app.put('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    
    var body = _.pick(req.body, 'description', 'completed');
    var attributes = {};


    //body.hasownproperty('completed');
    if (body.hasOwnProperty('completed') ) {
        attributes.completed = body.completed;
    } 

    //body.hasownproperty('description');
    if (body.hasOwnProperty('description') ) {
        attributes.description = body.description;
    } 

    db.todo.findById(todoId).then(function (todo) { 
        if(todo) {
            todo.update(attributes).then(function(todo) {
        res.json(todo.toJSON());
    }, function(e) {
        res.status(400).json(e);
    });
        } else {
            res.status(404).send();
        }
    }, function() {
        res.status(500).send();
    })
});

db.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        console.log('Express listeing on port ' + PORT + '.');
    });
});