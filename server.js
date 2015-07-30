var express    = require('express');
var app        = express();
var bodyParser = require('body-parser'); 
var morgan     = require('morgan'); 
var mongoose   = require('mongoose'); 
var jwt        = require('jsonwebtoken');
var port       = process.env.PORT || 8080

// Connect to DB
mongoose.connect('mongodb://localhost:27017/api');

// Pull in User Model
var User = require('./app/models/user');

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

// Set Auth Token Secret
var superSecret = 'hamburgerhamlet';

// API Routes
app.get('/', function(req,res){
  res.send('Welcome to the home page!')
});

// Create new router instance for API

var apiRouter = express.Router();

apiRouter.post('/authenticate', function(req,res){
  User.findOne({
    username: req.body.username
  }).select('name username password').exec(function(err, user){
    if (err) throw err;

    if (!user) {
      res.json({
        success: false,
        message: 'Auth Failed, User Not Found'
      });
    } else if (user) {
      var validPassword = user.comparePassword(req.body.password);
      if (!validPassword) {
        res.json({
          success: false,
          message: 'Auth Failed.  Invalid Password'
        })
      } else {
        console.log('TOKEN ISSUED');
        var token = jwt.sign({
          name: user.name,
          username: user.username
        }, superSecret, {
          expiresInMinutes: 1440
        });

        res.json({
          sucess: true,
          message: 'Enjoy that Token!',
          token: token
        });
      }
    }
  });
});

apiRouter.use(function(req,res,next){
  console.log('We have a piping hot request!')
  var token = req.body.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, superSecret, function(err, decoded){
      if (err) {
        console.log("err")

        return res.status(403).send({
          success: false,
          message: 'Failed to Authenticate Token'
        });
      } else {
        req.decoded = decoded
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No Token Provided'
    });
  }
});

apiRouter.get('/',function(req,res){
  res.json({ message: 'welcome to the api!'});
});

apiRouter.route('/users')

  .post(function(req, res){
    var user = new User();

    user.name     = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;

    user.save(function(err){
      if (err) {
        if (err.code == 11000) { // duplicate entry
          return res.json({ success: false, message: 'A user with that\ username already exists. '});
        } else {
          return res.send(err);
        }
      }

      res.json({ message: 'User Created!' });
    })
  })

  .get(function(req,res){
    User.find(function(err, users){
      if (err) res.send(err);
      res.json(users);
    });
  });

apiRouter.route('/users/:user_id')
  .get(function(req,res){
    User.findById(req.params.user_id, function(err,user){
      if (err) res.send(err);
      res.json(user);
    })
  })

  .put(function(req,res){
    User.findById(req.params.user_id, function(err,user){
      if (err) res.send(err);

      if (req.body.name)     user.name = req.body.name;
      if (req.body.username) user.username = req.body.username;
      if (req.body.password) user.password = req.body.password;

      user.save(function(err){
        if (err) res.send(err);
        res.json({ message: 'User Updated!' });
      })
    })
  })

  .delete(function(req,res){
    User.remove({
      _id: req.params.user_id
    }, function(err, user) {
      if (err) return res.send(err);
      res.json({ message: 'Successfully Deleted!'});
    });
  });

apiRouter.get('/me', function(req,res){
  res.send(req.decoded);
});

// Register Routes for API prefix
app.use('/api', apiRouter);

app.listen(port);
console.log('Magic happens on port ' + port);
