var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basicsqlite.sqlite'

});

var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
validate: {
    len: [1, 250]
}
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

sequelize.sync().then(function () {
    console.log('Everything is synced');

    Todo.findById(100).then( function(todo) {
       if (todo) {
           console.log(todo);
       } else {
           console.log('todo not found')
       }
     });
 
    //console.log(Todo.toJSON());

    // Todo.create({
    //    description: "Drum. Bum",
    //    completed: true
    // }).then(function(todo){
    //     return Todo.create({
    //         description: 'clean office'
    //     });
    // }).then(function(){
    //     //return Todo.findById(1)
    //     return Todo.findAll({
    //         where: {
    //             description: {
    //                 $like: '%drum%'
    //             }
    //         }
    //     })
    // }).then(function(todos){
    //     if(todos){
    //         todos.forEach(function (todo) {
    //             console.log(todo.toJSON());
    //         });
    //     } else {
    //         console.log('no todo found.')
    //     }

    // }).catch(function(e) {
    //     console.log(e);
    // });
});
