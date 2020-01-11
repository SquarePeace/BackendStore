'use strict'

var validator = require('validator');
var User = require('../models/user');

var controller ={

    signup: (req, res) => {
        //recoger la data por medio de los parametros
        var params = req.body;
        //validar los datos con validator
        try {
             var validate_email = !validator.isEmpty(params.email);
             var validate_password = !validator.isEmpty(params.password);
            
        } catch (error) {
            return res.status(200).send({
                error: 'ERROR',
                message: 'Faltan datos por enviar'
    
            });
        }

        if(validate_email && validate_password){

            // message: 'Validacion Correcta!!!';
             var user = new User();
 
             user.email = params.email;
             user.password = params.password;
             
             user.save((error, UserStored) => {
 
                 if (error || !UserStored) {
                     
                     return res.status(404).send({
         
                         status: 'Error',
                         message: 'El Usuario no se ha guardado'
                     });
                 }
                    return res.status(202).send({
                        status: 'success',
                        article: UserStored     
                    });                                     
             }); 
         }
    }, //termina el metodo signup

    signin: (req, res) =>{

        User.findOne({'email': req.body.email},(err, user) =>{
            if (!user)
            { res.json({message: 'Login fallido, usuario no encontrado'})}
            else{
    
            user.comparePassword(req.body.password, (err, isMatch)=>{
                if(err) throw err;
                if(!isMatch) return res.status(400).json({
                    message: 'Contraseña incorrecta'
                });
                res.status(200).send('Login Exitoso!')
            })
          }
        })
    }
}

module.exports = controller;

