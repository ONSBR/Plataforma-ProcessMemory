var storage = require('./storage.js');
var restify = require('restify');
var server = restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());


var sto = new storage.Storage();

function format(instanceId) {
    var d = new Date();
    // var response = '{ ' + 
    // '"instanceId"' + ' : ' + '"' + instanceId.toString() + '"' + ' , ' +
    // '"timestamp"' + ' : ' +  '"' + (d.getTime().toString()) + '"' +
    // ' }';

    var response = '{ ' + 
    '"instanceId"' + ' : ' + '"' + instanceId.toString() + '"' + ' , ' +
    '"timestamp"' + ' : ' +  (d.getTime().toString())  +
    ' }';
    return JSON.parse(response);
}

//salva qualquer entidade
server.post('/:appId/create', (req, res, next)=>{
    var id = sto.create(req.params["appId"], req.body);

    res.send(format(id));
});

server.post('/:appId/:instanceId/commit', (req, res, next)=>{
    var id = sto.commit(req.params["appId"], 
                        req.params["instanceId"],
                        req.body);

    res.send(format(id));
});

server.get('/:appId/:instanceId/head', (req, res, next)=>{    
    var appId = req.params["appId"];
    var instanceId = req.params["instanceId"];
    res.send(sto.head(appId,instanceId));
});

server.get('/:appId/:instanceId/history', (req, res, next)=>{  
    var appId = req.params["appId"];
    var instanceId = req.params["instanceId"];
    res.send(sto.history(appId, instanceId));
});

server.listen(9091, function() {
    console.log('%s listening at %s', server.name, server.url);
});