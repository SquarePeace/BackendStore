'use strict'


var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://mongo:27017')
.then( () => {

    console.log('Conectado a la base de datos de prueba!!!');   
    
    //creacion del servidor y mensaje del http
    app.listen(port, () => {

        //console.log('servidor creado en http://localhost:'+port);

    });

});
