var express = require('express');
var dot = require('dot');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 3001;

var mongo = require('mongodb');
var monk = require('monk');

/* express configuration */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
 
/* mongo configuration */
var db = monk('localhost:27017/nscms');
app.use(function(req,res,next){
    req.db = db;
    next();
});

/* actions */
app.post('/api/templates', function(req, res) {
    var template = req.body;
    var db = req.db;

    // saving in mongo
    db.get('templates').insert(template);


    res.status(200).send('ok');
});

app.get('/:template', function(req, res){
    var db = req.db;
    var key = req.params.template;

    db.get('templates').find({key: key}, {}, function(err, templates){
      var template = templates[0];
      var render = dot.template(template.content);
      var result = render({title: "home default", body: "teste do body"});
      res.status(200).send(result);
    });
});

app.listen(port);
console.log('starting server');

