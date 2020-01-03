'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = Schema({

    name: String,
    price: String,
    date: { type: Date, default: Date.now },
    image: String
});

module.exports = mongoose.model('Article', ArticleSchema);