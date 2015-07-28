var express    = require('express');
var app        = express();
var bodyParser = require('body-parser'); 
var morgan     = require('morgan'); 
var mongoose   = require('mongoose'); 
var port       = process.env.PORT || 8080

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
