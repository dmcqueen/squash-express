var git = require('git-rev')
var SquashError = require('squash-node').SquashError;
var Squash = require('squash-node').Squash;
var squash = new Squash(); 

var nconf = require('nconf');
var configPath = __dirname + "/../config.json";

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
       console.log('config with revision:'+rev);
});


var writeErr = function (res, err) {
    squash.report(err);

    res.send(500, {
        message: err.toString()
    });
};

exports.index = function(req, res){
  writeErr(res, new SquashError("web problem"));
};
