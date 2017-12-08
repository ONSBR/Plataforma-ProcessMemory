var storage = require('./storage.js');
var restify = require('restify');
var server = restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());


var sto = new storage.Storage();



//salva qualquer entidade
server.post('/:appId/create', (req, res, next)=>{
    var id = sto.create(req.params["appId"], req.body)
    res.send(id);
});

server.post('/:appId/:instanceId/commit', (req, res, next)=>{
    var id = sto.commit(req.params["appId"], 
                        req.params["instanceId"],
                        req.body);
    res.send(id);
});

server.get('/:appId/findLast', (req, res, next)=>{    
    var appId = req.params["appId"];
    res.send(sto.findLast(appId));
});

server.get('/:appId/:instanceId/findAll', (req, res, next)=>{  
    var appId = req.params["appId"];
    var instanceId = req.params["instanceId"];
    res.send(sto.findAllInstance(appId, instanceId));
});

server.listen(9091, function() {
    console.log('%s listening at %s', server.name, server.url);
});