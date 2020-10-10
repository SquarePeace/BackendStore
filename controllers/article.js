'use strict'

var validator = require('validator');
var Article = require('../models/article');
var fs = require('fs');
var path = require('path');

var controller ={

    save: (req, res) => {
        //recoger la data por medio de los parametros
        var params = req.body;
        //validar los datos con validator
        try {
             var validate_name = !validator.isEmpty(params.name);
             var validate_price = !validator.isEmpty(params.price);
            
        } catch (error) {
            return res.status(200).send({
                error: 'ERROR',
                message: 'Faltan datos por enviar'
    
            });
        }

        if(validate_name && validate_price){

            // message: 'Validacion Correcta!!!';
             var article = new Article();
 
             article.name = params.name;
             article.price = params.price;

             if (params.image) {
                 article.image = params.image;
             } else {
                article.image = null;
             }
             
             article.save((error, articleStored) => {
 
                 if (error || !articleStored) {
                     
                     return res.status(404).send({
         
                         status: 'Error',
                         message: 'El articulo no se ha guardado'
                     });
                 }
                    return res.status(202).send({
                        status: 'success',
                        article: articleStored     
                    });                                     
             }); 
         }
    }, //termina el metodo save

    getArticles: (req, res) => {

        var query = Article.find({});
        var last = req.params.last;

        if (last || last != undefined) {
            query.limit(5);
        }

        query.sort('-_id').exec((error, articles) => {

            if (error) {
                
                return res.status(500).send({
                    status: 'error',
                    article: "Error al devolver los articulos"     
                });

            }else if (!articles) {
                
                return res.status(404).send({
                    status: 'error',
                    article: "No hay articulos para mostrar"     
                });
            }

            return res.status(202).send({
                status: 'success',
                articles    
            });
                
        });
    },


    getArticle: (req, res) =>{
        //recoger el id por medio de la url...
        var articleId = req.params.id;

        if (!articleId || articleId == null) {
            
            return res.status(500).send({
                status: 'error',
                article: "No existe el articulo"     
            });
    } 

    Article.findById(articleId,(error, article) => {

        if (error || !article) {
            return res.status(404).send({
                status: 'error',
                article: "No existe el articulo"     
            });
        }
        
        return res.status(200).send({
            status: 'success',
            article    
        });

    });
    }, //termina el metodo getArticulo

    update: (req, res) => {

        var articleId = req.params.id;
        var params = req.body;

        try {
            
            var validate_name = !validator.isEmpty(params.name);
            var validate_price = !validator.isEmpty(params.price);

        } catch (error) {
            
            return res.status(200).send({
                status: 'ERROR',
                message: 'Faltan datos por enviar!'
            });
        }

        if (validate_name && validate_price) {
            
            Article.findOneAndUpdate({_id: articleId}, params, {new:true}, (error, articleUpdated) =>{

                if (error) {
                    
                    return res.status(500).send({
                        status: 'ERROR',
                        message: 'Error al intentar actualizar'
                    });
                }
                if (!articleUpdated) {
                    
                    return res.status(404).send({
                        status: 'ERROR',
                        message: 'No existe el articulo'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
               });
            });
        }else{

            return res.status(200).send({
                status: 'ERROR',
                message: 'La Validacion no es correcta'
            });
        }
    }, //termina el metodo update


    delete: (req, res) => {

        var articleId = req.params.id;

        Article.findByIdAndDelete({_id: articleId}, (error, articleRemoved) => {

            if (error) {
                
                return res.status(500).send({
                    status: 'ERROR',
                    message: 'Error al borrar articulo'
                }); 
            }
            if (!articleRemoved) {
                
                return res.status(404).send({
                    status: 'ERROR',
                    message: 'No se ha borrado el articulo, no existe probablemente'
                }); 
            }
            
            return res.status(200).send({
                status: 'Success',
                message: 'Se ha eliminado el articulo',
                article: articleRemoved
            }); 

        });
    }, //termina el metodo delete

    upload: (req, res) =>{

        var file_name = 'Imagen no subida...';

        if (!req.files) {

            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }
        //conseguir nombre y extension del archivo
        var file_path = req.files.file0.path;
        //en WINDOWS
        //var file_split = file_path.split('\\');

        //en Linux y MAC OS
        var file_split = file_path.split('/');
        //nombre del archivo
        var file_name = file_split[2];
        //Extension del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        //comprobar si la extension es de imagenes
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            //borrar archivo subido
            fs.unlink(file_path, (error) => {

                return res.status(200).send({
                    status: 'Error',
                    message: 'La extension de la imagen no es valida!!!'
                }); 
            });
        }else{

            var articleId = req.params.id;

            if (articleId) {
                
                Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new: true}, (error, articleUpdated) =>{

                    if (error || !articleUpdated) {
                        
                        return res.status(200).send({
                            status: 'ERROR',
                            message: 'Error al guardar la imagen...'
                        });  
                    }
    
                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });  
                });

            }else{

                return res.status(200).send({
                    status: 'success',
                    image: file_name
                });  
            }

            
        }
    },//termina el metodo upload

    getImage: (req, res) =>{

        var file = req.params.image;
        var path_file = './upload/articles/'+file;

        fs.exists(path_file, (exists) =>{

            if (exists) {
                
                return res.sendFile(path.resolve(path_file));
            }else{

                return res.status(404).send({
                    status: 'ERROR',
                   message: 'La imagen no existe...'
                });  
            }
        });
    }, //termino del metodo getImage

    search: (req, res) =>{

        var searchString = req.params.search;

        Article.find({"$or":[
            {"name": {"$regex": searchString, "$options": "i"}},
            {"price": {"$regex": searchString, "$options": "i"}}
        ]})
        .sort([['date', 'descending']])
        .exec((error, articles) =>{

            if (error) {
                
                return res.status(404).send({
                    status: 'Error',
                   message: 'ERROR en la peticion...'
                });
            }
            if (!articles || articles.length <= 0) {
                
                return res.status(404).send({
                    status: 'Error',
                   message: 'No hay articulos que coincidan con tu busqueda...'
                });
            }
            
                
                return res.status(200).send({
                    status: 'SUCCESS',
                   articles
                });
        });
    }

}; 

module.exports = controller;