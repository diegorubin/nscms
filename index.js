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
    var collection = db.get('templates');

    // saving in mongo
    collection.remove({key: template.key});
    collection.insert(template, function(err, doc){
      if(err) { console.log(err); }
    });


    res.status(200).send('ok');
});

app.post('/api/partials', function(req, res) {
    var partial = req.body;
    var db = req.db;
    var collection = db.get('partials');

    // saving in mongo
    collection.remove({key: partial.key});
    collection.insert(partial, function(err, doc){
      if(err) { console.log(err); }
    });


    res.status(200).send('ok');
});

app.get('/:template', function(req, res){
    var db = req.db;
    var key = req.params.template;

    db.get('templates').find({key: key}, {}, function(err, templates){
      if (!err && templates[0]) {
        var template = templates[0];

        // recover partials
        var partial_keys = [];

        var re = /\{\{#def.(\w+)\}\}/g;
        var def = {};
        var m;

        do {
            m = re.exec(template.content);
            if (m) {
              partial_keys.push(m[1]);
            }
        } while (m);

        db.get('partials').find({key: {$in: partial_keys}}, {}, function(err, partials){

          for(var partial in partials) {
            def[partials[partial].key] = partials[partial].content;
          }

          var render = dot.compile(template.content, def);
          var result = render({title: "home", body: "teste do body"});

          res.status(200).send(result);
        });

      } else {
        res.status(404).send(result);
      }
    });
});

app.get('/partials/:partial', function(req, res){
    var db = req.db;
    var key = req.params.partial;

    db.get('partials').find({key: key}, {}, function(err, partials){
      if (!err && partials[0]) {
        var partial = partials[0];
        res.status(200).send(partial);
      } else {
        res.status(404).send(result);
      }
    });
});

app.listen(port);
console.log('starting server');

