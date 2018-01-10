var storage = require('./storage.js');
var restify = require('restify');
var server = restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());


var sto = new storage.Storage();

function format(appId, instanceId) {
    var d = new Date();    
    return {
        appId: appId,
        instanceId: instanceId,
        timestamp: d.getTime()
    }
}

//salva qualquer entidade
server.post('/:appId/:instanceId/create', (req, res, next)=>{
    var appId = req.params["appId"];
    var instanceId = req.params["instanceId"]
    sto.create(appId, instanceId, req.body);

    res.send(200);
});

server.post('/:appId/:instanceId/commit', (req, res, next)=>{
    var appId = req.params["appId"];
    var instanceId = req.params["instanceId"]
    sto.commit(appId, instanceId, req.body);

    res.send(format(appId, instanceId));
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

server.get('/:appId/:instanceId/first', (req, res, next)=>{  
    var appId = req.params["appId"];
    var instanceId = req.params["instanceId"];
    var list = sto.history(appId, instanceId);
    res.send(list && list.length > 0? list[0]: undefined);
});

server.listen(9091, function() {
    console.log('%s listening at %s', server.name, server.url);
});