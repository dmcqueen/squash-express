/**
 * Module dependencies.
 */
var git = require('git-rev')
var Squash = require('squash-node').Squash;
var squash = new Squash(); 

var nconf = require('nconf');
var configPath = __dirname + "/./config.json";

console.log('loading settings from: ' + configPath);
nconf.file({
    file: configPath
});

git.long(function (rev) {
    squash.configure({ APIHost: nconf.get("squash:apihost"),
           APIKey: nconf.get("squash:apikey"),
           environment: nconf.get("squash:env"),
           revision: rev
       });
       console.log('Squash Config');
       console.log(squash.options);
});

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));

  app.use(function(err, req, res, next){
    console.log("in global error handler");
    console.log(err);
    squash.report(err);
    next();
  });
});

// Routes

app.get('/', routes.index);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
