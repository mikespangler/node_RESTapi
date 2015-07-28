var express    = require('express');
var app        = express();
var bodyParser = require('body-parser'); 
var morgan     = require('morgan'); 
var mongoose   = require('mongoose'); 
var port       = process.env.PORT || 8080

// Connect to DB
mongoose.connect('mongodb://localhost:27017/api');


// Body Parser allows use to grab info from POST requests 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure  app to handle CORS requests
app.use(function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \ Authorization');
  next();
});

// Log Requests to Console
app.use(morgan('dev'));

// API Routes
app.get('/', function(req,res){
  res.send('Welcome to the home page!')
});

// Create new router instance for API

var apiRouter = express.Router();

apiRouter.get('/',function(req,res){
  res.json({ message: 'welcome to the api!'})
});

// Register Routes for API prefix
app.use('/api', apiRouter);

app.listen(port);
console.log('Magic happens on port ' + port);
