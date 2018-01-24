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
server.post('/:instanceId/create', (req, res, next)=>{
    var instanceId = req.params["instanceId"]
    if(!req.body){
        sto.create(instanceId, {});
    }else{
        sto.create(instanceId, req.body);
    }


    res.send(200);
});

server.post('/:instanceId/commit', (req, res, next)=>{
    var instanceId = req.params["instanceId"]
    sto.commit(instanceId, req.body);

    res.send(format(instanceId));
});

server.get('/:instanceId/head', (req, res, next)=>{
    var instanceId = req.params["instanceId"];
    res.send(sto.head(instanceId));
});

server.get('/:instanceId/history', (req, res, next)=>{
    var instanceId = req.params["instanceId"];
    res.send(sto.history(instanceId));
});

server.get('/:instanceId/first', (req, res, next)=>{
    var instanceId = req.params["instanceId"];
    var list = sto.history(instanceId);
    res.send(list && list.length > 0? list[0]: undefined);
});

var port = process.env.PORT || 9091;
server.listen(port, function() {
    console.log('%s listening at %s', server.name, server.url);
});
