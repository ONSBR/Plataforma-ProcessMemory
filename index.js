var repo = require("./repository.js");
var database = require("./database.js");
var utils = require("./utils.js");
var restify = require('restify');
var server = restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());


var bd = new database.Database("teste");

var doc = {
    _transaction: {},
    _command: {},
    _document: {
        _type: "Document",
        id: utils.guid(),
        hello:"World"
    }
}

//salva qualquer entidade
server.post('/:entity/create', (req, res, next)=>{
    var doc = {};
    doc._document = req.body;
    doc._document._type= req.params["entity"];
    doc._document.id = utils.guid();
    bd.save(doc,"master","sistema","dado salvo");
    res.send(doc._document.id);
});

server.post('/:entity/:instanceId/commit', (req, res, next)=>{
    var doc = {};
    doc._document = req.body;
    doc._document._type= req.params["entity"];
    doc._document.id = req.params["instanceId"];
    bd.save(doc,"master","sistema","dado salvo");
    res.send(doc._document.id);
});

server.get('/:entity/findAll', (req, res, next)=>{    
    var entity = req.params["entity"];
    res.send(bd.find_all(entity));
});

server.listen(9091, function() {
    console.log('%s listening at %s', server.name, server.url);
});